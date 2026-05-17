"use client";
import { fetchCustom } from "@/lib/utils";
import { createContext, useContext, useEffect, useState } from "react";
import { useCompany } from "./company";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { setCompany } = useCompany();

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    };

    const userCookie = getCookie("user");
    if (userCookie && user === null) {
      try {
        const parsedUser = JSON.parse(userCookie);
        fetchAndSetUser(parsedUser);
      } catch (err) {
        console.error("Invalid user cookie:", err);
      }
    } else {
      console.log("User cookie not found from user context");
    }
  }, []);
  const fetchAndSetUser = async (parsedUser) => {
    const response = await fetchCustom("/user/login", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${parsedUser.token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (!data?.success) {
        console.error("Failed to fetch user data:", data?.message);
        setUser(null);
        return;
      }
      setUser({
        ...data?.data,
        botClientId: parsedUser?.botClientId,
        botAuthToken: parsedUser?.botAuthToken,
        currentSessionId: parsedUser?.currentSessionId,
      });
      setCompany(data?.data?.companyId);
    } else {
      console.error("Failed to fetch user data");
      setUser(null);
    }
  };
  const updateUser = (data) => {
    if (data === null) {
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setUser(null);
      return;
    }
    setUser(data);

    document.cookie = `user=${JSON.stringify({
      userId: data?._id,
      email: data?.email,
      role: data?.role,
      isVerified: data?.isVerified,
      isBuyer: data?.isBuyer,
      token: data?.token,
      botClientId: data?.botClientId,
      botAuthToken: data?.botAuthToken,
      currentSessionId: data?.currentSessionId,
      companyId: data?.companyId?._id,
    })}; path=/`;
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
