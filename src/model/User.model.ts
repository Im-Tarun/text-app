import mongoose,{Document, Mongoose, Schema} from "mongoose";


export interface Message extends Document{
    content: string,
    createdAt: Date
}

const messageSchema: Schema<Message>  = new Schema({
    content:{
        type:String,
        required: true,
    },
    createdAt:{
        type:Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    isAcceptingMsg: boolean;
    messages: Message[]
}

const userSchema: Schema<User> = new Schema({
    username: {
        type:String,
        required: [true, "username is required"],
        unique: [true, "username must be unique"],
        trim: true
    },
    email: {
        type:String,
        required: true,
        unique: [true, "username must be unique"],
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "please use a valid email"]
    },
    password: {
        type:String,
        required: [true,"password is required"],
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    verifyCode: {
        type:String,
        required: true,
    },

    verifyCodeExpiry: {
        type: Date,
        required: true,
    },
    isAcceptingMsg: {
        type: Boolean,
        required: true,
    },
    messages:[messageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", userSchema) 

export default UserModel