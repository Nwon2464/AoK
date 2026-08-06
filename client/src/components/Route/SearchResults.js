import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

import { searchCategoriesPage, searchChannelsPage } from "../../services/twitchService";
import BodyLeft from "../Body/BodyLeft";
import { formatStreamElapsedTime } from "../Card/streamMetadata";
import { applyRandomCardHoverColor } from "../Card/videoThumbnailHover";
import "./search/SearchResults.css";
import { useLanguage } from "../../i18n/LanguageProvider";

const appendUnique = (currentItems, nextItems) => {
  const itemMap = new Map(
    [...currentItems, ...nextItems].map((item) => [item.id, item])
  );
  return [...itemMap.values()];
};

const appendUniqueChannels = (currentChannels, nextChannels) => (
  appendUnique(currentChannels, nextChannels)
    .sort((left, right) => Number(right.isLive) - Number(left.isLive))
);

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

const ChannelSkeleton = () => (
  <div className="search-channel-grid" aria-label="Loading channels">
    {Array.from({ length: 8 }, (_, index) => (
      <div key={index} className="search-channel-card search-result-skeleton">
        <Skeleton circle width={64} height={64} />
        <div className="search-channel-copy">
          <Skeleton width="55%" height={18} />
          <Skeleton width="85%" height={14} />
          <Skeleton width="40%" height={14} />
        </div>
      </div>
    ))}
  </div>
);

const CategorySkeleton = () => (
  <div className="search-category-grid" aria-label="Loading categories">
    {Array.from({ length: 12 }, (_, index) => (
      <div key={index} className="search-category-card search-result-skeleton">
        <div className="search-category-skeleton-image"><Skeleton height="100%" /></div>
        <Skeleton width="80%" height={18} />
      </div>
    ))}
  </div>
);

