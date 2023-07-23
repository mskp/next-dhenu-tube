"use client";

import { useState, useEffect } from "react";
import { Sono } from "next/font/google";
import axios from "axios";
import { useRouter } from "next/navigation";

const sono = Sono({ subsets: ["latin"], weight: "800" });

export default function HomePage() {
  const router = useRouter();
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [availableQualities, setAvailableQualities] = useState([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (youtubeVideoUrl) {
      fetchVideoInfo();
    } else {
      setVideoTitle("");
      setThumbnailUrl("");
      setAvailableQualities([]);
    }
  }, [youtubeVideoUrl]);

  const fetchVideoInfo = async () => {
    setIsFetching(true);
    if (!youtubeVideoUrl) throw new Error("Invalid YouTube video URL");
    try {
      const response = await axios.post("/api/getYoutubeVideoDetails", {
        youtubeUrl: youtubeVideoUrl,
      });

      setVideoTitle(response.data.videoTitle);
      setThumbnailUrl(response.data.thumbnailUrl);
      setAvailableQualities(response.data.qualityLabels);
    } catch (error) {
      console.error(error);
      setVideoTitle("");
      setThumbnailUrl("");
      setAvailableQualities([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleQualityChange = (e) => {
    setSelectedQuality(e.target.value);
  };

  const handleDownload = async () => {
    if (!youtubeVideoUrl || !selectedQuality) return;
    setIsDownloading(true);
    try {
      const response = await axios.post("/api/getDownloadUrl", {
        youtubeUrl: youtubeVideoUrl,
        selectedQuality,
      });
      // const blob = response.data;
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = `${videoTitle}${
      //   selectedQuality === "Audio" ? ".mp3" : ".mp4"
      // }`;
      // a.click();
      // URL.revokeObjectURL(url);
      router.push(response.data.downloadUrl)
    } catch (error) {
      console.error("Error initiating download:", error.message);
    } finally {
      setYoutubeVideoUrl("");
      setVideoTitle("");
      setThumbnailUrl("");
      setIsDownloading(false);
      setAvailableQualities([]);
      setSelectedQuality("");
    }
  };

  return (
    <main className="min-w-full min-h-screen backdrop-blur-sm">
      <div className="flex justify-center items-center text-center min-h-screen">
        <div className="center-div w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-600 opacity-80 shadow-lg rounded-lg">
          <h1
            className={`${sono.className} text-2xl font-bold mb-4 text-orange-500`}
          >
            🐮DhenuTube
          </h1>

          <div className="mb-8">
            <input
              type="text"
              value={youtubeVideoUrl}
              onChange={(e) => {
                setYoutubeVideoUrl(e.target.value);
              }}
              className="bg-transparent text-white w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-indigo-950"
              placeholder="Paste the youtube video link here"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={fetchVideoInfo}
              disabled={!youtubeVideoUrl || isFetching}
              className="w-full md:w-1/2
            bg-indigo-950 text-white px-4 py-2 rounded-lg"
            >
              {isFetching ? "Fetching..." : "Fetch Info"}
            </button>
          </div>

          {thumbnailUrl && (
            <div className="mb-4 mx-auto">
              <img
                src={thumbnailUrl}
                alt="Video Thumbnail"
                className="rounded-md shadow-lg max-w-full"
              />
            </div>
          )}

          {videoTitle && (
            <div className="text-white mb-2 underline">{videoTitle}</div>
          )}

          {availableQualities && availableQualities.length > 0 && (
            <div className="text-white">
              <h4 className="mb-2">Select Quality:</h4>
              <ul className={`mb-4 ${isFetching ? "" : "fade-in"}`}>
                {availableQualities.map((quality) => (
                  <li
                    key={quality}
                    onClick={() =>
                      handleQualityChange({ target: { value: quality } })
                    }
                    className={`cursor-pointer border-4 bg-slate-700 mb-2 hover:opacity-60 ${
                      quality === selectedQuality
                        ? "border-2 border-pink-600"
                        : "border-indigo-950"
                    } p-2 rounded-md`}
                  >
                    {quality}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {availableQualities && selectedQuality && (
            <div className="mb-4">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full md:w-1/2 bg-indigo-950 text-white px-4 py-2 rounded-lg"
              >
                {isDownloading ? "Downloading..." : "Download"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
