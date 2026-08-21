import React, { FC, useEffect, useState } from "react";
import axios from "axios";

interface Props {
  videoUrl: string;
  title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    if (videoUrl) {
      axios
        .post(`${process.env.NEXT_PUBLIC_SERVER_URI}/getVdoCipherOTP`, {
          videoId: videoUrl,
        })
        .then((res) => {
          setVideoData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [videoUrl]);

  return (
    <div style={{ paddingTop: "56.25%", position: "relative" }}>
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=6NcX0xQP8FpoaPwp`} // Sử dụng player ID giả định như tutorial, bạn có thể custom
          style={{
            border: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;