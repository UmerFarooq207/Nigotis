import connectDB from "@/lib/db";
import { subscriptionCheckGuard } from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function POST(req) {
  try {
    // get the beaer token from the request headers
    const bearerToken = req.headers.get("Authorization");
    if (!bearerToken) {
      return resError("Unauthorized token required.");
    }

    // Step 2: Fetch user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: bearerToken,
        },
      }
    );

    const googleUser = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info from Google");
    }

    await connectDB();
    let user = await User.findOne({ email: googleUser?.email, role: "admin", isBuyer: true });
    
    if (!user) {
      user = await User.create({
        email: googleUser?.email,
        providerId: googleUser?.id,
        password: googleUser?.id+"nigotis", 
        provider: "google",
        role: "admin",
        isBuyer: true,
        isVerified: true,
      });
      const personalInfoData = await PersonalInfo.create({
        userId: user._id,
        firstName: googleUser?.name,
        avatar: googleUser?.picture,
      });
      const jobInfoData = await JobInfo.create({
        employeeId: `${user?._id}`,
        payrollId: null,
        department: "",
        jobRole: "",
        userId: user._id,
      });
      user.personalInfo = personalInfoData._id;
      user.jobInfo = jobInfoData._id;
      await user.save();
    }

    const user2 = await User.findById(user?._id)
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
          token: await user2.generateJWT(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
