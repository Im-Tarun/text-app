import dbConnection from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(req: Request) {
  dbConnection();
  const session = await auth();
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Authentication not found",
      },
      {
        status: 404,
      }
    );
  }
   
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
   const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    if (!user ) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    } 
    if (user.length === 0) {
      return Response.json(
        {
          success: true,
          message: "No messages found",
        },
        {
          status: 202,
        }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Internal server error in getting messages", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
