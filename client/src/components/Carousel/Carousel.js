import React from "react";
import { connect } from "react-redux";

import "./Carousel.css";

import MainCarousel from "./MainCarousel";
import LoadingCarousel from "./LoadingCarousel";
import { CAROUSEL_ITEM_COUNT } from "./carouselConfig";
import useCarouselRotation from "./useCarouselRotation";

import { fetchActiveLiveTwitch } from "../../actions";

const Carousel = (props) => {
  const {
    central,
    getCardDisplay,
    getSlideStyle,
    moveLeft,
    moveRight,
  } = useCarouselRotation();

  const data = props.twitch.activeLiveTwitch.slice(0, CAROUSEL_ITEM_COUNT);

  return (
    <div className="carousel app-pd-20">
      <div className="slides">


        {data.length > 0 ?
          <>
            <div className="app__absolute z_index__100 left__1vw">
              <button className="app__carousel__btn" onClick={moveRight}>
                ‹
              </button>
            </div>
            <div className="app__absolute z_index__100 right__1vw ">
              <button className="app__carousel__btn" onClick={moveLeft}>
                ›
              </button>
            </div>
            <MainCarousel
              getCardDisplay={getCardDisplay}
              getSlideStyle={getSlideStyle}
              streams={data}
              central={central}
              delayMs={1500}
            />
          </> :
          <LoadingCarousel imgStyle={getSlideStyle} />}
      </div>
    </div>
  );
};




const mapStateToProps = (state) => {
  return {
    twitch: state.twitch,
  };
};

export default connect(mapStateToProps, {
  fetchActiveLiveTwitch,
  // fetchActiveLiveGameContents,

})(Carousel);
