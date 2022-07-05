import {
    DASHBOARD_API_SUCCESS,
    DASHBOARD_API_FAILURE,
} from './types';

const initialState = {
    data: {},
    isLoading: true,
};

export const dashboardApiReducer = (state = initialState, action) => {
    switch (action.type) {
        case DASHBOARD_API_SUCCESS: {
            return {
                isLoading: false,
                data: action?.payload,
            };
        }
        case DASHBOARD_API_FAILURE: {
            return {
                ...state,
                isLoading: false,
            };
        }
        default: {
            return state;
        }
    }
};
