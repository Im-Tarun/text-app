import {z} from 'zod'

const verifyCodeSchema = z.object({
    otp : z.string().length(6,"verification code must be of 6 digits")
})

export default verifyCodeSchema