import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BodyLeft from "../Body/BodyLeft";
import axios from "axios";
import SlashVideoAllLoading from "./ReuseableUI/SlashVideoAllLoading";
import Reuseable from "./ReuseableUI/Reuseable";
import Reuseable2 from "./ReuseableUI/Reuseable2";
import NotFound from "../error/NotFound";
import SlashIdVideoBody from "./slashIdVideos/SlashIdVideoBody";
import SlashIdVideoHeader from "./slashIdVideos/SlashIdVideoHeader";

const SlashIdVideosAll = (props) => {
  const [streams, setStreams] = useState([]);
  const [paginationValue, setPaginationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAllVideos();
  }, []);
  const fetchAllVideos = async () => {
    if (!props.location.state) {
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `/api/v1/videos/${props.location.state.data.user_id}`,
        {
          params: {
            cursor: paginationValue,
          },
        }
      );
      if (!data) {
        throw new Error("Failed to fetch posts");
      }
      let streams = data.data;
      setStreams((prevStreams) => [...prevStreams, ...streams]);

      setHasMore(streams.length > 0); 
      setPaginationValue(data.pagination.cursor);
    } catch (err) {
      setError(err.message);
      console.log("error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const handleScroll = () => {
    //   console.log(window.innerHeight , window.scrollY, document.documentElement.scrollHeight);
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

      if (bottom) {
        if (!loading && hasMore) {
          console.log("you reach the bottom", window.innerHeight);
          fetchAllVideos(streams.length); // Fetch next batch of posts
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, streams.length]);

  return (
    <div className="app-flex app-flex-nowrap app-relative app-full-height">
      <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
        <BodyLeft />
      </div>

      <div className="app-relative app-flex app-flex-column app-full-height app-full-width">
        {" "}
        <div className="app-full-height">
          <div className="app-flex app-flex-column app-full-height app-full-width">
           <SlashIdVideoHeader {...props}/>
              {streams.length === 0 ? (
                <SlashVideoAllLoading />
              ) : (
                    <div
                    className="app-absolute"
                    style={{
                        marginTop: 400,
                        minHeight: 460,
                        width: "100%",
                        zIndex: 2,
                    }}
                    >
                
                        <SlashIdVideoBody {...props} streams={streams} />
                    </div>
              )} 
          </div>
        </div>{" "}
        <div
          className="app-absolute app-top-0 app-left-0"
          style={{
            maxHeight: 700,
            width: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <div className="app-flex">
            <iframe
              style={{ width: "100rem", height: "50rem" }}
              src={`https://player.twitch.tv/?channel=${props.location.state.data.user_name}&muted=true&parent=client-xi-eight-67.vercel.app`}
              frameBorder="0"
              scrolling="<scrolling>"
              allowFullScreen
            ></iframe>

            {/* <img
                    style={{ height: 470, width: "100%", objectFit: "cover" }}
                    src={props.location.state.data.thumbnail_url}
                /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlashIdVideosAll;