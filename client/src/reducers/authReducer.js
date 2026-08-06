import { JWT_AUTH } from "../actions/types";

const INITIAL_STATE = {
    jwtToken: null,
    jwtUsername: null,
};
const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case JWT_AUTH:
            return {
                jwtToken: Boolean(action.payload),
                jwtUsername: action.payload || false,
            };
        default:
        return state;
    }
};

export default authReducer;
