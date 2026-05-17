import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userSuperAdminGuard,
} from "@/middleware/user";
import Company from "@/models/company";
import resError from "@/utils/resError";
import { sendWhatsappFeatureActivated } from "@/utils/whatsappMails";
import { NextResponse } from "next/server";

// list all activated whatsapp SA
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Company.find({ isWhatsAppActive: true }).populate({
      path: "adminId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    if (data.length == 0) {
      return resError(`No whatsapp activated company was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// activate whatsapp SA
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

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

    company.isWhatsAppActive = true;
    company.isReqWhatsApp = false;
    await company.save();
    const email = company?.adminId?.email;
    const name = company?.adminId?.personalInfo?.firstName;
    sendWhatsappFeatureActivated(email, name);
    return NextResponse.json(
      {
        success: true,
        message: "Whatsapp feature is activated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
