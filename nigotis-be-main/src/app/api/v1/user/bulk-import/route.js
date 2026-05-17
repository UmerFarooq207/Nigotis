import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import Payroll from "@/models/payroll";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      console.log("not authData success");
      console.log(authData);
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId,
authData?.data
    );
    if (!subscriptionCheckData?.success) {
      console.log("subscriptionCheckData");
      console.log(subscriptionCheckData);
      return resError(subscriptionCheckData?.message);
    }

    const companyId = authData?.data?.companyId?._id;

    const { employees } = await req.json();

    const seenEmails = new Set();
    const seenEmployeeIds = new Set();

    async function processData(employees) {
      console.log(employees.length);

      // Validate employees asynchronously using Promise.all and map
      await Promise.all(
        employees.map(async (item, index) => {
          let { email, firstName, employeeId, salaryType } = item;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            throw new Error(`At Row # ${index + 1}: Invalid email format.`);
          }
          // Check for duplicate emails
          if (seenEmails.has(email)) {
            throw new Error(
              `At Row # ${index + 1}: Duplicate email "${email}" found.`
            );
          } else {
            seenEmails.add(email);
          }

          // Check for duplicate employeeId
          if (seenEmployeeIds.has(employeeId)) {
            throw new Error(
              `At Row # ${
                index + 1
              }: Duplicate employee ID "${employeeId}" found.`
            );
          } else {
            seenEmployeeIds.add(employeeId);
          }

          if (!salaryType) {
            throw new Error(
              `At Row # ${
                index + 1
              }: Salary Type cannot be empty. e.g: [fixed, hourly].`
            );
          }
          if (!firstName) {
            throw new Error(
              `At Row # ${index + 1}: First Name cannot be empty.`
            );
          }

          let user = await User.findOne({ email, companyId });
          if (user) {
            throw new Error(
              `At Row # ${index + 1}: Email already registered in this company.`
            );
          }
          if (employeeId) {
            const user = await JobInfo.findOne({ companyId, employeeId });
            if (user) {
              return resError(
                `At Row # ${
                  index + 1
                }: Employee ID already exists. Please use a unique Employee ID.`
              );
            }
          }
        })
      );
      console.log("employee data validated, good to go");

      await Promise.all(
        employees.map(async (item) => {
          let {
            email,
            title,
            firstName,
            middleName,
            lastName,
            address,
            phone,
            employeeId,
            department,
            jobRole,
            joinDate,
            salary,
            hourlyRate,
            salaryType,
            tax,
            bonus,
            overtimeHourlyRate,
          } = item;

          if (!employeeId) {
            const users = await User.find({ companyId });
            employeeId = 1000 + users.length;
            let idDup = await JobInfo.findOne({
              companyId,
              employeeId: `${employeeId}`,
            });
            do {
              idDup = await JobInfo.findOne({
                companyId,
                employeeId: `${++employeeId}`,
              });
            } while (idDup);
          }

          let user = await User.create({
            email,
            password: "12345678",
            role: "employee",
            isVerified: true,
            companyId,
          });
          const personalInfoData = await PersonalInfo.create({
            title,
            firstName,
            middleName,
            lastName,
            address,
            phone,
            userId: user._id,
          });
          const payrollData = await Payroll.create({
            salaryType,
            salary,
            hourlyRate,
            tax,
            bonus,
            overtimeHourlyRate,
            companyId,
            employeeId: user._id,
          });
          const jobInfoData = await JobInfo.create({
            department,
            jobRole,
            joinDate,
            companyId,
            employeeId: `${employeeId}`,
            userId: user._id,
            payrollId: payrollData._id,
          });
          user.personalInfo = personalInfoData._id;
          user.jobInfo = jobInfoData._id;
          await user.save();
        })
      );
    }
    try {
      await processData(employees);
      console.log("All employees processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Employees has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
