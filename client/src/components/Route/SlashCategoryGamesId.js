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
  const [paginationValue,setPaginationValue] = useState("");
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
        `/api/v1/twitch/streams/${
          props.location.state.data.game_id || props.location.state.data.id
        }`,{
          params:{
            cursor:paginationValue
          }
        }
      );
      if (!response.data) {
        throw new Error("Failed to fetch posts");
      }
      // let dataArray = response.data;
      // dataArray.map((game) => {
      //   let newUrl = game.box_art_url
      //     .replace("{width}", "180")
      //     .replace("{height}", "240");
      //   game.box_art_url = newUrl;
      // });
      let category = [];
      for(const d of response.data.data){
        category.push(d);
      }
      setCategory((prevCategory)=>[...prevCategory,...category]);
      // const response = await fetch(
      //   `https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=20`
      // );
      // const newPosts = await response.json();
      // setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setHasMore(category.length > 0); // JSONPlaceholder has 100 posts; stop fetching after that
      setPaginationValue(response.data.pagination.cursor);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.innerHeight , window.scrollY, document.documentElement.scrollHeight);
      const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight

      if (bottom) {
        if (!loading && hasMore) {
          // console.log("you reach the bottom", window.innerHeight);
          fetchPosts(category.length); // Fetch next batch of posts
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, category.length]);


  const checkTags = (streams, i) => {
    return (
      <Link
        className="channel__tag__anchor"
        style={{ marginLeft: 2, maxWidth: 80 }}
        to={`/category/all/tags/${streams.tags}`}
      >
        {streams.tags}
      </Link>
    );
  };

  return (
    <>
     <div className="app-flex app-flex-nowrap app-relative app-full-height ">
      <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
        <BodyLeft />
      </div>
      {!props.location.state ? <NotFound/> : 
        <div className="app-flex app-flex-column app-full-width">
          { category.length==0 ? <SlashCategoryGamesIdLoadingHeader/> : <SlashCategoryHeader total_viewers={props.location.state.data.gameViewers} game_name={props.location.state.data.name} box_image={props.location.state.data.box_art_url}/> }
          <div className="app-full-height app-full-width">
            <SlashCategorySubHeader/>  
            { category.length==0 ? <SlashCategoryGamesIdLoadingBody/> : <SlashCategoryBody data={category}/> }
          </div>
        </div>
      };
    </div>
    </>              
  );
};

export default SlashCategoryGamesId;
