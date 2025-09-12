import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import _ from "lodash";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import BodyLeft from "../Body/BodyLeft";
import NotFound from "../error/NotFound";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import SlashCategoryGamesIdLoadingHeader from "./ReuseableUI/SlashCategoryGamesIdLoadingHeader";
import SlashCategoryGamesIdLoadingBody from "./ReuseableUI/SlashCategoryGamesIdLoadingBody";
import { checkViewers, checkFollowers } from "../Body/checkViewers";
import SlashCategoryHeader from "./slashCategoryGamesId/SlashCategoryHeader";
import SlashCategorySubHeader from "./slashCategoryGamesId/SlashCategorySubHeader";
import SlashCategoryBody from "./slashCategoryGamesId/SlashCategoryBody";


const SlashCategoryGamesId = (props) => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [paginationValue, setPaginationValue] = useState("");
  const [category, setCategory] = useState([]);
  useEffect(() => {
    // Fetch initial data
    fetchPosts(0);
  }, []);

  const fetchPosts = async (offset) => {
    if (!props.location.state) {
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      // 'https://api.twitch.tv/helix/streams?first=40&after=eyJiI...' \ 
      const response = await axios.get(
        `https://server-ashy-omega-14.vercel.app/api/v1/twitch/streams/${props.location.state.data.game_id || props.location.state.data.id
        }`, {
        params: {
          cursor: paginationValue
        }
      }
      );
      if (!response.data) {
        throw new Error("Failed to fetch posts");
      }

      let category = [];
      for (const d of response.data.data) {
        category.push(d);
      }
      setCategory((prevCategory) => [...prevCategory, ...category]);

      setHasMore(category.length > 0); // JSONPlaceholder has 100 posts; stop fetching after that
      setPaginationValue(response.data.pagination.cursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const scrollContainer = document.querySelector(".app-overflow-y"); // 오른쪽 div
    const handleScroll = () => {
      if (!scrollContainer) return;
      const bottom = scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight;
      if (bottom) {
        if (!loading && hasMore) {
          console.log("Reach bottom");
          fetchPosts(category.length); // Fetch next batch of posts
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, category.length]);


  const checkTags = (streams, i) => {
    return (
      <span
        className="channel__tag__anchor"
        style={{ marginLeft: 2, maxWidth: 80 }}
        to={`/category/all/tags/${streams.tags}`}
      >
        {streams.tags}
      </span>
    );
  };

  return (
    <>
      <div className="app-flex app-flex-nowrap app-relative app-height-100vh app-overflow-hidden app-bk-color">
        <div className="side-nav app-z-above app-width-240 app-flex-shrink-0">
          <BodyLeft />
        </div>
        {!props.location.state ? <NotFound /> :
          <div className="app-flex app-flex-column  app-full-width app-bk-color-1 app-flex-1 app-overflow-y">
            {category.length == 0 ? <SlashCategoryGamesIdLoadingHeader /> : <SlashCategoryHeader total_viewers={props.location.state.data.gameViewers} game_name={props.location.state.data.name} box_image={props.location.state.data.box_art_url} />}
            <div className="app-full-height app-full-width app-bk-color-1">
              <SlashCategorySubHeader />
              {category.length == 0 ? <SlashCategoryGamesIdLoadingBody /> : <SlashCategoryBody data={category} />}
            </div>
          </div>
        };
      </div>
    </>
  );
};

export default SlashCategoryGamesId;
