import { CHANGE_APP_THEME } from "./types";

export const changeAppTheme = (themeMode) => {
    return {
        type: CHANGE_APP_THEME,
        payload: themeMode,
    };
};