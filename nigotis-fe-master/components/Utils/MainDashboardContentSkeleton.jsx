import React from "react";
import { Card } from "../ui/card";

const MainDashboardContentSkeleton = ({
  title = "title goes here",
  children,
  btns
}) => {
  const hasTitle = Boolean(title);
  return (
    <Card className=" p-4 relative">
      {hasTitle && (
        <div className=" ">
          <h1 className=" text-custom-gradient db-title">{title}</h1>
        </div>
      )}
      <div className="relative">
        <div className={`rounded-lg pb-6 ${hasTitle ? "pt-16" : "pt-4"}`}>
          {children}
        </div>
      </div>
    </Card>
  );
};

export default MainDashboardContentSkeleton;
