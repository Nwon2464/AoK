import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MoreVertIcon from "@material-ui/icons/MoreVert";

import { checkViewers } from "../../Body/checkViewers";
import { formatStreamElapsedTime } from "../../Card/streamMetadata";
import { applyRandomVideoHoverColor } from "../../Card/videoThumbnailHover";
import { useLanguage } from "../../../i18n/LanguageProvider";

const StreamTags = ({ tags = [] }) => (
  <>
    {tags.map((tag) => (
      <span
        key={tag}
        className="channel__tag__anchor category-page-stream-tag"
      >
        {tag}
      </span>
    ))}
  </>
);

const SlashCategoryBody = ({ data }) => {
  const { t } = useLanguage();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="app-flex app-justify-content-center app-align-items-center app-pd-l-2 app-pd-r-2">
      <div className="card__display__flex__wrap">
        {data.map((stream) => {
          const channelPath = `/${stream.user_login || stream.user_name}`;

          return (
            <div key={stream.id} className="app__tower__300 app-pd-r-02">
              <div className="app__card__height">
                <div className="app__card__padding_bottom app__card__height">
                  <article className="card__display__flex__direction">
                    <div className="app__width app__order__2 app__margin__top">
                      <div className="app__flex__nowrap app__flex">
                        <div className="channel__icon">
                          <Link to={{ pathname: channelPath, state: { data: stream } }}>
                            <img
                              className="channel__icon__1"
                              src={stream.profile_image_url}
                              alt={`${stream.user_name} profile`}
                              loading="lazy"
                              decoding="async"
                            />
                          </Link>
                        </div>
                        <div className="app__min__width__0 app__order__2 app__flex__shrink__1 app__flex__grow__1 app__width">
                          <div className="app__margin__bottom">
                            <div className="channel__font_1">
                              <h3 className="app__ellipsis app__font__weight">
                                <Link
                                  to={{ pathname: channelPath, state: { data: stream } }}
                                  className="app__font__size app__cursor"
                                >
                                  {stream.title}
                                </Link>
                              </h3>
                            </div>
                          </div>
                          <div className="channel__user stream-card-user-row">
                            <h4 className="stream-card-user-name app__ellipsis app__font__size__0_8 app__color__grey app__cursor">
                              <Link
                                to={{ pathname: channelPath, state: { data: stream } }}
                                className="app__color__grey app__cursor app__font__size__0_8"
                              >
                                {stream.user_name}
                              </Link>
                            </h4>
                            <div className="stream-card-meta">
                              <span className="stream-card-language-badge">
                                {stream.language?.toUpperCase()}
                              </span>
                              <span className="stream-card-duration-badge">
                                {formatStreamElapsedTime(stream.started_at, now)}
                              </span>
                            </div>
                          </div>
                          <div className="channel__tag">
                            <div className="channel__tag__1">
                              <div className="channel__tag__2">
                                <div className="channel__tag__3">
                                  <StreamTags tags={stream.tags} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="channel__down">
                          <MoreVertIcon />
                        </div>
                      </div>
                    </div>

                    <Link
                      to={{ pathname: channelPath, state: { data: stream } }}
                      className="app__order__1 app__order__animation__1 app__resize__fit"
                      onMouseEnter={applyRandomVideoHoverColor}
                    >
                      <div className="app__relative app__cursor">
                        <img
                          className="channel__thumbnail"
                          src={stream.thumbnail_url}
                          alt={`${stream.user_name} live stream`}
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="app__absolute app__top__0 app__left__0 app__card__height app__width">
                          <div className="app__absolute app__top__0 app__left__0 app__margin">
                            <p className="app__uppercase app__live__indicator app__font__weight app__border__radius app__padding">
                              {stream.type}
                            </p>
                          </div>
                          <div className="app__absolute app__bottom__0 app__left__0 app__margin">
                            <p className="app__view__indicator app__padding app__margin__bottom app__border__radius">
                              {checkViewers(stream.viewer_count, t("common.viewers"))}
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
  );
};

export default SlashCategoryBody;
