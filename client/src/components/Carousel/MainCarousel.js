import React, { memo } from "react";
import CarouselBody from "./CarouselBody";
import CentralCarouselItem from "./CentralCarouselItem";

const MainCarousel = (props) => {
    const { delayMs = 5000 } = props;

    return (
        <>
            {props.streams.map((streams, i) => {
                const showAnimation = props.direction === "right" || props.direction === "left";
                const imgStyle = props.determineStyle(i, showAnimation);
                const AutoCard = props.determineCard(i);
                const isCentral = i === props.central;

                return (
                    <div style={imgStyle} key={i} className="slide">
                        {isCentral ? (
                            <CentralCarouselItem
                                key={`central-${streams.user_name}`} // 중앙 변경 시 remount
                                streams={streams}
                                imgStyle={imgStyle}
                                AutoCard={AutoCard}
                                hideLoading={props.hideLoading}
                                delayMs={delayMs}
                            />
                        ) : (
                            <img
                                src={streams.thumbnail_url.replace("440x248", "800x248")}
                                alt={`${streams.user_name} thumbnail`}
                                className="carousel-thumbnail"
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default memo(MainCarousel);
