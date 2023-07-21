import { NextResponse } from "next/server";
import {
    getYoutubeVideoDetails
} from "@/utils/functions";

export async function POST(req) {
  try {
    const { youtubeUrl } = await req.json();

    if (!youtubeUrl) throw new Error("Field 'youtubeUrl' is required");

    const videoDetails = await getYoutubeVideoDetails(youtubeUrl);

    return NextResponse.json({ ...videoDetails });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}
