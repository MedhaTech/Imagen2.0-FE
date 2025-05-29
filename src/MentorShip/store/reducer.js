/* eslint-disable indent */
import {
    MENTORSHIP_LOGIN_USER,
    MENTORSHIP_LOGIN_USER_SUCCESS,
    MENTORSHIP_LOGIN_USER_ERROR
} from '../../redux/actions.js';
const INIT_STATE = {
    currentUser: {},
    loading: false,
    error: ''
};
export default (state = INIT_STATE, action) => {
    const newState = { ...state };
    switch (action.type) {
        case MENTORSHIP_LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case MENTORSHIP_LOGIN_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.payload,
                error: ''
            };
        case MENTORSHIP_LOGIN_USER_ERROR:
            return {
                ...state,
                loading: false,
                currentUser: null,
                error: action.payload.message
            };

        default:
            return newState;
    }
};
