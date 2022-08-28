import React, { useEffect } from "react";
import Video from "../components/Video";
import { Data } from "./Data.js";
import "./video.css";
import instance from "../../utils/service";
import axios from "axios";

const Videos = () => {
  const [videos, setVideos] = React.useState([]);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    instance
      .get("/api/videos")
      .then((res) => {
        setVideos(res.data);
        console.log(res);
      })
      .catch((err) => {
        setError(err);
        console.log(err);
      });
  }, []);
  return (
    <div className="vid-container">
      {videos.map((video) => {
        return <Video key={video._id} video={video} />;
      })}
    </div>
  );
};

export default Videos;
