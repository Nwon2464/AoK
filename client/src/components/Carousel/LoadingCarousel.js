import React from "react";

const LoadingCarousel = (props) => {
    let data = new Array(5).fill(0);

    return (
        <>
            {data.map((e, index) => (
                <div key={index} style={props.imgStyle(index, true)} className="slide">
                    <div className="loading">
                    </div>
                </div>
            ))}
        </>
    );
};
export default LoadingCarousel;
