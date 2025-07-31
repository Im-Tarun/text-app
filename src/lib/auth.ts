import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import UserModel from "@/model/User.model" 
import dbConnection from "@/lib/dbConnect" 


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials:{
        identifier: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      authorize: async (credentials : any): Promise<any>=>{
        await dbConnection()
        try {
          const user = await UserModel.findOne({
            $or: [
              {email: credentials.identifier},
              {username: credentials.identifier}
            ]
          }) 
          if(!user){
            throw new Error("User not found iille")
          }
          if(!user.isVerified){
            throw new Error("Please verify your email before login")
          }
          const isPasswordCorrect = await bcrypt.compare( credentials.password , user.password)
          if(!isPasswordCorrect){
            throw new Error("Password does not match")
          }
          
          return user
          
        } catch (err:any) {
          throw new Error(err)
        } 
      }
    })
  ],
  callbacks:{
    async jwt({token, user}){
      if(user){
        token._id = user._id?.toString();
        token.username = user.username;
        token.isAcceptingMsg = user.isAcceptingMsg;
        token.isVerified = user.isVerified;
      }
      return token
    },
    async session({session, token}){
      if(token){
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMsg = token.isAcceptingMsg;
      }
      return session
    }
  }, 
  pages:{
    signIn : '/sign-in'
  },
  session:{
    strategy : "jwt"
  },
  secret : process.env.AUTH_SECRET

})