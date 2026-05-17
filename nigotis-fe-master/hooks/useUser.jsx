"use client";
import { useUserContext } from "@/contexts/user";

export default function useUser() {
  const { user, setUser } = useUserContext();
  // const { userData } = useUserContext();
  // console.log("from useUser hook", userData);
  // return userData;

  // const getCookie = (name) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(";").shift();
  // };
  // let user = null;
  // const userCookie = getCookie("user");
  // if (userCookie) {
  //   try {
  //     user = JSON.parse(userCookie);
  //   } catch (err) {
  //     console.error("Invalid user cookie:", err);
  //   }
  // }
  // const setUser = (data) => {
  //   document.cookie = `user=${JSON.stringify(data)}; path=/`;
  // };
  return { setUser, user };
}
