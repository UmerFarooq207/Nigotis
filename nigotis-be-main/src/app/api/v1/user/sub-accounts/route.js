import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userAuthGuard,
  userHRGuard,
  userSuperAdminGuard,
} from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import Payroll from "@/models/payroll";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { sendOTPCode } from "@/utils/sendOTPCode";
import { NextResponse } from "next/server";

// use all users api to get all employees and then later on separate employees and other sub-accounts.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const companyId = authData?.data?.companyId?._id;
        if (companyId === undefined) {
          return resError("Please create a company first.");
        }

    const data = await User.find({
      companyId,
      role: { $nin: ["employee", "admin"] },
    })
      .select("-password")
      .populate("personalInfo")
      .populate({
        path: "jobInfo",
        populate: {
          path: "payrollId",
        },
      });

    if (data.length == 0) {
      return resError(`No Sub-Accounts was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

//
export async function PUT(req) {
  try {
    await connectDB();
    const { password, employeeId, email, userId } = await req.json();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (password && password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    let user = await User.findById(userId);
    if (!user) {
      return resError("User was not found.");
    }

    user.password = password || user.password;
    user.email = email || user.email;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Updated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
