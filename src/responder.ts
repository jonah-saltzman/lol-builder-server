import { Response } from "express"
import { ApiResponse, SignupResponse, TokenResponse } from "./interfaces"

interface Payload {
	data?: SignupResponse | TokenResponse
	message?: string
}

export const respond = (res: Response, payload: ApiResponse | null): void => {
    if (!payload || payload.status === 500) {
        res.json({ message: 'Unknown server error' })
		return
    }
    if (payload.redirect) {
        res.redirect(payload.redirect)
        return
    }
    res.status(payload.status)
    res.json(new Res(payload))
}

const Res = function Res(this: Payload, payload: ApiResponse) {
    if (payload.message) {
        this.message = payload.message
    }
    if (payload.data) {
        this.data = payload.data
    }
    return this
} as any as { new (res: Payload): Payload}