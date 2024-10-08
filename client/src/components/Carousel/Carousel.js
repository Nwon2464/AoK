import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./Carousel.css";

import MainCarousel from "./MainCarousel";
import LoadingCarousel from "./LoadingCarousel";

import { fetchActiveLiveTwitch } from "../../actions";
import Loading from "../Card/Loading";


const Carousel = (props) => {
  const iframeRef = useRef();
  const totalCarouselCnt = 5;
  const styleRef = useRef();
  const [direction, setDirection] = useState("");
  const [loading, setLoading] = useState(true);
  const [central, setCentral] = useState(2);

  const data = props.twitch.activeLiveTwitch.slice(0, 5);

  const [width, setWidth] = useState([
    { widthSize: "100%" },
    { widthSize: "100%" },
    { widthSize: "1300px" },
    { widthSize: "100%" },
    { widthSize: "100%" },
  ]);

  const determineWidth = (index) => {
    const num = width[index];
    return num.widthSize;
  };

  const [cardDisplay, setCardDisplay] = useState([
    { display: "none" },
    { display: "none" },
    { display: "" },
    { display: "none" },
    { display: "none" },
  ]);
  const determineCard = (index, showAnimation) => {
    const num = cardDisplay[index];
    return num.display;
  };


  const determineStyle = (index, showAnimation) => {
    const num = xPos[index];

    if (showAnimation) {
      return {
        transform: `translateX(${num.first}) translateX(${num.second}) scale(${num.third})`,
        zIndex: `${num.fourth}`,
        transition: "all 450ms ease 0s",
      };
    } else {
      return {
        zIndex: `${num.fourth}`,
        transform: `translateX(${num.first}) translateX(${num.second}) scale(${num.third})`,
        transition: "all 450ms ease 0s",
      };
    }
  };
  const [xPos, setXPos] = useState([
    {
      first: "-40vw",    // Slightly increased from -30vw
      second: "50%",     // Keep percentage
      third: "0.7",      // Smaller scale for far-left item
      fourth: "1",
    },
    {
      first: "-20vw",    // Increased from -15vw
      second: "25%",
      third: "0.85",
      fourth: "2",
    },
    {
      first: "0vw",      // Central item stays at 0vw
      second: "0%",
      third: "1",
      fourth: "3",
    },
    {
      first: "20vw",     // Increased from 15vw
      second: "-25%",
      third: "0.85",
      fourth: "2",
    },
    {
      first: "40vw",     // Slightly increased from 30vw
      second: "-50%",
      third: "0.7",
      fourth: "1",
    },
  ]);

  const moveLeft = () => {
    setCentral((central + 1) % totalCarouselCnt);

    let cardLeftDisplayCopy = cardDisplay.slice();
    cardLeftDisplayCopy.unshift(cardLeftDisplayCopy.pop());
    setCardDisplay(cardLeftDisplayCopy);


    let xLeftPosition = xPos.slice();
    xLeftPosition.unshift(xLeftPosition.pop());
    setXPos(xLeftPosition);
    setDirection("left");
  };

  const moveRight = () => {

    setCentral(((central - 1) + totalCarouselCnt) % totalCarouselCnt);

    let cardRightDisplayCopy = cardDisplay.slice();
    cardRightDisplayCopy.push(cardRightDisplayCopy.shift());
    setCardDisplay(cardRightDisplayCopy);

    let XRightPosition = xPos.slice();
    XRightPosition.push(XRightPosition.shift());
    setXPos(XRightPosition);
    setDirection("right");
  };

  const hideLoading = () => {
    setLoading(false);
  };




  return (
    <div className="carousel app-pd-20">
      <div ref={styleRef} className="slides">
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

        {data.length != 0 ?
          <MainCarousel
            direction={direction}
            determineCard={determineCard}
            determineStyle={determineStyle}
            determineWidth={determineWidth}
            hideLoading={hideLoading}
            streams={data}
            central={central}
          /> :
          <LoadingCarousel imgStyle={determineStyle} />}
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
