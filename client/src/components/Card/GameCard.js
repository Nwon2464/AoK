import React from "react";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useLanguage } from "../../i18n/LanguageProvider";
const GameCard = (props) => {
  const { t } = useLanguage();
  const scrollRef = React.useRef(null);
  const [scrollPosition, setScrollPosition] = React.useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollPosition = React.useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    setScrollPosition({
      canScrollLeft: element.scrollLeft > 1,
      canScrollRight:
        element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
  }, []);

  React.useEffect(() => {
    updateScrollPosition();
    window.addEventListener("resize", updateScrollPosition);

    return () => window.removeEventListener("resize", updateScrollPosition);
  }, [props.topGames.length, updateScrollPosition]);

  const handleScroll = () => {
    const element = scrollRef.current;

    updateScrollPosition();

    if (!element || !props.hasMore || props.loadingMore) {
      return;
    }

    const remainingScroll = element.scrollWidth - element.scrollLeft - element.clientWidth;
    if (remainingScroll < 240) {
      props.onLoadMore();
    }
  };

  const scrollCategories = (direction) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    if (direction === 1 && !scrollPosition.canScrollRight && props.hasMore) {
      props.onLoadMore();
      return;
    }

    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="game__category app-pd-15">
      <div className="card__maxWidth__margin app__tower__gutter">
        <h3 style={{ paddingBottom: "0.5rem" }}>
          <Link to="/category/all" style={{ fontSize: "1.5rem" }}>
            <strong
              style={{
                color: "#00b5ad",
                fontSize: "1.5rem",
                paddingLeft: "0.1rem",
              }}
            >
              {props.categories}
            </strong>
          </Link>{" "}
        </h3>
        <div className="category-scroll-shell">
          <button
            type="button"
            className="category-scroll-button category-scroll-button-left"
            aria-label={t("common.categories")}
            disabled={!scrollPosition.canScrollLeft}
            onClick={() => scrollCategories(-1)}
          >
            <ChevronLeftIcon />
          </button>
          <div
            ref={scrollRef}
            className="category-scroll-viewport app__relative"
            onScroll={handleScroll}
          >
            <div className="category-scroll-row">
            {props.topGames.map((e) => {
              return (
                <div
                  key={e.id}
                  className="category-scroll-item app__tower__padding__gutter"
                >
                  <div className="app__card__padding_bottom app__card__height">
                    <div className="app__relative">
                      <div className="app__flex__column app__flex app__flex__nowrap">
                        {/* <div> */}
                        <div
                          className="app__hover">
                          <Link
                            to={{
                              pathname: `/category/games/${e.id}`,
                              state: { data: e },
                            }}
                          >
                            <img
                              className="app__img__transition app__cursor"
                              src={e.box_art_url}
                              alt="GameImage"
                              loading="lazy"
                              decoding="async"
                            />
                          </Link>

                        </div>
                        {/* </div> */}

                        <div className="app__ellipsis app__margin__top app__flex__shrink__1 app__flex__grow__1 app__color app__font__weight app__cursor">
                          <Link
                            to={{
                              pathname: `/category/games/${e.id}`,
                              state: { data: e },
                            }}
                            className="app__font__size app__cursor"
                          >
                            {e.name}
                          </Link>
                        </div>
                        {Number.isFinite(e.gameViewers) && (
                          <p className="app__font__size">
                            <Link
                              to={{
                                pathname: `/category/games/${e.id}`,
                                state: { data: e },
                              }}
                              className="app__cursor"
                            >
                              {props.checkViewers(e.gameViewers)}
                            </Link>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {props.loadingMore && (
              <div className="category-scroll-status" role="status" aria-label={t("common.loading")}>
                <span className="category-scroll-spinner" aria-hidden="true" />
              </div>
            )}
            {props.loadMoreError && (
              <div className="category-scroll-status">
                <button type="button" onClick={props.onLoadMore}>{t("common.retry")}</button>
              </div>
            )}
            </div>
          </div>
          <button
            type="button"
            className="category-scroll-button category-scroll-button-right"
            aria-label={t("common.categories")}
            disabled={!scrollPosition.canScrollRight && (!props.hasMore || props.loadingMore)}
            onClick={() => scrollCategories(1)}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
