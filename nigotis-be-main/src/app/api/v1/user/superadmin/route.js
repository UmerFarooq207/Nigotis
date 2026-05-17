import connectDB from "@/lib/db";
import { userSuperAdminGuard } from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import Payroll from "@/models/payroll";
import PayrollRuns from "@/models/payrollruns";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";
import Invoice from "@/models/invoice";
import Asset from "@/models/asset";
import Notification from "@/models/notification";
import User_Subscription from "@/models/user_subscription";
import Product from "@/models/product";
import SaleProduct from "@/models/sale_product";
import Income from "@/models/income";
import Company from "@/models/company";
import Client from "@/models/client";


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
    })
      .select("-password")
      .populate("personalInfo")
      .populate({
        path: "subscriptionId",
        populate: {
          path: "planId",
          model: "Plan",
        },
      });

    if (data.length == 0) {
      return resError(`Users not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { userId } = await req.json(); //means _id

    let user = await User.findById(userId);
    if (!user) {
      return resError(`User was not found against id: ` + userId);
    }
    await PersonalInfo.findOneAndDelete({
      userId: userId,
    });

    await User_Subscription.findOneAndDelete({
      userId: userId,
    });

    await Company.findOneAndDelete({
      adminId: userId,
    });

    await Notification.deleteMany({
      sentTo: userId,
    });

    const companyId = user?.companyId;
    if (companyId) {
      console.log("yep company related data also deleted.");

      await Invoice.deleteMany({
        companyId,
      });
      await Product.deleteMany({
        companyId,
      });
      await SaleProduct.deleteMany({
        companyId,
      });
      await Asset.deleteMany({
        companyId,
      });
      await Income.deleteMany({
        companyId,
      });
      await Client.deleteMany({
        companyId,
      });
      await Payroll.deleteMany({
        companyId,
      });
      await PayrollRuns.deleteMany({
        companyId,
      });
      await JobInfo.deleteMany({
        companyId,
      });
      await User.deleteMany({
        companyId,
      });
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      success: true,
      message: "User and all its data has been deleted.",
    });
  } catch (error) {
    console.log(error);
    
    return resError(error?.message);
  }
}
