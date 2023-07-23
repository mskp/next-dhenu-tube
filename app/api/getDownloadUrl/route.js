import { NextResponse } from "next/server";
import { getDownloadUrl } from "@/utils/functions";

export async function POST(req) {
  try {
    const { youtubeUrl, selectedQuality } = await req.json();

    if (!youtubeUrl) throw new Error("Field 'youtubeUrl' is required");
    if (!selectedQuality && selectedQuality !== 0)
      throw new Error("Field 'selectedQuality' is required");

    const downloadUrl = await getDownloadUrl(youtubeUrl, selectedQuality);

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
