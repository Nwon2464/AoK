import React from "react";
import "./BodyRight.css";
import { connect } from "react-redux";

import VideoCard from "../Card/VideoCard";
import Carousel from "../Carousel/Carousel";
import GameCard from "../Card/GameCard";
import { checkViewers, checkTags } from "./checkViewers";
import Loading from "../Card/Loading";
import LoadingGameCard from "../Card/LoadingGameCard";
import {
  fetchHomeTwitch,
  fetchMoreCategoryStreams,
  fetchMoreTopGames,
  showMoreLiveChannels,
} from "../../actions";
import { useLanguage } from "../../i18n/LanguageProvider";

const BodyRight = (props) => {
  const { t } = useLanguage();
  const { twitch } = props;
  const visiblePopularCategories = twitch.popularCategories.filter(
    ({ streams, nextCursor }) => streams.length > 0 || nextCursor
  );
  const isFeedLoading = twitch.liveChannelsLoadingMore
    && twitch.liveChannelsLoadingConsumer === "feed";

  if (twitch.homeError) {
    return (
      <div className="app-overflow-scroll app-body-right-background app-flex app-flex-column app-flex-grow-1 app-full-height app-full-width">
        <div className="home-status" role="alert">
          <h2>{t("home.loadFailed")}</h2>
          <p>{twitch.homeError}</p>
          <button type="button" onClick={props.fetchHomeTwitch}>{t("common.tryAgain")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-overflow-scroll app-body-right-background app-z-index-default app-flex app-flex-column app-flex-grow-1 app-full-height app-full-width">
      <div className="app-full-width app-relative">
        <Carousel />

        {twitch.homePartial && (
          <div className="home-partial-status" role="status">
            {t("home.partial")}
          </div>
        )}

        {twitch.homeLoading ? (
          <Loading />
        ) : twitch.activeLiveTwitch.length > 0 ? (
          <VideoCard
            categories={t("home.liveChannels")}
            videos={twitch.activeLiveTwitch}
            visible={twitch.feedVisibleCount}
            checkTags={checkTags}
            checkViewers={(views) => checkViewers(views, t("common.viewers"))}
            hasMore={Boolean(twitch.liveChannelsNextCursor)}
            loadingMore={isFeedLoading}
            showMoreDisabled={twitch.liveChannelsLoadingMore}
            loadMoreError={twitch.liveChannelsErrorConsumer === "feed"
              ? twitch.liveChannelsLoadMoreError
              : null}
            onShowMore={() => props.showMoreLiveChannels("feed")}
          />
        ) : null}
        {twitch.homeLoading ? (
          <LoadingGameCard />
        ) : twitch.activeCategoryGames.length > 0 ? (

          <GameCard
            topGames={twitch.activeCategoryGames}
            checkViewers={(views) => checkViewers(views, t("common.viewers"))}
            categories={t("common.categories")}
            hasMore={Boolean(twitch.topGamesNextCursor)}
            loadingMore={twitch.topGamesLoadingMore}
            loadMoreError={twitch.topGamesLoadMoreError}
            onLoadMore={props.fetchMoreTopGames}
          />
        ) : (
          <div className="home-empty-status">{t("home.noCategories")}</div>
        )}
        {twitch.homeLoading ? Array.from({ length: 4 }).map((_, index) => (
          <Loading key={index} />
        )) : visiblePopularCategories.map(({
          game,
          streams,
          nextCursor,
          loadingMore,
          loadMoreError,
        }) => (
          <VideoCard
            key={game.id}
            recommend="recommend"
            categories={game.name}
            categoryId={game.id}
            checkViewers={(views) => checkViewers(views, t("common.viewers"))}
            videos={streams}
            visible={streams.length}
            checkTags={checkTags}
            hasMore={Boolean(nextCursor)}
            loadingMore={loadingMore}
            loadMoreError={loadMoreError}
            onShowMore={() => props.fetchMoreCategoryStreams(game.id)}
          />
        ))}
        {!twitch.homeLoading && visiblePopularCategories.length === 0 && (
          <div className="home-empty-status">{t("home.noRecommendations")}</div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    twitch: state.twitch,
  };
};
export default connect(mapStateToProps, {
  fetchHomeTwitch,
  fetchMoreCategoryStreams,
  fetchMoreTopGames,
  showMoreLiveChannels,
})(BodyRight);
