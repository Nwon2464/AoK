import React, { useCallback, useEffect, useRef, useState } from "react";

import { getChannelPage, getChannelVideosPage } from "../../services/twitchService";
import BodyLeft from "../Body/BodyLeft";
import NotFound from "../error/NotFound";
import VideoArchiveList from "./ReusableUI/VideoArchiveList";
import SlashIdFrameLoading from "./ReusableUI/SlashIdFrameLoading";
import SlashIdBody from "./slashId/SlashIdBody";
import SlashIdHeader from "./slashId/SlashIdHeader";
import "./slashId/SlashId.css";
import { useLanguage } from "../../i18n/LanguageProvider";

const appendUniqueVideos = (currentVideos, nextVideos) => {
  const videoMap = new Map(
    [...currentVideos, ...nextVideos].map((video) => [video.id, video])
  );
  return [...videoMap.values()];
};

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

const SlashId = (props) => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef(null);
  const routeUserLogin = props.match.params.id;
  const userLogin = /^[a-zA-Z0-9_]{1,25}$/.test(routeUserLogin)
    ? routeUserLogin
    : null;
  const [channel, setChannel] = useState(null);
  const [channelLoading, setChannelLoading] = useState(true);
  const [channelError, setChannelError] = useState(null);
  const [channelStatus, setChannelStatus] = useState(null);
  const [channelPartial, setChannelPartial] = useState(false);
  const [channelReloadKey, setChannelReloadKey] = useState(0);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState(null);
  const [videosReloadKey, setVideosReloadKey] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setChannel(null);
    setChannelLoading(true);
    setChannelError(null);
    setChannelStatus(null);
    setChannelPartial(false);

    if (!userLogin) {
      setChannelStatus(404);
      setChannelLoading(false);
      return undefined;
    }

    getChannelPage(userLogin)
      .then((result) => {
        if (!cancelled) {
          setChannel(result.channel);
          setChannelPartial(result.partial);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setChannelStatus(error.response?.status || null);
        setChannelError(getErrorMessage(error, "Unable to load this channel."));
      })
      .finally(() => {
        if (!cancelled) setChannelLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [channelReloadKey, userLogin]);

  useEffect(() => {
    let cancelled = false;
    setVideos([]);
    setNextCursor(null);
    setVideosLoading(true);
    setVideosError(null);
    setLoadMoreError(null);

    if (!userLogin) {
      setVideosLoading(false);
      return undefined;
    }

    getChannelVideosPage(userLogin)
      .then((page) => {
        if (cancelled) return;
        setVideos(page.videos);
        setNextCursor(page.nextCursor);
      })
      .catch((error) => {
        if (!cancelled) {
          setVideosError(getErrorMessage(error, "Unable to load videos."));
        }
      })
      .finally(() => {
        if (!cancelled) setVideosLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userLogin, videosReloadKey]);

  const loadMoreVideos = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const page = await getChannelVideosPage(userLogin, nextCursor);
      setVideos((currentVideos) => appendUniqueVideos(currentVideos, page.videos));
      setNextCursor(page.nextCursor);
    } catch (error) {
      setLoadMoreError(getErrorMessage(error, "Unable to load more videos."));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextCursor, userLogin]);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return undefined;

    const handleScroll = () => {
      const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
      if (remaining < 300) loadMoreVideos();
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [loadMoreVideos]);

  return (
    <div className="app-flex app-flex-nowrap app-relative app-height-100vh app-overflow-hidden app-bk-color">
      <div className="side-nav app-z-above app-width-240 app-flex-shrink-0">
        <BodyLeft />
      </div>
      {channelStatus === 404 ? (
        <NotFound />
      ) : (
        <main
          ref={scrollContainerRef}
          className="app-flex app-flex-column app-full-width app-bk-color app-flex-1 app-overflow-y"
        >
          {channelLoading ? (
            <SlashIdFrameLoading />
          ) : channelError ? (
            <div className="channel-page-status" role="alert">
              <p>{channelError}</p>
              <button type="button" onClick={() => setChannelReloadKey((value) => value + 1)}>
                {t("common.tryAgain")}
              </button>
            </div>
          ) : (
            <>
              <SlashIdHeader channel={channel} />
              <SlashIdBody channel={channel} />
              {channelPartial && (
                <div className="channel-page-partial-status" role="status">
                  {t("channel.partial")}
                </div>
              )}
            </>
          )}

          {!channelLoading && !channelError && (
            <VideoArchiveList
              streams={videos}
              loading={videosLoading}
              error={videosError}
              onRetry={() => setVideosReloadKey((value) => value + 1)}
              hasMore={Boolean(nextCursor)}
              loadingMore={loadingMore}
              loadMoreError={loadMoreError}
              onLoadMore={loadMoreVideos}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default SlashId;
