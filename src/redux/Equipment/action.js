import {EQUIPMENT_ATTACHMET_SUCCESS} from './type';

export const saveEquimentattchment = (data) => {
  return {
    type: EQUIPMENT_ATTACHMET_SUCCESS,
    payload: data,
  };
};
