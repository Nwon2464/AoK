import React from "react";

import { Link } from "react-router-dom";
const CarouselBody = (props) => {

    return <>
        <div
            style={{ display: `${props.autoCard}` }}
            className="image__card app__order__2"
        >
            <div
                style={{ width: "15.7rem" }}
                className="app-flex-column app-flex app-pd-05 app__card__height"
            >
                <div className="app__order__1 app__flex__start">
                    <div className="app__flex__grow__0 app__flex__shrink__0">
                        {" "}
                        <div>
                            <img
                                src={props.streams.profile_image_url}
                                alt="streamJPG"
                                className="image__card__upper__image"
                            />
                        </div>
                    </div>{" "}
                    <div className="app__min__width__0 app__order__2 app__flex__shrink__1 app__flex__grow__1 app__width app__flex__column app__flex app__margin__left__8">
                        <div className="app__margin__negative__bottom">
                            <div className="app__flex__start">
                                <h3 className="app__font__weight ">
                                    <Link
                                        to={{
                                            pathname: `/${props.streams.user_name}`,
                                            state: {
                                                data: props.streams,
                                            },
                                        }}
                                        className="app__font__color app__font__size__0_8"
                                    >
                                        {props.streams.user_name}
                                    </Link>
                                </h3>
                            </div>
                        </div>
                        <div className="app__flex__start">
                            <h5 className=" app__font__size__0_8">
                                <Link
                                    to={{
                                        pathname: `/category/games/${props.streams.game_name
                                            .split(" ")
                                            .join("")}`,
                                        state: {
                                            data: props.streams,
                                        },
                                    }}
                                    className="app__font__color"
                                >
                                    {props.streams.game_name}
                                </Link>
                            </h5>
                        </div>
                        <div className="">
                            <h5>
                                <Link to="/" className="app__font__7__color">
                                    {checkViewers(props.streams.viewer_count)}
                                </Link>
                            </h5>{" "}
                        </div>
                    </div>
                </div>

                <div className="channel__tag__2 app__order__2 channel__tag__1">
                    <div className="channel__tag__3">{checkTags(props.streams.tags)}</div>
                </div>
                <div className="app-word-wrap app__order__3 app-overflow-hidden">
                    {props.streams.title}
                </div>
                <div className="app-carousel-metadata"></div>
            </div>
        </div>
    </>;
};

export default CarouselBody;


const checkTags = (streams) => {
    if (streams == null) {
        return <></>
    }
    return (
        <>
            {streams.map((e) => {
                return (
                    <Link
                        to="/"
                        style={{ marginLeft: 2, maxWidth: 90 }}
                        className="channel__tag__anchor"
                    >
                        {e}
                    </Link>
                )
            })}
        </>
    );
};

const checkViewers = (views) => {
    if (views <= 999) {
        return <>{`${views} viewers`}</>;
    } else if (views < 999999) {
        return (
            <>{`${Math.sign(views) * (Math.abs(views) / 1000).toFixed(1)
                }K viewers`}</>
        );
    } else if (views <= 9999999) {
        return (
            <>{`${Math.sign(views) * (Math.abs(views) / 1000000).toFixed(1)
                }M viewers`}</>
        );
    }
};