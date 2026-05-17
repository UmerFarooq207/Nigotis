import React, { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import PayrollModal from "./PayrollModal";
import Link from "next/link";
import useCurrency from "@/hooks/useCurrency";
import ConfirmationDialog from "@/components/Utils/ConfirmationDialog";
import { Button } from "@/components/ui/button";

const PayrollRow = ({ payroll, isOpen, toggleOpen, handleDelete }) => {
  const [isEdit, setIsEdit] = useState(false);

  const currency = useCurrency();

  return (
    <>
      <tr className="border-b hover:bg-gray-50/50 duration-200 transition-all">
        <td className="p-4 align-middle">
          {[
            payroll?.employeeId?.personalInfo?.title,
            payroll?.employeeId?.personalInfo?.firstName,
            payroll?.employeeId?.personalInfo?.middleName,
            payroll?.employeeId?.personalInfo?.lastName,
          ]
            .filter(Boolean)
            .join(" ")}
          <br />(
          <Link href={`mail:${payroll?.employeeId?.email}`}>
            {payroll?.employeeId?.email}
          </Link>
          )
        </td>

        <td className="p-4 align-middle font-semibold text-xs">
          {payroll?.salaryType.toUpperCase()}
        </td>
        <td className="p-4 align-middle font-semibold text-xs ">
          <span
            className={`${
              payroll?.status === "paid"
                ? " text-green-500 "
                : " text-orange-500 "
            } font-medium`}
          >
            {payroll?.status.toUpperCase()}
          </span>
        </td>
        <td className="p-4 align-middle">
          {currency?.symbol}&nbsp;{payroll?.totalAmount.toFixed(2)}
        </td>
        <td className="p-4 align-middle">{new Date(payroll?.from).toLocaleDateString()}</td>
        <td className="p-4 align-middle">{new Date(payroll?.to).toLocaleDateString()}</td>
        <td className="p-4 align-middle">{`${payroll?.runBy.personalInfo?.firstName}`}</td>
        <td className="p-4 align-middle">
          <a className="cursor-pointer hover:underline text-blue-600" onClick={toggleOpen}>
            Preview
          </a>
        </td>
        <td className="p-4 align-middle flex items-center gap-4">
          {/* <div className="cursor-pointer" onClick={() => setIsEdit(true)}>
            <Edit3 size={20} />
          </div> */}
          <ConfirmationDialog
            trigger={
              <Button variant="outline" size="icon">
                <Trash2 className="h-8 w-8 text-red-600" />
              </Button>
            }
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete."
            onConfirm={() => handleDelete(payroll?._id)}
          />
        </td>
      </tr>
      {(isOpen || isEdit) && (
        <tr>
          <td colSpan={8}>
            <PayrollModal
              payroll={payroll}
              onClose={toggleOpen}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            />
          </td>
        </tr>
      )}
    </>
  );
};

export default PayrollRow;
