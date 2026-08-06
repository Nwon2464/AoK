import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getCategoryPage } from "../../services/twitchService";
import BodyLeft from "../Body/BodyLeft";
import NotFound from "../error/NotFound";
import SlashCategoryGamesIdLoadingHeader from "./ReusableUI/SlashCategoryGamesIdLoadingHeader";
import SlashCategoryGamesIdLoadingBody from "./ReusableUI/SlashCategoryGamesIdLoadingBody";
import SlashCategoryHeader from "./slashCategoryGamesId/SlashCategoryHeader";
import SlashCategorySubHeader from "./slashCategoryGamesId/SlashCategorySubHeader";
import SlashCategoryBody from "./slashCategoryGamesId/SlashCategoryBody";
import "./slashCategoryGamesId/SlashCategoryGamesId.css";
import { useLanguage } from "../../i18n/LanguageProvider";

const appendUniqueStreams = (currentStreams, nextStreams) => {
  const streamMap = new Map(
    [...currentStreams, ...nextStreams].map((stream) => [stream.id, stream])
  );

  return [...streamMap.values()];
};

const preloadImage = (source) => new Promise((resolve) => {
  if (!source) {
    resolve();
    return;
  }

  const image = new Image();
  image.onload = resolve;
  image.onerror = resolve;
  image.src = source;
});

const SlashCategoryGamesId = (props) => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef(null);
  const routeGameId = props.match.params.id;
  const gameId = /^\d+$/.test(routeGameId) ? routeGameId : null;

  const [category, setCategory] = useState(null);
  const [streams, setStreams] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvedGameId, setResolvedGameId] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!gameId) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    setErrorStatus(null);
    setCategory(null);
    setStreams([]);
    setNextCursor(null);
    setSelectedLanguage("");
    setSelectedTag("");

    const loadCategory = async () => {
      try {
        const page = await getCategoryPage(gameId);
        await preloadImage(page.category.box_art_url);

        if (cancelled) return;
        setCategory(page.category);
        setStreams(page.streams);
        setNextCursor(page.nextCursor);
      } catch (requestError) {
        if (cancelled) return;
        setErrorStatus(requestError.response?.status || null);
        setError(
          requestError.response?.data?.message || "Unable to load this category."
        );
      } finally {
        if (!cancelled) {
          setResolvedGameId(gameId);
          setLoading(false);
        }
      }
    };

    loadCategory();

    return () => {
      cancelled = true;
    };
  }, [gameId, reloadKey]);

  const fetchMore = useCallback(async () => {
    if (!gameId || !nextCursor || loadingMore) {
      return;
    }

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const page = await getCategoryPage(gameId, nextCursor);
      setStreams((currentStreams) => appendUniqueStreams(currentStreams, page.streams));
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      setLoadMoreError(
        requestError.response?.data?.message || "Unable to load more channels."
      );
    } finally {
      setLoadingMore(false);
    }
  }, [gameId, loadingMore, nextCursor]);

  useEffect(() => {
    const element = scrollContainerRef.current;

    if (!element) return undefined;

    const handleScroll = () => {
      const remainingScroll = element.scrollHeight - element.scrollTop - element.clientHeight;
      if (remainingScroll < 300 && nextCursor && !loadingMore) {
        fetchMore();
      }
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [fetchMore, loadingMore, nextCursor]);

  const totalViewers = useMemo(
    () => streams.reduce((total, stream) => total + stream.viewer_count, 0),
    [streams]
  );
  const languageOptions = useMemo(
    () => [...new Set(streams.map((stream) => stream.language).filter(Boolean))].sort(),
    [streams]
  );
  const tagOptions = useMemo(() => {
    const languageStreams = selectedLanguage
      ? streams.filter((stream) => stream.language === selectedLanguage)
      : streams;

    return [...new Set(languageStreams.flatMap((stream) => stream.tags || []))].sort();
  }, [selectedLanguage, streams]);
  const filteredStreams = useMemo(
    () => streams.filter((stream) => (
      (!selectedLanguage || stream.language === selectedLanguage)
      && (!selectedTag || stream.tags?.includes(selectedTag))
    )),
    [selectedLanguage, selectedTag, streams]
  );
  const showSkeleton = loading || resolvedGameId !== gameId;

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setSelectedTag("");
  };

  return (
    <div className="app-flex app-flex-nowrap app-relative app-height-100vh app-overflow-hidden app-bk-color">
      <div className="side-nav app-z-above app-width-240 app-flex-shrink-0">
        <BodyLeft />
      </div>
      {!gameId ? (
        <NotFound />
      ) : (
        <div
          ref={scrollContainerRef}
          className="app-flex app-flex-column app-full-width app-bk-color-1 app-flex-1 app-overflow-y"
        >
          {showSkeleton ? (
            <>
              <SlashCategoryGamesIdLoadingHeader />
              <div className="app-full-height app-full-width app-bk-color-1">
                <SlashCategorySubHeader />
                <SlashCategoryGamesIdLoadingBody />
              </div>
            </>
          ) : errorStatus === 404 ? (
            <NotFound />
          ) : error ? (
            <div className="category-page-status" role="alert">
              <h2>{t("home.loadFailed")}</h2>
              <p>{error}</p>
              <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                {t("common.tryAgain")}
              </button>
            </div>
          ) : (
            <>
              <SlashCategoryHeader
                totalViewers={totalViewers}
                gameName={category.name}
                boxImage={category.box_art_url}
              />
              <div className="app-full-height app-full-width app-bk-color-1">
                <SlashCategorySubHeader
                  gameName={category.name}
                  languages={languageOptions}
                  tags={tagOptions}
                  selectedLanguage={selectedLanguage}
                  selectedTag={selectedTag}
                  onLanguageChange={handleLanguageChange}
                  onTagChange={setSelectedTag}
                />
                {filteredStreams.length > 0 ? (
                  <SlashCategoryBody data={filteredStreams} />
                ) : (
                  <div className="category-page-status">{t("category.noLive")}</div>
                )}
                {loadingMore && (
                  <div className="category-page-loading-more" role="status" aria-label={t("home.loadMoreChannels")}>
                    <span className="category-page-spinner" aria-hidden="true" />
                  </div>
                )}
                {!loadingMore && !loadMoreError && nextCursor && streams.length > 0 && (
                  <div className="show-more-row">
                    <div className="show-more-divider" />
                    <button type="button" className="showMore" onClick={fetchMore}>
                      <span className="showMore__button">{t("common.showMore")}</span>
                    </button>
                    <div className="show-more-divider" />
                  </div>
                )}
                {loadMoreError && (
                  <div className="category-page-status" role="alert">
                    <p>{loadMoreError}</p>
                    <button type="button" onClick={fetchMore}>{t("common.retry")}</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SlashCategoryGamesId;
