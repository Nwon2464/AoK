import React, { memo } from "react";
import CentralCarouselItem from "./CentralCarouselItem";

const MainCarousel = (props) => {
    const { delayMs = 2000 } = props;

    return (
        <>
            {props.streams.map((streams, i) => {
                const imgStyle = props.getSlideStyle(i);
                const isCentral = i === props.central;
                const AutoCard = isCentral ? "" : props.getCardDisplay(i);

                return (
                    <div style={imgStyle} key={i} className="slide">
                        {isCentral ? (
                            <CentralCarouselItem
                                key={`central-${streams.user_name}`} // 중앙 변경 시 remount
                                streams={streams}
                                AutoCard={AutoCard}
                                delayMs={delayMs}
                            />
                        ) : (
                            <img
                                src={streams.thumbnail_url.replace("440x248", "800x248")}
                                alt={`${streams.user_name} thumbnail`}
                                className="carousel-thumbnail"
                                loading="lazy" decoding="async"
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default memo(MainCarousel);
