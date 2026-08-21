import React, { FC, useEffect, useState } from "react";
import axios from "axios";

interface Props { videoUrl: string; title: string; }

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });

  useEffect(() => {
    if (videoUrl) {
      axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/getVdoCipherOTP`, { videoId: videoUrl })
        .then((res) => setVideoData(res.data)).catch((err) => console.log(err));
    }
  }, [videoUrl]);

  return (
    <div className="w-full h-full relative" style={{ paddingTop: "56.25%" }}>
      {videoData.otp && videoData.playbackInfo !== "" ? (
        <iframe src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=6NcX0xQP8FpoaPwp`} className="absolute top-0 left-0 w-full h-full border-0" allowFullScreen allow="encrypted-media"></iframe>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900"><span className="text-white font-mono text-sm tracking-widest animate-pulse">Loading Player...</span></div>
      )}
    </div>
  );
};

export default CoursePlayer;