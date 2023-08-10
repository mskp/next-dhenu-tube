"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
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

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setYoutubeVideoUrl(text);
    } catch (error) {
      console.error("Failed to paste from clipboard:", error);
    }
  };

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

  const handleQualityChange = (e) => setSelectedQuality(e.target.value);

  const handleDownload = async () => {
    try {
      if (!youtubeVideoUrl || !selectedQuality) return;
      setIsDownloading(true);

      const response = await axios.post("/api/getDownloadUrl", {
        youtubeUrl: youtubeVideoUrl,
        selectedQuality,
      });
      const a = document.createElement("a");
      a.href = response.data.downloadUrl;
      a.target = "_blank";
      a.click();
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsDownloading(false);
      setVideoTitle("");
      setThumbnailUrl("");
      setAvailableQualities([]);
      setIsFetching(false);
      setYoutubeVideoUrl("");
      setSelectedQuality("");
    }
  };
  return (
    <main className="min-w-full min-h-screen backdrop-blur-sm">
      <div className="flex justify-center items-start text-center min-h-screen pt-4">
        <div className="center-div w-full md:w-1/2 lg:w-1/3 p-4 opacity-80">
          <h1 className="text-xl text-white p-4">Download YouTube Videos</h1>

          <div className="mb-8 relative">
            <div className="hover:bg-slate-800 hover:opacity-80 absolute right-2 top-1/2 transform -translate-y-1/2 border p-1 rounded">
              <button onClick={handlePaste} type="button" className="text-white">
                Paste
              </button>
            </div>
            <input
              type="text"
              value={youtubeVideoUrl}
              onChange={(e) => {
                setYoutubeVideoUrl(e.target.value);
              }}
              className="bg-transparent text-white w-full px-5 py-4 border rounded-lg outline-none pr-16"
              placeholder="Paste the youtube video link here"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={fetchVideoInfo}
              disabled={!youtubeVideoUrl || isFetching}
              style={{ background: "#1a4940" }}
              className={`w-full md:w-1/2 text-white px-4 py-2 rounded-lg ${!(!youtubeVideoUrl || isFetching) && 'hover:opacity-80'}`}
            >
              {isFetching ? "Wait..." : "Proceed"}
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
            <div className="text-white mb-2 font-bold">{videoTitle}</div>
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
                    className={`cursor-pointer border mb-2 hover:opacity-60 ${quality === selectedQuality
                      ? "bg-slate-800"
                      : ""
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
                style={{ background: "#1a4940" }}
                className={`w-full md:w-1/2 text-white px-4 py-2 rounded-lg hover:opacity-80`}
              >
                {isDownloading ? "Redirecting..." : "Download"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}