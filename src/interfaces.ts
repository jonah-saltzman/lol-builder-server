export interface SignupResponse {
	email: string
}

export interface TokenResponse {
    token: string
}

export interface ApiResponse {
	status: number
	message?: string
	data?: SignupResponse | TokenResponse
	redirect?: string
}

export type AuthType = 'local'

export type AuthSource = 'native' | 'web'