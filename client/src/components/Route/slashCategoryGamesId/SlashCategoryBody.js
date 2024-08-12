import React from "react";
import {Link} from "react-router-dom";

import MoreVertIcon from "@material-ui/icons/MoreVert";

import {checkViewers} from "../../Body/checkViewers";
const SlashCategoryBody = (props) => {

    const checkTags = (streams, i) => {
        return (
            <Link
                className="channel__tag__anchor"
                style={{
                marginLeft: 2,
                maxWidth: 80
            }}
                to={`/category/all/tags/${streams.tags}`}>
                {streams.tags}
            </Link>
        );
    };
    return (
        <div>
            <div
                className="app-flex app-justify-content-center app-align-items-center app-pd-l-2 app-pd-r-2">
                <div className="card__display__flex__wrap">
                    {props
                        .data
                        .map((e, i) => {
                            return (
                                <div key={i} className="app__tower__300 app-pd-r-02">
                                    <div className="app__card__height">
                                        <div className="app__card__padding_bottom app__card__height">
                                            <article className="card__display__flex__direction">
                                                <div className="app__width app__order__2 app__margin__top">
                                                    <div className="app__flex__nowrap app__flex">
                                                        <div className="channel__icon">
                                                            <Link
                                                                to={{
                                                                pathname: `/${e.user_name}/videos/all`,
                                                                state: {
                                                                    data: e
                                                                }
                                                            }}>
                                                                <img className="channel__icon__1" src={e.profile_url}/>
                                                            </Link>
                                                        </div>
                                                        <div
                                                            className="app__min__width__0 app__order__2 app__flex__shrink__1 app__flex__grow__1 app__width">
                                                            <div className="app__margin__bottom">
                                                                <div className="channel__font_1">
                                                                    <h3 className="app__ellipsis app__font__weight">
                                                                        <Link
                                                                            to={{
                                                                            pathname: `/${e.user_name}`,
                                                                            state: {
                                                                                data: e,
                                                                                game_name: e.game_name
                                                                            }
                                                                        }}
                                                                            className="app__font__size app__cursor">
                                                                            {e.title}
                                                                        </Link>
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                            <div className="channel__user">
                                                                <div>
                                                                    <h4 className="app__ellipsis app__font__size__0_8 app__color__grey app__cursor">
                                                                        <Link
                                                                            to={{
                                                                            pathname: `/${e.user_name}/videos/all`,
                                                                            state: {
                                                                                data: e,
                                                                                game_name: e.game_name
                                                                            }
                                                                        }}
                                                                            className="app__color__grey app__cursor app__font__size__0_8">
                                                                            {e.user_name}
                                                                        </Link>
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                            <div className="channel__tag">
                                                                <div className="channel__tag__1">
                                                                    <div className="channel__tag__2">
                                                                        <div className="channel__tag__3">
                                                                            {checkTags(e)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="channel__down">
                                                            <MoreVertIcon/>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={{
                                                    pathname: `/${e.user_name}`,
                                                    state: {
                                                        data: e
                                                    },
                                                    state: {
                                                        data: e,
                                                        game_name: e.game_name
                                                    }
                                                }}
                                                    className="app__order__1">
                                                    <div className="app__relative app__cursor">
                                                        <div>
                                                            <img
                                                                className="channel__thumbnail"
                                                                src={e
                                                                .thumbnail_url
                                                                .replace("{width}", "440")
                                                                .replace("{height}", "248")}/>
                                                        </div>
                                                        <div
                                                            className="app__absolute app__top__0 app__left__0 app__card__height app__width">
                                                            <div className="app__absolute app__top__0 app__left__0 app__margin">
                                                                <p
                                                                    className="app__uppercase app__live__indicator app__font__weight app__border__radius app__padding">
                                                                    {e.type}
                                                                </p>
                                                            </div>
                                                            <div className="app__absolute app__bottom__0 app__left__0 app__margin">
                                                                <p
                                                                    className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                                                                    {checkViewers(e.viewer_count)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default SlashCategoryBody;
