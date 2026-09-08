export type User = {
    user_id: number
    user_name: string
    user_email: string
    user_password: string
    user_role: string
}

export type LoginResponse = {
    message?: string
    token: string
    user: User
}
