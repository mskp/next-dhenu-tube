import { NextResponse } from "next/server";
import { getDownloadUrl } from "@/utils/functions";
import axios from "axios";

export async function POST(req) {
  try {
    const { youtubeUrl, selectedQuality } = await req.json();

    if (!youtubeUrl) throw new Error("Field 'youtubeUrl' is required");
    if (!selectedQuality && selectedQuality !== 0)
      throw new Error("Field 'selectedQuality' is required");

    const downloadUrl = await getDownloadUrl(youtubeUrl, selectedQuality);

    const response = await axios.get(downloadUrl, {responseType: "stream"})

    return new NextResponse(response.data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}
