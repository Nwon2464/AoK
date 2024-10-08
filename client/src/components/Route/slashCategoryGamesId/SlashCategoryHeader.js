import React from "react";
import { Link } from "react-router-dom";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { checkViewers, genRand, checkFollowers } from "../../Body/checkViewers";

const SlashCategoryHeader = (props) => {
    return (
        <div className="app-flex app-relative app-banner-outer">
            {/* /category/games/{props.match.params.id} */}
            <div
                style={{
                    // backgroundImage: `url(${props
                    //     .box_image
                    //     .replace("188", "1080")
                    //     .replace("250", "340")})`
                }}
                className="app-absolute app-banner"></div>
            <div className="app-flex app-full-width app-pd-20">
                <div className="app-full-width app-flex">
                    <div className="app-mg-r-2 app-flex">
                        <img src={props.box_image} />
                    </div>
                    <div className="app-flex app-flex-column app-justify-content-center">
                        <div className="app-flex">
                            <h1>{props.game_name}</h1>
                        </div>
                        <div className="app-flex app-mg-t-1">
                            <div className="app-inline-block">
                                <p className="app-font-size-7">
                                    <strong>{checkViewers(props.total_viewers)}</strong>
                                </p>
                            </div>
                            <div className="app-inline-block app-mg-x-1">
                                <p className="app-font-size-7">•</p>
                            </div>
                            <div className="app-inline-block">
                                <p className="app-font-size-7">
                                    <strong>{checkFollowers(genRand(1000, 10000000))}</strong>
                                </p>
                            </div>
                            <div className="app-inline-block app-mg-x-1">
                                <p className="app-font-size-7">•</p>
                            </div>
                            <div className="app-inline-block">
                                <div
                                    style={{
                                        marginTop: 0.5
                                    }}
                                    className="app-flex app-align-items-center app-full-height">
                                    <Link
                                        to="/"
                                        className="channel__tag__anchor"
                                        style={{
                                            marginLeft: 2,
                                            maxWidth: 90
                                        }}>
                                        MOBA
                                    </Link>{" "}
                                    <Link
                                        to="/"
                                        className="channel__tag__anchor"
                                        style={{
                                            marginLeft: 4,
                                            maxWidth: 90
                                        }}>
                                        Action
                                    </Link>{" "}
                                </div>{" "}
                            </div>
                        </div>

                        <div className="app-mg-t-1">
                            <div className="app-inline-flex">
                                <button
                                    className="app-cursor-pointer app-pd-y-06 app-pd-x-1 app-align-items-center app-justify-content-center app-flex app-core-primary app-border-bottom-left-radius-medium app-border-bottom-right-radius-medium app-border-top-left-radius-medium app-border-top-right-radius-medium">
                                    <div className="app-align-items-center app-justify-content-center app-flex">
                                        <FavoriteBorderOutlinedIcon
                                            style={{
                                                width: 17,
                                                height: 17
                                            }}
                                            className="app-mg-r-05" />
                                        <span className="app-font-size-5 app-font-600">
                                            Follow
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlashCategoryHeader;
