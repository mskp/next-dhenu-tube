import ytdl from "ytdl-core";

export async function getYoutubeVideoDetails(youtubeUrl) {
  try {
    const videoInfo = await ytdl.getInfo(youtubeUrl);
    const videoTitle = videoInfo.videoDetails.title;

    const availableUniqueFormats = await getAvailableUniqueFormats(youtubeUrl);
    const qualityLabels = availableUniqueFormats.map(
      (format) => format.qualityLabel ?? "Audio"
    );
    const thumbnailUrl =
      videoInfo.videoDetails.thumbnails[
        videoInfo.videoDetails.thumbnails.length - 1
      ].url;
    return { videoTitle, thumbnailUrl, qualityLabels };
  } catch (error) {
    return null;
  }
}

export async function getAvailableUniqueFormats(youtubeVideoUrl) {
  try {
    const videoInfo = await ytdl.getInfo(youtubeVideoUrl);
    const formats = videoInfo.formats;

    const uniqueFormats = formats.reduce((unique, format) => {
      const existingFormat = unique.find(
        (f) =>
          f.qualityLabel === format.qualityLabel &&
          f.hasAudio === format.hasAudio &&
          f.hasVideo === format.hasVideo
      );

      if (!existingFormat && format.hasAudio) unique.push(format);

      return unique;
    }, []);

    uniqueFormats.sort((a, b) => {
      const qualityA = a.qualityLabel
        ? parseInt(a.qualityLabel.replace("p", ""))
        : 0;
      const qualityB = b.qualityLabel
        ? parseInt(b.qualityLabel.replace("p", ""))
        : 0;
      return qualityA - qualityB;
    });

    return uniqueFormats;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function getDownloadUrl(youtubeVideoUrl, quality) {
  try {
    const uniqueFormats = await getAvailableUniqueFormats(youtubeVideoUrl);
    quality = quality === "Audio" ? null : quality;
    const selectedFormat =
      uniqueFormats[
        uniqueFormats.findIndex((obj) => obj.qualityLabel === quality)
      ];
    const downloadUrl = selectedFormat.url;
    return downloadUrl;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}