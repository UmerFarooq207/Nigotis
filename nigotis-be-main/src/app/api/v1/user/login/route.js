import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userAuthGuard } from "@/middleware/user";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const user = await User.findById(authData?.data?._id)
      .select("-password")
      .populate({
        path: "companyId",
        populate: {
          path: "subscriptionId",
          populate: {
            path: "planId",
            model: "Plan",
          },
        },
      })
      .populate("personalInfo")
      .populate({
        path: "jobInfo",
        populate: {
          path: "payrollId",
        },
      });

    const subscriptionCheckData = await subscriptionCheckGuard(
      user?.subscriptionId?._id
    );
    console.log(subscriptionCheckData);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...user?._doc,
          token: await user.generateJWT(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 2.
export async function POST(req) {
  try {
    await connectDB();
    const { email, password, loginAs } = await req.json(); // loginAs 'admin' or 'sub-account'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    const query = {
      email,
      role:
        loginAs === "admin"
          ? { $in: ["admin", "super-admin"] }
          : { $nin: ["admin", "super-admin"] },
    };
    const user = await User.findOne(query);
    if (!user) {
      return resError(
        loginAs === "admin" ? "Email not registered." : "Sub-Account not found!"
      );
    }
    if (await user.comparePassword(password)) {
      const user2 = await User.findOne(query)
        .select("-password")
        .populate({
          path: "companyId",
          populate: {
            path: "subscriptionId",
            populate: {
              path: "planId",
              model: "Plan",
            },
          },
        })
        .populate("personalInfo")
        .populate({
          path: "jobInfo",
          populate: {
            path: "payrollId",
          },
        });

      const subscriptionCheckData = await subscriptionCheckGuard(
        user2?.subscriptionId
      );
      console.log(subscriptionCheckData);

      return NextResponse.json(
        {
          success: true,
          data: {
            ...user2?._doc,
            token: await user.generateJWT(),
          },
        },
        { status: 200 }
      );
    } else {
      return resError("Invalid Password!");
    }
  } catch (error) {
    return resError(error?.message);
  }
}
