import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import instance from "../../../utils/service";
import ReactPlayer from "react-player";
import "./Watch.css";
import Navbar from "../../components/Navbar";

const Watch = () => {
  const { _id } = useParams();
  const [video, setVideo] = useState({});
  const [error, setError] = useState(null); // I know lol

  useEffect(() => {
    instance
      .get(`/api/videos/${_id}`)
      .then((res) => {
        setVideo(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setError(err);
        console.log("errr::::", err);
      });
  }, []);

  return (
    <>
      <Navbar />
      {video.video && (
        <div className="watch">
          <ReactPlayer
            url={video?.video.url}
            width="100%"
            height="100%"
            controls={true}
            light={video.video.thumbnail}
            style={{ aspectRatio: "16/9" }}
          />
          <h1>{video.video.title}</h1>
          <img src={video?.author.profile} alt="user" />
          <h3>User</h3>
          <p>{video?.video.description}</p>
        </div>
      )}
    </>
  );
};

export default Watch;
