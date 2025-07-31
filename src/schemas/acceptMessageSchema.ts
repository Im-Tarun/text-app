import {z} from 'zod' 
 
const acceptMsgSchema = z.object({
    isAcceptingMsg: z.boolean(),
})

export default acceptMsgSchema