import User from "@/models/user";
import User_Subscription from "@/models/user_subscription";
const { verify } = require("jsonwebtoken");

const isNetworkOrConnectionIssue = (error) => {
  const code = String(error?.code || "").toUpperCase();
  const name = String(error?.name || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();

  const knownCodes = [
    "ECONNRESET",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ETIMEDOUT",
    "ESOCKETTIMEDOUT",
    "ECONNABORTED",
    "ENETUNREACH",
    "EHOSTUNREACH",
  ];

  if (knownCodes.includes(code)) return true;

  if (
    name.includes("mongonetwork") ||
    name.includes("networkerror") ||
    message.includes("econnreset") ||
    message.includes("connection") ||
    message.includes("timed out") ||
    message.includes("socket") ||
    message.includes("network")
  ) {
    return true;
  }

  return false;
};

export const userAuthGuard = async (req) => {
  try {
    const headers = req.headers;
    const token = headers.get("authorization").split(" ")[1];
    const { id } = verify(token, process.env.JWT_SECRET);
    const data = await User.findById(id)
      .select("-password")
      .populate({
        path: "companyId",
        select: ["_id", "subscriptionId", "adminId", "displayName", "email"],
      })
      .populate({
        path: "personalInfo",
        select: ["_id", "title", "firstName", "lastName"],
      });
    return { success: true, message: "Token verified", data };
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userEmployeeGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "employee" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is employee",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not an employee",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userSuperAdminGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);

    if (authData?.success) {
      if (authData?.data?.role === "super-admin") {
        return {
          success: true,
          message: "Token verified - User is Super Admin",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a super admin",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const subscriptionCheckGuard = async (
  subscriptionId,
  user = {},
  isInvoice = ""
) => {
  try {
    if (!subscriptionId) {
      console.log("Free Trial runs", user);
      const getRemainingTrialDays = (createdAt) => {
        const now = new Date();
        const diffInMs = now.getTime() - new Date(createdAt).getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return Math.max(0, Math.floor(14 - diffInDays));
      };

      const isWithinFirst14Days = (createdAt) => {
        return getRemainingTrialDays(createdAt) > 0;
      };

      if (isWithinFirst14Days(user?.createdAt)) {
        const daysLeft = getRemainingTrialDays(user?.createdAt);
        return {
          success: true,
          message: `Free Trial active. ${daysLeft} day(s) remaining.`,
        };
      } else {
        return {
          success: false,
          message: "14 Days Free Trial has expired. Please subscribe to continue.",
        };
      }

      // here check free invoices
      // if (
      //   user?.allowedFreeInvoices === 0 &&
      //   isInvoice &&
      //   isInvoice !== "delete"
      // ) {
      //   return {
      //     success: false,
      //     message: "Free Trial Expired, Please Buy a Plan.",
      //   };
      // } else {
      //   if (isInvoice) {
      //     let user2 = await User.findById(user?._id);
      //     if (user2) {
      //       if (isInvoice === "create") {
      //         user2.allowedFreeInvoices--;
      //       } else {
      //         user2.allowedFreeInvoices++;
      //       }
      //     }
      //     await user2.save();
      //   }

      //   return {
      //     success: true,
      //     message: `On Free Trial, Left with ${
      //       isInvoice === "create"
      //         ? --user.allowedFreeInvoices
      //         : ++user.allowedFreeInvoices
      //     } more invoice.`,
      //   };
      // }
    }
    let subscription = await User_Subscription.findById(subscriptionId);
    if (!subscription) {
      return {
        success: false,
        message: "Subscription was not found.",
      };
    }

    const gracePeriod = Number(process.env.NEXT_PUBLIC_GRACE_PERIOD) || 0;
    const currentDate = new Date();
    const endDate = new Date(subscription.endDate);
    const gracePeriodInMs =
      gracePeriod * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000;
    const gracePeriodEndDate = new Date(endDate.getTime() + gracePeriodInMs);

    if (currentDate > endDate) {
      subscription.status = "expired";
      await subscription.save();
      if (currentDate <= gracePeriodEndDate) {
        const graceDateOnly = new Date(gracePeriodEndDate)
          .toISOString()
          .split("T")[0];
        return {
          success: true,
          message: `Subscription is expired, Your grace period will end on ${graceDateOnly}`,
        };
      } else {
        return {
          success: false,
          message: "Subscription is expired.",
        };
      }
    } else {
      return {
        success: true,
        message: "Subscription is active",
      };
    }
  } catch (error) {
    if (isNetworkOrConnectionIssue(error)) {
      return {
        success: false,
        message:
          "Network issue detected. Please check your internet connection and try again.",
      };
    }
    return { success: false, message: "Subscription Check Failed - Try Again" };
  }
};

export const userHRGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (authData?.data?.role === "hr" || authData?.data?.role === "admin") {
        return {
          success: true,
          message: "Token verified - User is HR",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a HR",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userFinanceGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "finance" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is Finance Member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Finance Member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};

export const userSalesGuard = async (req) => {
  try {
    const authData = await userAuthGuard(req);
    if (authData?.success) {
      if (
        authData?.data?.role === "sales" ||
        authData?.data?.role === "admin"
      ) {
        return {
          success: true,
          message: "Token verified - User is Sales Member",
          data: authData?.data,
        };
      } else {
        return {
          success: false,
          message: "Invalid - Not a Sales Member",
        };
      }
    } else {
      return authData;
    }
  } catch (error) {
    return { success: false, message: "Invalid Token - Login Again" };
  }
};
