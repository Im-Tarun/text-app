import dbConnection from "@/lib/dbConnect";
import { auth } from "@/lib/auth";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(req: Request) {
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

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMsg: acceptMessages,
    });
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Accept messages status updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to update accept msg status", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update accept msg status",
      },
      {
        status: 500,
      }
    );
  }
}

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

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMsg: foundUser.isAcceptingMsg,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Failed to get User message details", error);
    return Response.json(
      {
        success: false,
        message: "Failed to get User message details",
      },
      {
        status: 500,
      }
    );
  }
}
