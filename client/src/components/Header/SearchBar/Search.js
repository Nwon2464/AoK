import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import { Link, useHistory, useLocation } from "react-router-dom";

import { searchCategoriesPage, searchChannelsPage } from "../../../services/twitchService";
import SearchBar from "./SearchBar";
import "./Search.css";
import { useLanguage } from "../../../i18n/LanguageProvider";

const MINIMUM_QUERY_LENGTH = 2;

const Search = () => {
  const { t } = useLanguage();
  const history = useHistory();
  const location = useLocation();
  const searchRootRef = useRef(null);
  const locationQuery = new URLSearchParams(location.search).get("q") || "";
  const [term, setTerm] = useState(location.pathname === "/search" ? locationQuery : "");
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const query = term.trim();

  useEffect(() => {
    if (location.pathname === "/search") {
      setTerm(locationQuery);
    }
  }, [location.pathname, locationQuery]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchRootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let debounceTimer;

    if (query.length < MINIMUM_QUERY_LENGTH) {
      setChannels([]);
      setCategories([]);
      setLoading(false);
      setError(null);
      return undefined;
    }

    debounceTimer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const [channelResult, categoryResult] = await Promise.allSettled([
        searchChannelsPage(query, undefined, 5),
        searchCategoriesPage(query, undefined, 5),
      ]);

      if (cancelled) return;

      setChannels(channelResult.status === "fulfilled" ? channelResult.value.channels : []);
      setCategories(categoryResult.status === "fulfilled" ? categoryResult.value.categories : []);
      setError(
        channelResult.status === "rejected" && categoryResult.status === "rejected"
          ? "Unable to search Twitch right now."
          : null
      );
      setLoading(false);
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(debounceTimer);
    };
  }, [query]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query) return;

    setOpen(false);
    history.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const showSuggestions = open && query.length >= MINIMUM_QUERY_LENGTH;

  return (
    <div className="app-flex app-flex-grow-1 app-flex-shrink-1 app-full-width app-justify-content-center app-align-items-center">
      <div className="app-top-nav-search-container app-mg-x-2">
        <div className="app-top-nav-search-max-width">
          <div ref={searchRootRef} className="app-pd-05 search-root">
            <form className="app-flex app-full-width" onSubmit={submitSearch}>
              <div className="app-flex-grow-1" style={{ marginRight: 1 }}>
                <div className="app-relative">
                  <SearchBar
                    placeholder={t("search.placeholder")}
                    term={term}
                    expanded={showSuggestions}
                    onChange={(event) => {
                      setTerm(event.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                  />
                </div>
              </div>
              <button
                type="submit"
                aria-label={t("search.placeholder")}
                className="app-search-bk app-border-top-right-radius-large app-border-top-left-radius-none app-border-bottom-left-radius-none app-border-bottom-right-radius-large app-button-y app-inline-flex app-justify-content app-align-items-center app-relative app-core-button app-cursor-pointer app-input-find-button"
              >
                <div className="app-justify-content-center app-core-button-icon app-inline-flex app-align-items-center">
                  <SearchIcon className="app-core-icon-color" />
                </div>
              </button>
            </form>

            {showSuggestions && (
              <div id="search-suggestions" className="search-suggestions" role="listbox">
                {loading ? (
                  <div className="search-suggestion-status" role="status" aria-label={t("common.loading")}>
                    <span className="search-suggestion-spinner" aria-hidden="true" />
                  </div>
                ) : error ? (
                  <div className="search-suggestion-status" role="alert">{error}</div>
                ) : channels.length === 0 && categories.length === 0 ? (
                  <div className="search-suggestion-status">{t("search.noResults")}</div>
                ) : (
                  <>
                    {channels.length > 0 && (
                      <section>
                        <h4>{t("common.channels")}</h4>
                        {channels.map((channel) => (
                          <Link
                            key={channel.id}
                            to={`/${channel.login}`}
                            className="search-suggestion-item"
                            onClick={() => setOpen(false)}
                          >
                            <img src={channel.thumbnailUrl} alt="" />
                            <span className="search-suggestion-copy">
                              <strong>{channel.displayName}</strong>
                              <small>{channel.game?.name || t("common.offline")}</small>
                            </span>
                            {channel.isLive && <span className="search-live-badge">LIVE</span>}
                          </Link>
                        ))}
                      </section>
                    )}

                    {categories.length > 0 && (
                      <section>
                        <h4>{t("common.categories")}</h4>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/category/games/${category.id}`}
                            className="search-suggestion-item"
                            onClick={() => setOpen(false)}
                          >
                            <img className="search-category-thumbnail" src={category.box_art_url} alt="" />
                            <span className="search-suggestion-copy">
                              <strong>{category.name}</strong>
                              <small>{t("common.categories")}</small>
                            </span>
                          </Link>
                        ))}
                      </section>
                    )}
                  </>
                )}

                <button type="button" className="search-all-results" onClick={submitSearch}>
                  {t("search.seeAll", { query })}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
