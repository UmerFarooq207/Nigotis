import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userHRGuard,
  userSuperAdminGuard,
} from "@/middleware/user";
import Company from "@/models/company";
import resError from "@/utils/resError";
import { sendWhatsappFeatureDeactivated } from "@/utils/whatsappMails";
import { NextResponse } from "next/server";

// deactivate whatsapp A
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    const authData2 = await userSuperAdminGuard(req);
    if (!authData?.success && !authData2?.success) {
      return resError(authData?.message + " " + authData2?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId,
      authData?.data
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }
    console.log(subscriptionCheckData);

    const { _id } = await req.json();

    let company = await Company.findById(_id).populate({
      path: "adminId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });
    if (!company) {
      return resError(`Company was not found against id: ` + _id);
    }

    company.isWhatsAppActive = false;
    await company.save();
    const email = company?.adminId?.email;
    const name = company?.adminId?.personalInfo?.firstName;
    sendWhatsappFeatureDeactivated(email, name);

    return NextResponse.json(
      {
        success: true,
        message: "Whatsapp feature is deactivated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
