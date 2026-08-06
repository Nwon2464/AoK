import React from "react";

const SearchBar = ({ expanded, onChange, onFocus, placeholder, term }) => (
  <input
    id="app-input-search"
    className="app-input--large app-block app-input app-full-width app-border-bottom-right-radius-none app-border-top-right-radius-none app-border-top-left-radius-large app-border-bottom-left-radius-large app-pd-r-1 app-pd-l-1 app-pd-y-05"
    onChange={onChange}
    onFocus={onFocus}
    placeholder={placeholder}
    type="search"
    value={term}
    autoComplete="off"
    aria-autocomplete="list"
    aria-controls="search-suggestions"
    aria-expanded={expanded}
  />
);

export default SearchBar;
