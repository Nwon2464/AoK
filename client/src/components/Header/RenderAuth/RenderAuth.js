import React from "react";
import {connect} from "react-redux";
import Skeleton from "react-loading-skeleton";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";

import NavBar from "./NavBar/NavBar";
import NavItem from "./NavBar/NavItem";
import DropdownMenu from "./NavBar/DropdownMenu";
import { yetLoggedInContents,loggedInContents,languages } from "./NavBar/dropdownMenuContents";
import { jwtlogOut } from "../../../actions";
import LoginSignUpButton from "../LoginSignUpButton";

const RenderAuth = (props) => {
    const onSignOut = () => {
         props.jwtlogOut(); 
    };


    const renderContent=()=>{
        if(props.auth.jwtToken == null){
            return (
                <div>
                  <Skeleton height={30} width={30} />
                </div>
            );
        }else if(
            (props.auth.jwtToken && props.auth.jwtUsername)){
                return (
                    <NavBar>
                        <NavItem
                            loggedIcon={
                            <AccountCircleOutlinedIcon
                                style={{ width: "100%", height: "100%" }}

                                // className="header__icon"
                            />
                            }
                        >
                            <DropdownMenu
                                onSignOut={onSignOut}
                                allContents={loggedInContents}
                                languages={languages}
                                userEmail={(props.auth.jwtToken && props.auth.jwtUsername)}
                            ></DropdownMenu>
                        </NavItem>
                    </NavBar>
                )
        }else {
            return (
                <>
                  <LoginSignUpButton />
                  <NavBar>
                    <NavItem
                      notLoggedIcon={
                        <PersonOutlineIcon
                          style={{ width: "100%", height: "100%" }}
                          // className="header__icon"
                        />
                      }
                    >
                      <DropdownMenu
                        allContents={yetLoggedInContents}
                        languages={languages}
                      ></DropdownMenu>
                    </NavItem>
                  </NavBar>
                </>
              );
            // return <button><a href="/auth/google">Log in with Google</a></button>;
        }
    };
    return (
        <div className="app-flex app-align-items-center app-flex-grow-1 app-flex-shrink-1 app-justify-content-end app-full-width">
        {/* <div className="app-mg-x-05 app-flex-shrink-0 app-flex-grow-0 app-align-self-center app-flex-nowrap">
          <Link to="/streams/new">
            <VideoCallIcon
              // style={{ marginRight: "10px" }}
              className="header__icon"
            />
          </Link>
        </div> */}
        {/* <LoginSignUpButton /> */}
        <div className="app-mg-r-1 app-pd-y-1 app-flex app-full-height">
          <div className="app-flex app-flex-nowrap">{renderContent()}</div>{" "}
        </div> 
      </div>
    );
};
function mapStateToProps(state){
    return {
      auth:state.auth
    };
}
export default connect(mapStateToProps,{
    // logOutAuth,
    jwtlogOut,
})(RenderAuth);
