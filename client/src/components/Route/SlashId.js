

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import BodyLeft from "../Body/BodyLeft";
import NotFound from "../error/NotFound";
import SlashIdHeader from "./slashId/SlashIdHeader";
import SlashIdBody from "./slashId/SlashIdBody";
import SlashIdFooter from "./slashId/SlashIdFooter";
import SlashVideoAllLoading from "./ReuseableUI/SlashVideoAllLoading";

const SlashId = (props) => {
  
  const { id } = useParams(); // Get the dynamic id from the route
  const [streams, setStreams] = useState([]);
  const [paginationValue, setPaginationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when id changes
    setStreams([]);
    setPaginationValue("");
    setHasMore(true);
    fetchAllVideos();
  }, [id]); // Dependency on id to refetch when it changes

  const fetchAllVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `https://server-ashy-omega-14.vercel.app/api/v1/videos/${props.location.state.data.user_id}`,
        {
          params: {
            cursor: paginationValue,
          },
        }
      );
      if (!data) {
        throw new Error("Failed to fetch videos");
      }
      let streams = data.data;
      setStreams((prevStreams) => [...prevStreams, ...streams]);
      setHasMore(streams.length > 0); 
      setPaginationValue(data.pagination.cursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;

      if (bottom && !loading && hasMore) {
        fetchAllVideos(); // Fetch next batch of videos
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, streams.length]);
  
  return (
    <>
      <div className="app-flex app-flex-nowrap app-relative app-full-height">
        <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
          <BodyLeft />
        </div>
        {props.location.state ?
        <div className="app-flex app-flex-column app-full-width">
          
          <SlashIdHeader  username={props.location.state.data.user_name} len={streams.length}/>
          <SlashIdBody {...props}/>
          <SlashIdFooter streams={streams}/>
          {/* {!hasMore && <div>No more videos</div>} */}
        </div> 
        : <NotFound/>}
{/* 
        {props.location.state ? 
        <div className="app-flex app-flex-column app-full-width">
          {streams.length ===0 ? <div>loading</div> :  
          <>
              <SlashIdHeader  username={props.location.state.data.user_name}/>
              <SlashIdBody {...props}/>
              <SlashIdFooter streams={streams}/>
          </>
          }
          
        </div> : (
          <NotFound />
        )} */}
      </div>
    </>
  );
};

export default SlashId;

