import React from 'react'
import SlashIdFrameLoading from "../ReusableUI/SlashIdFrameLoading";
const SlashIdHeader = (props) => {
    return (
        <>
            {props.len != 0 ?
                <div style={{ lineHeight: "0" }}>
                    <iframe
                        style={{ height: "40rem", width: "100%" }}
                        src={`https://player.twitch.tv/?channel=${props.username.pathname.slice(1)}&muted=true&parent=client-xi-eight-67.vercel.app&parent=client-xi-eight-67-vercel-app`}
                        frameBorder="0"
                        scrolling="<scrolling>"
                        allowFullScreen
                    ></iframe>
                </div>
                : <SlashIdFrameLoading />}
            {/* <div style={{ minHeight: 1500 }}>Bottom</div> */}
        </>
    );
};
export default SlashIdHeader;
