import React from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import { Link } from "react-router-dom";
import { formatStreamElapsedTime } from "./streamMetadata";
import { applyRandomVideoHoverColor } from "./videoThumbnailHover";
import { useLanguage } from "../../i18n/LanguageProvider";
const VideoCard = (props) => {
  const { t } = useLanguage();
  const [now, setNow] = React.useState(Date.now());
  const hasBufferedVideos = props.visible < props.videos.length;
  const canFetchMore = Boolean(props.onShowMore && props.hasMore);
  const showMore = hasBufferedVideos || canFetchMore;
  const showMoreLabel = props.loadMoreError ? t("common.retry") : t("common.showMore");
  const handleShowMore = props.onShowMore || props.showClick;
  const showMoreDisabled = props.loadingMore || props.showMoreDisabled;

  React.useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="game__card app-pd-15">
      <div className="card__maxWidth__margin app__tower__gutter">
        <h3
          style={{
            paddingBottom: "0.5rem",
            paddingLeft: "0.2rem",
            fontSize: "large",
          }}
        >
          {props.recommend ? `${t("home.recommendedPrefix")} ` : ""}
          {/* {props.categories === "Live Channel" ? "Live Channel " : ""} */}
          {props.categoryId ? (
            <Link
              to={{
                pathname: `/category/games/${props.categoryId}`,
                state: {
                  data: {
                    id: props.categoryId,
                    game_id: props.categoryId,
                    name: props.categories,
                  },
                },
              }}
            >
              <strong
                style={{
                  color: "#00b5ad",
                  fontSize: "1.5rem",
                  paddingLeft: "0.1rem",
                }}
              >
                {props.categories}{" "}
              </strong>
            </Link>
          ) : (
            <strong
              style={{
                color: "#00b5ad",
                fontSize: "1.5rem",
                paddingLeft: "0.1rem",
              }}
            >
              {props.categories}{" "}
            </strong>
          )}
          {props.recommend ? ` ${t("home.recommendedSuffix")}` : ""}
        </h3>
        <div className="app__relative">
          <div className="card__display__flex__wrap">
            {props.videos.slice(0, props.visible).map((e, i) => {
              return (
                <div
                  key={i}
                  className="app__tower__300 app__tower__padding__gutter"
                >
                  <div className="app__card__height">
                    <div className="app__card__padding_bottom app__card__height">
                      <article className="card__display__flex__direction">
                        <div className="app__width app__order__2 app__margin__top">
                          <div className="app__flex__nowrap app__flex">
                            <div className="app__min__width__0 app__order__2 app__flex__shrink__1 app__flex__grow__1 app__width">
                              <div className="app__margin__bottom">
                                <div className="channel__font_1">
                                  <h3 className="app__ellipsis app__font__weight">
                                    <Link
                                      to={{
                                        pathname: `/${e.user_login}`,
                                        state: { data: e },
                                      }}
                                      className="app__font__size app__cursor"
                                    >
                                      {e.title}
                                    </Link>
                                  </h3>
                                </div>
                              </div>
                              <div className="channel__user">
                                <div className="stream-card-user-row">
                                  <h4 className="stream-card-user-name app__ellipsis app__font__size__0_8 app__color__grey app__cursor">
                                    <Link
                                      to={{
                                        pathname: `/${e.user_login}/videos/all`,
                                        state: { data: e },
                                      }}
                                      className="app__color__grey app__cursor app__font__size__0_8"
                                    >
                                      {e.user_name}
                                    </Link>
                                  </h4>
                                  <div className="stream-card-meta">
                                    <span className="stream-card-language-badge">
                                      {e.language?.toUpperCase()}
                                    </span>
                                    <span className="stream-card-duration-badge">
                                      {formatStreamElapsedTime(e.started_at, now)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="app__ellipsis app__font__size__0_8">
                                    <Link
                                      to={{
                                        pathname: `/category/games/${e.game_id}`,
                                        state: { data: e },
                                      }}
                                      className="app__color__grey app__cursor app__font__size__0_8"
                                    >
                                      {e.game_name}
                                    </Link>
                                  </h5>
                                </div>
                              </div>
                              <div className="channel__tag">
                                <div className="channel__tag__1">
                                  <div className="channel__tag__2">
                                    <div className="channel__tag__3">
                                      {props.checkTags(e)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="channel__icon">
                              <Link
                                to={{
                                  pathname: `/${e.user_login}/videos/all`,
                                  state: { data: e },
                                }}
                              >
                                <img
                                  className="channel__icon__1"
                                  src={e.profile_image_url}
                                  alt={`${e.user_name} profile`}
                                />
                              </Link>
                            </div>
                            <div className="channel__down">
                              <MoreVertIcon />
                            </div>
                          </div>
                        </div>

                        <Link
                          to={{
                            pathname: `/${e.user_login}`,
                            state: { data: e },
                          }}
                          className="app__order__1 app__order__animation__1 app__resize__fit"
                          onMouseEnter={applyRandomVideoHoverColor}
                        >
                          <div className="app__relative app__cursor">

                            <img
                              className="channel__thumbnail"
                              src={e.thumbnail_url}
                              alt={`${e.user_name} live stream`}
                            />

                            <div className="app__absolute app__top__0 app__left__0 app__card__height app__width">
                              <div className="app__absolute app__top__0 app__left__0 app__margin">
                                <p className="app__uppercase app__live__indicator app__font__weight app__border__radius app__padding">
                                  {e.type}
                                </p>
                              </div>
                              <div className="app__absolute app__bottom__0 app__left__0 app__margin">
                                <p className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                                  {props.checkViewers(e.viewer_count)}
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
        {showMore ? (
          <>
            <div className="show-more-row">
              <div className="show-more-divider" />
              <button
                type="button"
                onClick={handleShowMore}
                className="showMore"
                disabled={showMoreDisabled}
                aria-busy={props.loadingMore}
                aria-label={props.loadingMore ? t("home.loadMoreChannels") : showMoreLabel}
              >
                {!props.loadingMore && (
                  <span className="showMore__button">{showMoreLabel}</span>
                )}
                {props.loadingMore ? (
                  <span className="show-more-spinner" aria-hidden="true" />
                ) : (
                  <ExpandMoreOutlinedIcon className="down__icon" />
                )}
              </button>

              <div className="show-more-divider" />
            </div>
            {props.loadMoreError && (
              <p className="show-more-error" role="alert">{props.loadMoreError}</p>
            )}
          </>

        ) : null}
      </div>
    </div>
  );
};
export default VideoCard;
