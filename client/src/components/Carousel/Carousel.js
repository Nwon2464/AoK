import React, { useState } from "react";
import { connect } from "react-redux";

import "./Carousel.css";

import MainCarousel from "./MainCarousel";
import LoadingCarousel from "./LoadingCarousel";

import { fetchActiveLiveTwitch } from "../../actions";

const CAROUSEL_ITEM_COUNT = 5;
const INITIAL_CENTRAL_INDEX = 2;

const INITIAL_CARD_DISPLAY = [
  { display: "none" },
  { display: "none" },
  { display: "" },
  { display: "none" },
  { display: "none" },
];

const INITIAL_X_POSITIONS = [
  {
    offset: "-40vw",
    correction: "50%",
    scale: "0.7",
    zIndex: "1",
  },
  {
    offset: "-20vw",
    correction: "25%",
    scale: "0.85",
    zIndex: "2",
  },
  {
    offset: "0vw",
    correction: "0%",
    scale: "1",
    zIndex: "3",
  },
  {
    offset: "20vw",
    correction: "-25%",
    scale: "0.85",
    zIndex: "2",
  },
  {
    offset: "40vw",
    correction: "-50%",
    scale: "0.7",
    zIndex: "1",
  },
];

const rotateLeft = (items) => {
  const nextItems = items.slice();
  nextItems.unshift(nextItems.pop());
  return nextItems;
};

const rotateRight = (items) => {
  const nextItems = items.slice();
  nextItems.push(nextItems.shift());
  return nextItems;
};

const Carousel = (props) => {
  const [central, setCentral] = useState(INITIAL_CENTRAL_INDEX);

  const data = props.twitch.activeLiveTwitch.slice(0, CAROUSEL_ITEM_COUNT);

  const [cardDisplay, setCardDisplay] = useState(INITIAL_CARD_DISPLAY);
  const getCardDisplay = (index) => {
    const num = cardDisplay[index];
    return num.display;
  };


  const getSlideStyle = (index) => {
    const num = xPos[index];

    return {
      zIndex: `${num.zIndex}`,
      transform: `translateX(${num.offset}) translateX(${num.correction}) scale(${num.scale})`,
      transition: "all 450ms ease 0s",
    };
  };
  const [xPos, setXPos] = useState(INITIAL_X_POSITIONS);

  const moveLeft = () => {
    setCentral((currentCentral) => (currentCentral + 1) % CAROUSEL_ITEM_COUNT);
    setCardDisplay(rotateLeft);
    setXPos(rotateLeft);
  };

  const moveRight = () => {

    setCentral((currentCentral) => (
      (currentCentral - 1 + CAROUSEL_ITEM_COUNT) % CAROUSEL_ITEM_COUNT
    ));
    setCardDisplay(rotateRight);
    setXPos(rotateRight);
  };

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
