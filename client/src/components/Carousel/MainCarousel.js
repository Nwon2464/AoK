import React from "react";
import CarouselBody from "./CarouselBody";
const MainCarousel = (props) => {
    return (
        <>
            {
                props.streams.map((streams, i) => {
                    const showAnimation = props.direction === "right" || props.direction === "left";
                    const position = "animate absolute image";
                    const imgStyle = props.determineStyle(i, showAnimation);
                    const AutoCard = props.determineCard(i);
                    return (
                        <div style={imgStyle} key={i} className="slide">
                            {i == props.central ?
                                <div style={imgStyle} key={i} className="slide">
                                    <iframe
                                        onLoad={props.hideLoading}
                                        className="app__iframe app__order__1"
                                        width="1527.3px"
                                        // width="100%" &autoplay=${AutoStyle}
                                        // width={`${AutoWidth}`}
                                        height="300px"
                                        src={`https://player.twitch.tv/?channel=${streams.user_name}&muted=true&parent=client-xi-eight-67.vercel.app&parent=client-xi-eight-67-vercel-app`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <CarouselBody streams={streams} autoCard={AutoCard} />
                                </div>
                                :
                                <img
                                    src={streams.thumbnail_url.replace("440x248", "800x248")}
                                    alt={`${streams.user_name} thumbnail`}
                                    className="carousel-thumbnail"
                                />}
                        </div>
                    )
                })
            }
        </>
    );
};

export default MainCarousel;

