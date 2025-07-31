 import {z} from 'zod' 
 
const messageSchema = z.object({
    content: z.string()
    .min(10,{message: "message must be atleast 10 characters"})
    .max(200,{message: "message must be shorter than 200 characters"}),
})

export default messageSchema