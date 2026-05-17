import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userSuperAdminGuard,
} from "@/middleware/user";
import Company from "@/models/company";
import resError from "@/utils/resError";
import { sendWhatsappFeatureRequestAcknowledgement } from "@/utils/whatsappMails";
import { NextResponse } from "next/server";

//  list all active request for whatsapp feature SA
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Company.find({ isReqWhatsApp: true }).populate({
      path: "adminId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    if (data.length == 0) {
      return resError(`No request found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// make request for whatsapp feature A
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.subscriptionId,
      authData?.data
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { _id, whatsAppNo } = await req.json();

    if (!_id || !whatsAppNo) {
      return resError("Company ID and WhatsApp number are required.");
    }

    let company = await Company.findById(_id).populate({
      path: "adminId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });
    if (!company) {
      return resError("Company was not found against id: " + _id);
    }
    company.whatsAppNo = whatsAppNo;
    company.isReqWhatsApp = true;
    await company.save();
    const email = company?.adminId?.email;
    const name = company?.adminId?.personalInfo?.firstName;
    sendWhatsappFeatureRequestAcknowledgement(email, name);

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! We've received your request and will start processing it shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// delete request for whatsapp
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { _id } = await req.json();

    let company = await Company.findById(_id);
    if (!company) {
      return resError(`Company was not found against id: ` + _id);
    }
    company.isReqWhatsApp = false;
    await company.save();

    return NextResponse.json({
      success: true,
      message: "Your request has been deleted. ",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
