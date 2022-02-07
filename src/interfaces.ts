export interface SignupResponse {
    email: string
}

export interface ApiResponse {
    status: number
    message?: string
    data?: 
        | SignupResponse
    redirect?: string
}
