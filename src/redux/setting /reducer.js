
import { CHANGE_APP_THEME } from './types';

const initialState = {

    theme: { mode: 'Blue' },


};

export const SettingReducer = (state = initialState, action) => {
    switch (action.type) {

        case CHANGE_APP_THEME: {
            return {
                ...state,
                theme: { mode: action?.payload },
            };
        }




        default: {
            return state;
        }
    }
};
