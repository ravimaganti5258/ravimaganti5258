import {
    DASHBOARD_API_SUCCESS,
    DASHBOARD_API_FAILURE,
} from './types';

export const saveDashboardApiData = (data) => {
    return {
        type: DASHBOARD_API_SUCCESS,
        payload: data,
    };
};