import React, { useEffect, useState } from "react";
import BodyLeft from "../Body/BodyLeft";
import axios from "axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { checkViewers } from "../Body/checkViewers";
import SlashCategoryAllLoading from "./slashCategory/SlashCategoryAllLoading";

const SlashCategoryAll = (props) => {

  const [streams, setStreams] = useState([]);
  const [paginationValue, setPaginationValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAllVideos();
  }, []);
  const fetchAllVideos = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/categories/all`,
        {
          params: {
            cursor: paginationValue,
          },
        }
      );
      if (!data) {
        throw new Error("Failed to fetch posts");
      }
      
      let streams = data;
      setStreams((streams));
    } catch (err) {
    } finally {
    }
  };


  return (
    <>
      <div className="app-flex app-flex-nowrap app-relative app-full-height">
        <div className="side-nav app-flex-shrink-0 app-full-height app-z-above">
          <BodyLeft />
        </div>
        <div className="app-flex app-flex-column app-full-width ">
          <div className="app-full-width app-relative">
            <div className="app-page-wrapper app-flex app-flex-column">
              <div className="app-mg-l-13 app-mg-t-1">
                <h1
                  style={{
                    marginLeft: 2,
                  }}
                  className="app-font-size-40"
                >
                  Browse
                </h1>
              </div>
              <div className="app-pd-t-1 app-pd-x-17">
                <div className="app-flex app-full-width app-relative app-height-15">
                  <div className="app-flex app-flex-column app-full-height">
                    <div className="app-align-self-center app-flex app-full-height app-justify-content-center app-align-items-center">
                      <Link to="/">
                        <h3 className="app-flex app-flex-column app-font-size-9 app-cursor-pointer">
                          Categories
                        </h3>
                      </Link>
                    </div>
                    <div
                      style={{ marginTop: 13 }}
                      className="navigation-link-indicator-container"
                    >
                      <div className="navigation-link-active-indicator"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="app-pd-t-1 app-pd-x-14">
                <div className="app-flex app-flex-wrap app-min-width">
                  {streams.length === 0  ? (
                    <SlashCategoryAllLoading    />
                  ) : (
                    streams.map((e, i) => {
                      return (
                        <div
                          key={i}
                          style={{ width: "15rem" }}
                          className="app-flex app-max-width-5 app-flex-gutter-03 app-flex-grow-1"
                        >
                          <div className="app-relative app-mg-b-1">
                            <div>
                              <div className="app-pd-b-1 app-flex app-flex-column">
                                <div className="app-flex-order-1 app-relative">
                                  <div className="app-flex app-flex-column app-flex-nowrap">
                                    <Link
                                      to={{
                                        pathname: `/category/games/${e.name
                                          .split(" ")
                                          .join("")}`,
                                        state: { data: e },
                                      }}
                                    >
                                      <img
                                        src={
                                          e.box_art_url
                                          // .replace("188", "285")
                                          // .replace("250", "385")
                                        }
                                      />
                                    </Link>
                                    <div className="app-relative">
                                      <Link
                                        to={{
                                          pathname: `/category/games/${e.name
                                            .split(" ")
                                            .join("")}`,
                                          state: { data: e },
                                        }}
                                      >
                                        <h3 className="app-font-size-7 app-cursor-pointer">
                                          {e.name}
                                        </h3>
                                      </Link>
                                      <p className="app-ellipsis">
                                        <Link
                                          to={{
                                            pathname: `/category/games/${e.name
                                              .split(" ")
                                              .join("")}`,
                                            state: {
                                              data: e,
                                            },
                                          }}
                                        >
                                          {checkViewers(e.gameViewers)}{" "}
                                        </Link>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="app-flex-order-2 app-relative">
                                tags
                              </div> */}
                              </div>
                            </div>{" "}
                          </div>{" "}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    twitch: state.twitch.activeCategoryGames,
  };
};
export default connect(mapStateToProps)(SlashCategoryAll);
