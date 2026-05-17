import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { url, options = {} } = await req.json();

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: "URL is required in body.",
        },
        { status: 400 }
      );
    }
    const timeout = 5 * 60000;
    const fetchWithTimeout = async (url, options = {}) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
      ]);
    };

    const response = await fetchWithTimeout(
      `${process.env.NEXT_PUBLIC_BOT_API_URL}${url}`,
      options
    );

    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_BOT_API_URL}${url}`,
    //   options
    // );

    if (!response?.ok) {
      return NextResponse.json(
        {
          success: false,
          message: `HTTP error! Status: ${response?.status}`,
        },
        { status: 400 }
      );
    }
    try {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
