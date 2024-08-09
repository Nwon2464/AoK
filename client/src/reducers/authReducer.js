import { FETCH_AUTH, JWT_AUTH, LOGOUT_AUTH , JWT_AUTH_LOGOUT} from "../actions/types";

//removed google oauth
const INITIAL_STATE = {
    // googleAuthIsSignedIn: null,
    jwtToken: null,
    jwtUsername: null,
};
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        // case FETCH_AUTH:
        //     return {
        //         ...state,
        //         googleAuthIsSignedIn: action.payload || false,
        //         jwtToken: false,
        //         jwtUsername: false,
        //     };
        case JWT_AUTH:
            return {
                // googleAuthIsSignedIn: false,
                jwtToken: true,
                jwtUsername: action.payload || false,
            };
        // case JWT_AUTH_LOGOUT:
        //     return {
        //         jwtToken: false,
        //         jwtUsername: false, 
        //     };
        // case LOGOUT_AUTH:
        //     return { ...state, googleAuthIsSignedIn: false };
        default:
        return state;
    }
};
