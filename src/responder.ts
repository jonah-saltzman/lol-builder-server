import { Response } from "express"
import { ApiResponse, SignupResponse } from "./interfaces"

export const respond = (res: Response, payload: ApiResponse): void => {
    if (payload.redirect) {
        res.redirect(payload.redirect)
        return
    }
    res.status(payload.status)
    if (payload.status === 500) {
        res.json({message: 'Unknown server error'})
        return
    }
    res.json(new Res(payload))
}

interface Payload {
    data?: SignupResponse
    message?: string
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