"use client";

import { useState, useEffect } from "react";
import { Sono } from "next/font/google";
import axios from "axios";
import { downloadFile } from "@/utils/functions";

const sono = Sono({ subsets: ["latin"], weight: "800" });

const HomePage = () => {
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [availableQualities, setAvailableQualities] = useState([]);
  const [videoTitle, setVideoTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleQualityChange = (e) => {
    setSelectedQuality(e.target.value);
  };

  const handleDownload = async () => {
    if (!youtubeVideoUrl || !selectedQuality) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/downloadVideo",
        {
          youtubeUrl: youtubeVideoUrl,
          selectedQuality,
        },
        {
          responseType: "blob",
        }
      );
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoTitle}${
        selectedQuality === "Audio" ? ".mp3" : ".mp4"
      }`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error initiating download:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-w-full min-h-screen backdrop-blur-sm">
      <div className="flex justify-center items-center text-center min-h-screen">
        <div className="center-div w-full md:w-1/2 lg:w-1/3 p-4 bg-gray-600 opacity-80 shadow-lg rounded-lg">
          <h1
            className={`${sono.className} text-2xl font-bold mb-4 text-orange-500`}
          >
            🐮DhenuTube: Youtube video downloader
          </h1>

          <div className="mb-8">
            <input
              type="text"
              value={youtubeVideoUrl}
              onChange={(e) => {
                setYoutubeVideoUrl(e.target.value);
              }}
              className="bg-lime-700 text-white w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter YouTube video URL"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={fetchVideoInfo}
              disabled={!youtubeVideoUrl || isLoading}
              className="w-full md:w-1/2
            bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {isLoading ? "Fetching..." : "Fetch Info"}
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

          {videoTitle && <div className="text-white mb-2">{videoTitle}</div>}

          {availableQualities && availableQualities.length > 0 && (
            <div className="text-white">
              <h4 className="mb-2">Select Quality:</h4>
              <ul className={`mb-4 ${isLoading ? "" : "fade-in"}`}>
                {availableQualities.map((quality) => (
                  <li
                    key={quality}
                    onClick={() =>
                      handleQualityChange({ target: { value: quality } })
                    }
                    className={`cursor-pointer border-4 bg-slate-700 mb-2 hover:opacity-60 ${
                      quality === selectedQuality
                        ? "border-2 border-green-500"
                        : "border-blue-500"
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
                disabled={isLoading}
                className="w-full md:w-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                {isLoading ? "Downloading..." : "Download"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;