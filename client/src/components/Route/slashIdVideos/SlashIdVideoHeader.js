import React from "react";
import { Link } from "react-router-dom";

const SlashIdVideoHeader = (props) => {
    return (
    <>
        <div style={{ minHeight: "28.5rem", maxHeight: "100%", width: "100%" }}>
        {" "}
        <div className="app-full-height app-full-width app-relative">
            <div
            className="app-absolute"
            style={{
                zIndex: 2,
                // background: "red",
                width: "26rem",
                minHeight: "20rem",
                height: "80%",
            }}
            >
            <div
                style={{
                background: "white",
                marginLeft: "2rem",
                height: "85%",
                marginTop: "5rem",
                }}
            >
                <div
                className="app-flex app-flex-column app-full-height app-justify-content-center"
                style={{ marginTop: "4rem", padding: "2rem" }}
                >
                <div className="app-inline-block">
                    <div
                    style={{ padding: "0.2rem 0.5rem" }}
                    className="app-inline-block app-uppercase app-live-indicator app-font-weight app-border-radius"
                    >
                    {props.location.state.data.type} NOW
                    </div>
                </div>
                <div className="app-inline-block">
                    <h2>
                    {props.location.state.data.user_name} is streaming{" "}
                    {props.location.state.data.game_name}
                    </h2>
                </div>
                <div className="app-inline-block" style={{ marginTop: "0.5rem" }}>
                    <Link
                    className="app-color-main app-font-size-5"
                    to={{
                        // pathname: `/${props.match.params.id}`,
                        // state: { data: props.location.state.data },
                    }}
                    >
                    Watch now with{" "}
                    {checkViewers(props.location.state.data.viewer_count)}
                    </Link>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>    
    </>          
    );

};
export default SlashIdVideoHeader;


const checkViewers = (views) => {
    if (views <= 999) {
      return <>{`${views} Viewers`}</>;
    } else if (views < 999999) {
      return (
        <>{`${
          Math.sign(views) * (Math.abs(views) / 1000).toFixed(1)
        }K Viewers`}</>
      );
    } else if (views <= 9999999) {
      return (
        <>{`${
          Math.sign(views) * (Math.abs(views) / 1000000).toFixed(1)
        }M Viewers`}</>
      );
    }
  };
  