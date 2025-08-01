import dbConnection from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import UserModel from "@/model/User.model";
import mongoose from "mongoose";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type ParamsContext = {
  params:{
    messageid: string
    }
}

export async function DELETE(
  request: NextRequest ,
  context : { params: { messageid: string } }
) {

  dbConnection();
  const session = await auth();
  const user: User = session?.user as User;
  const {messageid : messageId} = context.params;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication not found",
      },
      {
        status: 404,
      }
    );
  }

  const userMongoId = new mongoose.Types.ObjectId(user._id);
  const messageMongoId = new mongoose.Types.ObjectId(messageId)
  try {
    const updatedUser = await UserModel.updateOne(
      {_id: userMongoId},
      {$pull:{messages:{_id: messageMongoId}}}
    );
    if(updatedUser.modifiedCount == 0){

      return NextResponse.json(
      {
        success: false,
        message: "Message not found or already deleted",
      },
      {
        status: 404,
      });
    }
    
    return NextResponse.json(
      {
        success: true,
        message: "Message deleted succefully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Internal server error ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
