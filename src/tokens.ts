import { User } from "./db/models/User"
import { Jwt, JwtPayload, verify, sign } from 'jsonwebtoken'
import { UUID } from "./uuid"
import { AuthSource, AuthType } from "./interfaces"
import { UserToken } from "./db/models/UserToken"

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
}

export class Token {
    private _token: string
	private _data: TokenContent
    private _registered: boolean
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
            source
        }
        this.user = user
        this._data = data
        this._token = sign(this._data, SECRET.string)
        this._registered = false
    }
    async register(): Promise<boolean> {
        if (this._registered) {
            return false
        }
        try {
            const newToken = await UserToken.create({user: this.user, tokenString: this._token, valid: true, userId: this.user.id})
            console.log(newToken)
            this._registered = true
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }
    public static validate(token: string) {
        const decoded = verify(token, SECRET.string)
        console.log(decoded)
    }
    get string(): string {
        return this._token
    }
}

export class InvalidTokenError extends Error {
	constructor(message?: string) {
		super(message || 'Invalid token')
		Object.setPrototypeOf(this, InvalidTokenError.prototype)
	}
}