import React from "react";
import { connect } from "react-redux";

import "./Carousel.css";

import MainCarousel from "./MainCarousel";
import LoadingCarousel from "./LoadingCarousel";
import { CAROUSEL_ITEM_COUNT } from "./carouselConfig";
import useCarouselRotation from "./useCarouselRotation";
import { useLanguage } from "../../i18n/LanguageProvider";

const Carousel = ({ twitch }) => {
  const { t } = useLanguage();
  const {
    central,
    getCardDisplay,
    getSlideStyle,
    moveLeft,
    moveRight,
  } = useCarouselRotation();

  const data = twitch.activeLiveTwitch.slice(0, CAROUSEL_ITEM_COUNT);
  const canRotate = data.length === CAROUSEL_ITEM_COUNT;
  const activeCentral = canRotate ? central : Math.floor(data.length / 2);

  return (
    <div className="carousel app-pd-20">
      <div className="slides">
        {twitch.homeLoading ? (
          <LoadingCarousel imgStyle={getSlideStyle} />
        ) : data.length > 0 ? (
          <>
            {canRotate && (
              <>
                <div className="app__absolute z_index__100 left__1vw">
                  <button type="button" className="app__carousel__btn" onClick={moveRight}>‹</button>
                </div>
                <div className="app__absolute z_index__100 right__1vw">
                  <button type="button" className="app__carousel__btn" onClick={moveLeft}>›</button>
                </div>
              </>
            )}
            <MainCarousel
              getCardDisplay={getCardDisplay}
              getSlideStyle={getSlideStyle}
              streams={data}
              central={activeCentral}
              delayMs={1500}
            />
          </>
        ) : (
          <div className="home-empty-status">{t("category.noLive")}</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ twitch: state.twitch });

export default connect(mapStateToProps)(Carousel);
