import React from "react";
import user from "/images/user.png";
import "./video.css";

const Video = ({ video }) => {
  return (
    <a href={`/watch/${video._id}`} className="video">
      <img
        className="thumb"
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src =
            "https://i9.ytimg.com/vi_webp/k3Vfj-e1Ma4/mqdefault.webp?v=6277c159&sqp=CIjm8JUG&rs=AOn4CLDeKmf_vlMC1q9RBEZu-XQApzm6sA";
        }}
        src={
          video.thumbnail ||
          "https://i9.ytimg.com/vi_webp/k3Vfj-e1Ma4/mqdefault.webp?v=6277c159&sqp=CIjm8JUG&rs=AOn4CLDeKmf_vlMC1q9RBEZu-XQApzm6sA"
        }
        alt="thumbnail"
      />
      <div className="video-info-container">
        <div className="channel-avatar">
          <img src={video.authorProfile} />
        </div>
        <div className="video-info">
          <h4>{video.title}</h4>
          <h2 className="secondary">{video.authorName}</h2>
          <p className="secondary">
            <span>{video.likes || 0} likes</span> <span>•</span>{" "}
            <span>{video.createdAt || "2 days ago"}</span>
          </p>
        </div>
      </div>
    </a>
  );
};

export default Video;
