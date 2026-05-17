import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", req.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", req.url))
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }),
    })

    const tokenData = await tokenResponse.json();
    console.log(tokenData);
    

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token")
    }

    // Step 2: Fetch user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const googleUser = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info from Google")
    }

    // ⏸️ Stop here — you now have `googleUser` data and can proceed with DB logic
    console.log("Google user info:", googleUser);
//   "googleUser": {
//     "id": "115972625990657682312",
//     "email": "abdulhaseeb9274@gmail.com",
//     "verified_email": true,
//     "name": "Abdullah",
//     "given_name": "Abdullah",
//     "picture": "https://lh3.googleusercontent.com/a"
//   }

    await connectDB();
    let user = await User.findOne({ email: googleUser?.email, role: "admin" });
    if (!user) {
        // create a new user if not found
        console.log("Creating new user for Google OAuth:", googleUser.email);
        
    }else{
        // login the user
        console.log("User found for Google OAuth:", user?.email);
    }
    return NextResponse.json({ success: true, googleUser })
  } catch (err) {
    console.error("OAuth callback error:", err)
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }
}
