import * as z from "zod/v4"

// Login Types
export const LoginPayloadRequestSchema = z.object({
    username: z.string().nonempty(),
    pass: z.string().nonempty(),
    deviceId: z.string().nonempty(),
})
 
export type LoginPayloadRequest = z.input<typeof LoginPayloadRequestSchema>

// User Route Types
export const GetUserByIdSchema = z.object({
    id: z.string().nonempty()
})

export type GetUserByIdRequest = z.input<typeof GetUserByIdSchema>
