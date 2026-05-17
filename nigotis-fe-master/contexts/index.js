import React from "react";
import { CompanyProvider } from "./company";
import { NotificationProvider } from "./notifications";
import { UserProvider } from "./user";

export default function ContextProvider({ children }) {
  return (
    <CompanyProvider>
      <UserProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </UserProvider>
    </CompanyProvider>
  );
}
