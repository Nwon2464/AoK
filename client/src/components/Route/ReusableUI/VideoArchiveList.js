import React from "react";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import Loading from "../../Card/Loading";
import { applyRandomVideoHoverColor } from "../../Card/videoThumbnailHover";
import { useLanguage } from "../../../i18n/LanguageProvider";

const timeSince = (source, language) => {
  const createdAt = new Date(source).getTime();
  if (!Number.isFinite(createdAt)) return "";

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - createdAt) / 1000));
  const intervals = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: "always" });

  for (const [seconds, label] of intervals) {
    const value = Math.floor(elapsedSeconds / seconds);
    if (value >= 1) return formatter.format(-value, label);
  }

  return formatter.format(-elapsedSeconds, "second");
};

const formatDuration = (duration = "") => duration
  .replace("h", ":")
  .replace("m", ":")
  .replace("s", "");

const VideoArchiveList = ({
  error,
  hasMore,
  loading,
  loadingMore,
  loadMoreError,
  onLoadMore,
  onRetry,
  streams = [],
}) => {
  const { language, t } = useLanguage();
  return (
    <section className="app-body-right-background">
      <div className="app-pd-l-2 app-pd-r-2 app-pd-t-2 app-pd-b-2">
        <div className="app-flex app-full-width app-relative app-height-15">
          <div className="app-flex app-flex-column app-full-height">
            <div className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center">
              <h3 className="app-flex app-flex-column app-font-size-9">{t("common.archives")}</h3>
            </div>
            <div className="navigation-link-indicator-container archive-tab-indicator">
              <div className="navigation-link-active-indicator" />
            </div>
          </div>
        </div>
      </div>

      {loading && streams.length === 0 ? (
        <Loading />
      ) : error && streams.length === 0 ? (
        <div className="archive-status" role="alert">
          <p>{error}</p>
          <button type="button" onClick={onRetry}>{t("common.tryAgain")}</button>
        </div>
      ) : streams.length === 0 ? (
        <div className="archive-status">{t("channel.noVideos")}</div>
      ) : (
        <div className="app-flex app-justify-content-center app-align-items-center app-pd-l-2 app-pd-r-2">
          <div className="card__display__flex__wrap">
            {streams.map((video) => (
              <div key={video.id} className="app__tower__300 app-pd-r-02">
                <div className="app__card__height">
                  <div className="app__card__padding_bottom app__card__height">
                    <article className="card__display__flex__direction">
                      <div className="app__width app__order__2 app__margin__top">
                        <div className="app__flex__nowrap app__flex">
                          <div className="app__min__width__0 app__order__2 app__flex__shrink__1 app__flex__grow__1 app__width">
                            <div className="app__margin__bottom">
                              <div className="channel__font_1">
                                <h3 className="app__ellipsis app__font__weight">
                                  <a href={video.url} className="app__font__size app__cursor">
                                    {video.title}
                                  </a>
                                </h3>
                              </div>
                            </div>
                            <div className="channel__user">
                              <h4 className="app__ellipsis app__font__size__0_8 app__color__grey app__cursor">
                                <Link
                                  to={`/${video.user.login}`}
                                  className="app__color__grey app__cursor app__font__size__0_8"
                                >
                                  {video.user.displayName}
                                </Link>
                              </h4>
                            </div>
                          </div>
                          <div className="channel__down"><MoreVertIcon /></div>
                        </div>
                      </div>

                      <a
                        href={video.url}
                        className="app__order__1 app__order__animation__1 app__resize__fit"
                        onMouseEnter={applyRandomVideoHoverColor}
                      >
                        <div className="app__relative app__cursor">
                          <img
                            className="channel__thumbnail"
                            src={video.thumbnailUrl}
                            alt={video.title}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="app__absolute app__top__0 app__left__0 app__card__height app__width">
                            <div className="app__absolute app__bottom__0 app__right__0 app__margin">
                              <p className="app-archive-indicator app__padding app__margin__bottom app__border__radius app__font__weight">
                                {video.type}
                              </p>
                            </div>
                            <div className="app__absolute app__top__0 app__right__0 app__margin">
                              <p className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                                {timeSince(video.createdAt, language)}
                              </p>
                            </div>
                            <div className="app__absolute app__top__0 app__left__0 app__margin">
                              <p className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                                {formatDuration(video.duration)}
                              </p>
                            </div>
                            <div className="app__absolute app__bottom__0 app__left__0 app__margin">
                              <p className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                                {Number(video.viewCount || 0).toLocaleString(language)} {t("common.views")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </article>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasMore && !loadMoreError && streams.length > 0 && (
        <div className="show-more-row">
          <div className="show-more-divider" />
          <button
            type="button"
            className="showMore"
            disabled={loadingMore}
            onClick={onLoadMore}
            aria-busy={loadingMore}
          >
            {loadingMore ? (
              <span className="show-more-spinner" aria-hidden="true" />
            ) : (
              <span className="showMore__button">{t("common.showMore")}</span>
            )}
          </button>
          <div className="show-more-divider" />
        </div>
      )}

      {loadMoreError && (
        <div className="archive-status" role="alert">
          <p>{loadMoreError}</p>
          <button type="button" onClick={onLoadMore}>{t("common.retry")}</button>
        </div>
      )}
    </section>
  );
};

export default VideoArchiveList;
