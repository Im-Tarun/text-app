import {z} from 'zod' 

export const signInSchema = z.object({
    identifier: z.string().nonempty({message: "Identifier can not be empty"}),
    password : z.string().min(6, {message: "Password must be atleast 6 characters "})
})

export default signInSchema 