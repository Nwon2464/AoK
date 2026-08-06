import React from "react";
import "./BodyLeft.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import Skeleton from "react-loading-skeleton";
import { showMoreLiveChannels } from "../../actions";
import { useLanguage } from "../../i18n/LanguageProvider";
const BodyLeft = (props) => {
  const { t } = useLanguage();
  const { twitch } = props;
  const isSidebarLoading = twitch.liveChannelsLoadingMore
    && twitch.liveChannelsLoadingConsumer === "sidebar";
  const canShowMore = twitch.sidebarVisibleCount < twitch.activeLiveTwitch.length
    || Boolean(twitch.liveChannelsNextCursor);
  const renderIcons = twitch.activeLiveTwitch
    .slice(0, twitch.sidebarVisibleCount)
    .map((e) => {
    return (
      <div key={e.id} className="app-full-width app-recommend">
        <Link
          to={{
            pathname: `/${e.user_login}`,
            state: {
              data: e,
            },
          }}
          className="app-full-width side-nav-card-link app-pd-x-1 app-pd-y-05 app-align-items-center app-flex-nowrap app-flex"
        >
          <div className="app-align-items-center app-flex-shrink-0 app-avatar--size-30">
            <figure className="app-avatar--size-30">
              <img
                style={{ width: 30, height: 30, borderRadius: 5000 }}
                src={e.profile_image_url}
                alt="profileImage"
              />
            </figure>
          </div>
          <div className="app-full-width app-flex app-justify-content-between app-ellipsis app-full-height app-align-items-center">
            <div className="app-mg-l-1 app-full-width app-ellipsis">
              <div className="app-flex app-align-items-center">
                <p
                  style={{
                    fontWeight: 600,
                    lineHeight: "1.2",
                  }}
                  className="app-ellipsis app-flex-grow-1 app-font-size-6"
                >
                  {e.user_name}
                </p>
              </div>
              <div className="app-pd-r-05">
                <p
                  style={{ lineHeight: "1.2" }}
                  className="app-font-size-5 app-c-text-alt app-ellipsis"
                >
                  {e.game_name}
                </p>
              </div>
            </div>
            <div className="app-mg-l-05 app-flex-shrink-0">
              <div className="app-flex app-align-items-center">
                <div className="app-live-channel-status-indicator app-border-radius-rounded app-live-channel-status-indicator--small"></div>
                <div className="app-mg-l-05">
                  <span className="app-font-size-5 app-c-text-alt">
                    {checkViewers(e.viewer_count, t("common.viewers"))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  });
  return (
    <div className="recommended-channels-panel app-flex app-flex-column">
      {twitch.homeLoading && twitch.activeLiveTwitch.length === 0 ? (
        <>
          <div className="app-mg-1 app-pd-t-05">
            <Skeleton width={150} height={18} style={{ backgroundImage: "none", backgroundColor: "var(--theme-surface-raised)" }} />
          </div>
          <div className="side-nav-loading-list">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="side-nav-loading-row">
                <Skeleton circle width={30} height={30} style={{ backgroundImage: "none", backgroundColor: "var(--theme-surface-raised)" }} />
                <div className="side-nav-loading-copy">
                  <Skeleton width="80%" height={14} style={{ backgroundImage: "none", backgroundColor: "var(--theme-surface-raised)" }} />
                  <Skeleton width="60%" height={12} style={{ backgroundImage: "none", backgroundColor: "var(--theme-surface-raised)" }} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : twitch.activeLiveTwitch.length === 0 ? null : (
        <>
          <div className="app-mg-1 app-pd-t-05">
            <h5>{t("home.recommendedChannels")}</h5>
          </div>
          <div className="app-relative app-align-items-center app-flex app-flex-column app-full-width">
            {renderIcons}
          </div>
          {canShowMore && (
            <div className="side-nav-show-more-row">
              <div className="side-nav-show-more-line" />
              <button
                type="button"
                className="side-nav-show-more"
                disabled={twitch.liveChannelsLoadingMore}
                aria-busy={isSidebarLoading}
                aria-label={isSidebarLoading ? t("home.loadMoreChannels") : t("home.showMoreChannels")}
                onClick={() => props.showMoreLiveChannels("sidebar")}
              >
                {!isSidebarLoading && (
                  <span>{twitch.liveChannelsErrorConsumer === "sidebar"
                    ? t("common.retry")
                    : t("common.showMore")}</span>
                )}
                {isSidebarLoading ? (
                  <span className="side-nav-show-more-spinner" aria-hidden="true" />
                ) : (
                  <ExpandMoreOutlinedIcon className="side-nav-show-more-icon" />
                )}
              </button>
              <div className="side-nav-show-more-line" />
            </div>
          )}
          {twitch.liveChannelsErrorConsumer === "sidebar"
            && twitch.liveChannelsLoadMoreError && (
              <p className="side-nav-show-more-error" role="alert">
                {twitch.liveChannelsLoadMoreError}
              </p>
            )}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    twitch: state.twitch,
  };
};
export default connect(mapStateToProps, { showMoreLiveChannels })(BodyLeft);


const checkViewers = (views, viewerLabel) => {
  if (views <= 999) {
    return <>{`${views} ${viewerLabel}`}</>;
  } else if (views < 999999) {
    return (
      <>{`${Math.sign(views) * (Math.abs(views) / 1000).toFixed(1)
        }K ${viewerLabel}`}</>
    );
  } else if (views <= 9999999) {
    return (
      <>{`${Math.sign(views) * (Math.abs(views) / 1000000).toFixed(1)
        }M ${viewerLabel}`}</>
    );
  }
};
