import ImageKit from "imagekit"
import { NextResponse } from "next/server";

if (!process.env.NEXT_PUBLIC_PUBLIC_KEY ||
  !process.env.PRIVATE_KEY ||
  !process.env.NEXT_PUBLIC_URL_ENDPOINT) {
  throw new Error("Missing required ImageKit environment variables");
}

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT,
});

export async function GET() {
  try {
    const authParamaters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authParamaters);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error:"ImageKit Auth failed error" }, { status: 500 });
  }
}