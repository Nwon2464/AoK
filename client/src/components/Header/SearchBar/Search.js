import React from "react";
import SearchIcon from "@material-ui/icons/Search";

import SearchBar from "./SearchBar";

const Search = (props) => {
    return (
        <div className="app-flex app-flex-grow-1 app-flex-shrink-1 app-full-width app-justify-content-center app-align-items-center">
        <div className="app-top-nav-search-container app-mg-x-2">
          <div className="app-top-nav-search-max-width">
            <div className="app-pd-05">
              <div className="app-flex app-full-width">
                <div className="app-flex-grow-1" style={{ marginRight: 1 }}>
                  <div className="app-relative">
                    <SearchBar onSubmitForm={props.onSubmitForm} />
                  </div>
                </div>
                <button className="app-border-top-right-radius-large app-border-top-left-radius-none app-border-bottom-left-radius-none app-border-bottom-right-radius-large app-button-y app-inline-flex app-justify-content app-align-items-center app-relative app-core-button app-cursor-pointer app-input-find-button">
                  <div className="app-justify-content-center app-core-button-icon app-inline-flex app-align-items-center">
                    <SearchIcon className="app-core-icon-color" />
                  </div>{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Search;