import connectDB from "@/lib/db";
import { userSuperAdminGuard } from "@/middleware/user";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 1.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await User.find({
      role: "admin",
      isBuyer: true,
    }).populate({
      path: "subscriptionId",
      populate: {
        path: "planId",
        model: "Plan",
      },
    });

    if (data.length == 0) {
      return resError(`Users not found.`);
    }

    function checkStatus(inputDate) {
      const today = new Date();
      const targetDate = new Date(inputDate);

      // Normalize both dates to ignore time
      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      return today <= targetDate;
    }

    const getRemainingTrialDays = (createdAt) => {
      const now = new Date();
      const diffInMs = now.getTime() - new Date(createdAt).getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      return Math.max(0, Math.floor(14 - diffInDays));
    };

    const isWithinFirst14Days = (createdAt) => {
      return getRemainingTrialDays(createdAt) > 0;
    };
    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers: data.length,
          totalActiveUsers: data.filter((user) =>
            checkStatus(user.subscriptionId?.endDate)
          ).length,
          totalInactiveUsers: data.filter(
            (user) =>
              user.subscriptionId && !checkStatus(user.subscriptionId?.endDate)
          ).length,
          totalFreeUsers: data.filter((user) => !user.subscriptionId).length,
          totalActiveFreeUsers: data.filter(
            (user) =>
              !user.subscriptionId && isWithinFirst14Days(user?.createdAt)
          ).length,
          totalInactiveFreeUsers: data.filter(
            (user) =>
              !user.subscriptionId && !isWithinFirst14Days(user?.createdAt)
          ).length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
