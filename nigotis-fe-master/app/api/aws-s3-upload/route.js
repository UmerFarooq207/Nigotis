export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${fileName}-${Date.now()}`,
    Body: fileBuffer,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return params.Key;
}

async function deleteFile(fileName) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
  };
  const command = new DeleteObjectCommand(params);
  const data = await s3Client.send(command);
  console.log(data);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.log("error occured in upload file to s3", error);
    return NextResponse.json({ success: true, fileName: "" });
  }
}

export async function DELETE(request) {
  try {
    const { fileName } = await request.json();
    if (!fileName) {
      return NextResponse.json({
        success: false,
        message: "File name is required.",
      });
    }
    await deleteFile(fileName);
    return NextResponse.json({ success: true, message: "File Deleted." });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message });
  }
}
