import { NextResponse } from "next/server";

const resError = (msg) => {
  return NextResponse.json(
    {
      success: false,
      message: msg,
    },
    { status: 400 } // or any other HTTP status code
  );
};

export default resError;
