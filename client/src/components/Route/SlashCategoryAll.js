import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getCategoriesPage } from "../../services/twitchService";
import BodyLeft from "../Body/BodyLeft";
import { applyRandomCardHoverColor } from "../Card/videoThumbnailHover";
import SlashCategoryAllLoading from "./slashCategory/SlashCategoryAllLoading";
import "./slashCategory/SlashCategoryAll.css";
import { useLanguage } from "../../i18n/LanguageProvider";

const appendUniqueGames = (currentGames, nextGames) => {
  const gameMap = new Map(
    [...currentGames, ...nextGames].map((game) => [game.id, game])
  );
  return [...gameMap.values()];
};

const getErrorMessage = (error, fallback) => error.response?.data?.message || fallback;

const getBrowsePageLimit = () => {
  const sidebarWidth = 240;
  const horizontalPadding = 44.8;
  const minimumCardWidth = 192;
  const columnGap = 10.4;
  const headerAndBrowseControlsHeight = 240;
  const cardTextAndRowGap = 52;
  const contentWidth = Math.max(
    minimumCardWidth,
    window.innerWidth - sidebarWidth - horizontalPadding
  );
  const columns = Math.max(
    1,
    Math.floor((contentWidth + columnGap) / (minimumCardWidth + columnGap))
  );
  const cardWidth = (contentWidth - columnGap * (columns - 1)) / columns;
  const rowHeight = cardWidth * (385 / 285) + cardTextAndRowGap;
  const availableHeight = Math.max(rowHeight, window.innerHeight - headerAndBrowseControlsHeight);
  const rows = Math.max(1, Math.ceil(availableHeight / rowHeight));

  return Math.min(100, Math.max(15, columns * rows));
};

const SlashCategoryAll = () => {
  const { t } = useLanguage();
  const [pageLimit, setPageLimit] = useState(getBrowsePageLimit);
  const [games, setGames] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(null);

  useEffect(() => {
    let resizeTimer;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setPageLimit(getBrowsePageLimit());
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setGames([]);
    setNextCursor(null);
    setLoading(true);
    setError(null);

    getCategoriesPage(undefined, pageLimit)
      .then((page) => {
        if (cancelled) return;
        setGames(page.games);
        setNextCursor(page.nextCursor);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(getErrorMessage(requestError, "Unable to load categories."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pageLimit, reloadKey]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const page = await getCategoriesPage(nextCursor, pageLimit);
      setGames((currentGames) => appendUniqueGames(currentGames, page.games));
      setNextCursor(page.nextCursor);
    } catch (requestError) {
      setLoadMoreError(getErrorMessage(requestError, "Unable to load more categories."));
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, nextCursor, pageLimit]);

  return (
    <div className="app-flex app-flex-nowrap app-relative app-full-height app-overflow-hidden">
      <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
        <BodyLeft />
      </div>
      <main className="browse-page app-flex app-flex-column app-full-width app-overflow-scroll">
        <div className="app-page-wrapper app-flex app-flex-column app-bk-color-1 app-full-width">
          <div className="app-mg-l-13 app-mg-t-1">
            <h1 className="app-font-size-40">{t("browse.title")}</h1>
          </div>
          <div className="app-pd-t-1 app-pd-x-17">
            <div className="app-flex app-full-width app-relative app-height-15">
              <div className="app-flex app-flex-column app-full-height">
                <div className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center">
                  <h3 className="app-flex app-flex-column app-font-size-9">{t("common.categories")}</h3>
                </div>
                <div className="navigation-link-indicator-container browse-tab-indicator">
                  <div className="navigation-link-active-indicator" />
                </div>
              </div>
            </div>
          </div>

          <div className="app-pd-t-1 app-pd-x-14">
            {loading ? (
              <SlashCategoryAllLoading count={pageLimit} />
            ) : error ? (
              <div className="browse-status" role="alert">
                <p>{error}</p>
                <button type="button" onClick={() => setReloadKey((value) => value + 1)}>
                  {t("common.tryAgain")}
                </button>
              </div>
            ) : games.length === 0 ? (
              <div className="browse-status">{t("browse.noCategories")}</div>
            ) : (
              <div className="browse-grid">
                {games.map((game) => (
                  <article key={game.id} className="browse-card">
                    <div className="app__hover" onMouseEnter={applyRandomCardHoverColor}>
                      <Link to={`/category/games/${game.id}`}>
                        <img
                          src={game.box_art_url}
                          alt={game.name}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                    </div>
                    <Link to={`/category/games/${game.id}`}>
                      <h3 className="app-font-size-7 app-cursor-pointer">{game.name}</h3>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {nextCursor && !loadMoreError && games.length > 0 && (
            <div className="show-more-row">
              <div className="show-more-divider" />
              <button
                type="button"
                className="showMore"
                disabled={loadingMore}
                onClick={loadMore}
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
            <div className="browse-status" role="alert">
              <p>{loadMoreError}</p>
              <button type="button" onClick={loadMore}>{t("common.retry")}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SlashCategoryAll;
