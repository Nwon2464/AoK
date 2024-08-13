import React from "react";
import Reuseable from "../ReuseableUI/Reuseable";
import Reuseable2 from "../ReuseableUI/Reuseable2";

const SlashIdVideoBody = (props) => {
    return (
        <div
        style={{
          backgroundColor: "#fff",
          width: "85%",
          // border: "5px inset #00b5ad",
        }}
        className="app-absolute"
      >
        
         {/* <div
          className="app-mg-x-2"
          style={{
            height: "30%",
            paddingTop: "1.5rem",
            position: "sticky",
            zIndex: 2,
          }}
        >
          <div className="app-flex">
            <Reuseable
              {...props}
              totalViews={1}
              totalFollowers={1}
            />
          </div>
        </div> */}
        <div style={{ width: "100%", background: "#fff" }}>
          <Reuseable2
            streams={props.streams}
            {...props}
            // user={props.location.state.data}
          />
        </div>
        <div></div> 
      </div>

    );    
};

export default SlashIdVideoBody;
