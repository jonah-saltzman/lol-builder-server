import { User } from "./db/models/User"
import { verify, sign } from 'jsonwebtoken'
import { UUID } from "./uuid"
import { AuthSource, AuthType } from "./interfaces"
import { UserToken } from "./db/models/UserToken"
import { Response, Request, NextFunction } from 'express'
import { respond } from "./responder"
import { createToken, findTokenByUuid } from './dal/auth'
import { findUserById } from './dal/users'


declare module 'jsonwebtoken' {
	export interface JwtPayload extends TokenContent{}
}

class Secret {
	protected secret: string
	constructor(secret?: string) {
		this.secret = secret || ''
		if (!secret) {
			throw new Error('Invalid secret')
		}
	}
	get string(): string {
		return this.secret
	}
}

const SECRET = new Secret(process.env.JWT_SECRET)

export interface TokenContent {
	dbId: number
	uuid: UUID
	created: Date
	expires: Date | null
	auth: AuthType
    source: AuthSource
    tokenId: string
}

export class Token {
    private _token: string
	private _data: TokenContent
    private _registered: boolean
    private _tokenId: string
    userToken: UserToken
    user: User
	constructor(user: User, source: AuthSource, type: AuthType) {
        const now = new Date()
        const expires = source === 'native' ? null : new Date(now.getTime() + (1000 * 60 * 60 * 24 * 30))
        const data = {
            dbId: user.id,
            uuid: user.uuid,
            created: now,
            expires: expires,
            auth: type,
            source,
            tokenId: new UUID().toString()
        }
        this.user = user
        this._data = data
        this._token = sign(this._data, SECRET.string)
        this._registered = false
        this._tokenId = data.tokenId
    }
    async register(): Promise<boolean> {
        if (this._registered) {
            return false
        }
        try {
            const newToken = await createToken(this.user, this)
            if (newToken) {
                this._registered = true
                this.userToken = newToken
                return true
            } else {
                return false
            }
        } catch(e) {
            console.error(e)
            return false
        }
    }
    public static async validate(token: string): Promise<[User | null, UserToken | null]> {
        try {
            const decoded = <TokenContent>verify(token, SECRET.string)
            if (decoded.expires && decoded.expires < new Date()) {
                return [null, null]
            }
            try {
                const userToken = await findTokenByUuid(decoded.tokenId)
                const user = await findUserById(decoded.dbId)
                return [user, userToken]
            } catch {
                return [null, null]
            }
        } catch {
            return [null, null]
        }
    }
    get string(): string {
        return this._token
    }
    get id(): string {
        return this._tokenId
    }
}

export class InvalidTokenError extends Error {
	constructor(message?: string) {
		super(message || 'Invalid token')
		Object.setPrototypeOf(this, InvalidTokenError.prototype)
	}
}

export const requireToken = async(req: Request, res: Response, next: NextFunction) => {
    const tokenString = req.header('JWT')
    if (tokenString) {
        const [user, token] = await Token.validate(tokenString)
        if (user && token) {
            if (!token.valid) {
                return respond(res, {message: 'Invalid session', status: 401})
            }
            if (token.userId !== user.id) {
                return respond(res, { message: 'Token does not match user', status: 401 })
            }
            req.user = user
            req.tokenId = token.tokenId
            req.token = token
            next()
        } else {
            return respond(res, {message: 'Invalid token', status: 401})
        }
    } else {
        console.log('no token')
        return respond(res, {message: 'Missing token', status: 401})
    }
}