const SearchResults = ({ location }) => {
  const { t } = useLanguage();
  const query = (new URLSearchParams(location.search).get("q") || "").trim();
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [channelCursor, setChannelCursor] = useState(null);
  const [categoryCursor, setCategoryCursor] = useState(null);
  const [channelsLoading, setChannelsLoading] = useState(Boolean(query));
  const [categoriesLoading, setCategoriesLoading] = useState(Boolean(query));
  const [channelsError, setChannelsError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [channelsLoadingMore, setChannelsLoadingMore] = useState(false);
  const [categoriesLoadingMore, setCategoriesLoadingMore] = useState(false);
  const [channelsLoadMoreError, setChannelsLoadMoreError] = useState(null);
  const [categoriesLoadMoreError, setCategoriesLoadMoreError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let cancelled = false;

    setChannels([]);
    setCategories([]);
    setChannelCursor(null);
    setCategoryCursor(null);
    setChannelsError(null);
    setCategoriesError(null);
    setChannelsLoadMoreError(null);
    setCategoriesLoadMoreError(null);

    if (!query) {
      setChannelsLoading(false);
      setCategoriesLoading(false);
      return undefined;
    }

    setChannelsLoading(true);
    setCategoriesLoading(true);

    searchChannelsPage(query, undefined, 12)
      .then((page) => {
        if (cancelled) return;
        setChannels(page.channels);
        setChannelCursor(page.nextCursor);
      })
      .catch((error) => {
        if (!cancelled) {
          setChannelsError(getErrorMessage(error, "Unable to search channels."));
        }
      })
      .finally(() => {
        if (!cancelled) setChannelsLoading(false);
      });

    searchCategoriesPage(query, undefined, 12)
      .then((page) => {
        if (cancelled) return;
        setCategories(page.categories);
        setCategoryCursor(page.nextCursor);
      })
      .catch((error) => {
        if (!cancelled) {
          setCategoriesError(getErrorMessage(error, "Unable to search categories."));
        }
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, reloadKey]);

  const loadMoreChannels = useCallback(async () => {
    if (!query || !channelCursor || channelsLoadingMore) return;

    setChannelsLoadingMore(true);
    setChannelsLoadMoreError(null);
    try {
      const page = await searchChannelsPage(query, channelCursor, 12);
      setChannels((currentChannels) => appendUniqueChannels(currentChannels, page.channels));
      setChannelCursor(page.nextCursor);
    } catch (error) {
      setChannelsLoadMoreError(getErrorMessage(error, "Unable to load more channels."));
    } finally {
      setChannelsLoadingMore(false);
    }
  }, [channelCursor, channelsLoadingMore, query]);

  const loadMoreCategories = useCallback(async () => {
    if (!query || !categoryCursor || categoriesLoadingMore) return;

    setCategoriesLoadingMore(true);
    setCategoriesLoadMoreError(null);
    try {
      const page = await searchCategoriesPage(query, categoryCursor, 12);
      setCategories((currentCategories) => appendUnique(currentCategories, page.categories));
      setCategoryCursor(page.nextCursor);
    } catch (error) {
      setCategoriesLoadMoreError(getErrorMessage(error, "Unable to load more categories."));
    } finally {
      setCategoriesLoadingMore(false);
    }
  }, [categoriesLoadingMore, categoryCursor, query]);

  return (
    <div className="app-flex app-flex-nowrap app-relative app-full-height app-overflow-hidden">
      <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
        <BodyLeft />
      </div>
      <main className="search-results-page app-flex app-flex-column app-full-width app-overflow-y">
        {!query ? (
          <div className="search-results-status">{t("search.startTyping")}</div>
        ) : (
          <div className="search-results-content">
            <h1>
              {t("search.resultsFor", { query })}
            </h1>

            <section className="search-results-section">
              <h2>{t("common.channels")}</h2>
              {channelsLoading ? (
                <ChannelSkeleton />
              ) : channelsError ? (
                <div className="search-results-status" role="alert">
                  <p>{channelsError}</p>
                  <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                    {t("common.tryAgain")}
                  </button>
                </div>
              ) : channels.length === 0 ? (
                <div className="search-results-empty">{t("search.noResults")}</div>
              ) : (
                <div className="search-channel-grid">
                  {channels.map((channel) => (
                    <article key={channel.id} className="search-channel-card">
                      <Link to={`/${channel.login}`} className="search-channel-avatar-link">
                        <img src={channel.thumbnailUrl} alt={`${channel.displayName} profile`} />
                        {channel.isLive && <span className="search-channel-live-dot" />}
                      </Link>
                      <div className="search-channel-copy">
                        <div className="search-channel-heading">
                          <Link to={`/${channel.login}`}>{channel.displayName}</Link>
                          <span className={channel.isLive ? "is-live" : "is-offline"}>
                            {channel.isLive ? t("common.live") : t("common.offline")}
                          </span>
                        </div>
                        {channel.title && <p>{channel.title}</p>}
                        <div className="search-channel-meta">
                          {channel.game?.id && (
                            <Link to={`/category/games/${channel.game.id}`}>{channel.game.name}</Link>
                          )}
                          {channel.language && <span>{channel.language.toUpperCase()}</span>}
                          {channel.isLive && channel.startedAt && (
                            <span>{formatStreamElapsedTime(channel.startedAt, now)}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {channelCursor && !channelsLoadMoreError && channels.length > 0 && (
                <div className="show-more-row">
                  <div className="show-more-divider" />
                  <button
                    type="button"
                    className="showMore"
                    disabled={channelsLoadingMore}
                    onClick={loadMoreChannels}
                    aria-busy={channelsLoadingMore}
                  >
                    {channelsLoadingMore ? (
                      <span className="show-more-spinner" aria-hidden="true" />
                    ) : (
                      <span className="showMore__button">{t("common.showMore")}</span>
                    )}
                  </button>
                  <div className="show-more-divider" />
                </div>
              )}
              {channelsLoadMoreError && (
                <div className="search-results-status" role="alert">
                  <p>{channelsLoadMoreError}</p>
                  <button type="button" onClick={loadMoreChannels}>{t("common.retry")}</button>
                </div>
              )}
            </section>

            <section className="search-results-section">
              <h2>{t("common.categories")}</h2>
              {categoriesLoading ? (
                <CategorySkeleton />
              ) : categoriesError ? (
                <div className="search-results-status" role="alert">
                  <p>{categoriesError}</p>
                  <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                    {t("common.tryAgain")}
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <div className="search-results-empty">{t("search.noResults")}</div>
              ) : (
                <div className="search-category-grid">
                  {categories.map((category) => (
                    <article key={category.id} className="search-category-card">
                      <div className="app__hover" onMouseEnter={applyRandomCardHoverColor}>
                        <Link to={`/category/games/${category.id}`}>
                          <img src={category.box_art_url} alt={category.name} loading="lazy" decoding="async" />
                        </Link>
                      </div>
                      <Link to={`/category/games/${category.id}`}>{category.name}</Link>
                    </article>
                  ))}
                </div>
              )}

              {categoryCursor && !categoriesLoadMoreError && categories.length > 0 && (
                <div className="show-more-row">
                  <div className="show-more-divider" />
                  <button
                    type="button"
                    className="showMore"
                    disabled={categoriesLoadingMore}
                    onClick={loadMoreCategories}
                    aria-busy={categoriesLoadingMore}
                  >
                    {categoriesLoadingMore ? (
                      <span className="show-more-spinner" aria-hidden="true" />
                    ) : (
                      <span className="showMore__button">{t("common.showMore")}</span>
                    )}
                  </button>
                  <div className="show-more-divider" />
                </div>
              )}
              {categoriesLoadMoreError && (
                <div className="search-results-status" role="alert">
                  <p>{categoriesLoadMoreError}</p>
                  <button type="button" onClick={loadMoreCategories}>{t("common.retry")}</button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
