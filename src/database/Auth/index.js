import { insertNewRealmObject } from '..';
import { USER, USERINFO, CHECK_IN } from './schema';

export const storeUserInfo = (AuthDatail) => {
  let userInfoObj = {
    id: 1,
    ...AuthDatail.userInfo,
  };
  insertNewRealmObject(userInfoObj, USERINFO).then((res) => { });
};

export const storeLoginData = (AuthDatail) => {
  let obj = {
    id: 1,
    userName: AuthDatail?.userCredentials?.userName,
    password: AuthDatail?.userCredentials?.password,
    ...AuthDatail?.tokenDetails,
  };
  insertNewRealmObject(obj, USER).then((res) => console.log('On Dashboard: ', { res }));
};

export const checkInData = (data) => {
  let checkInData = {
    id: data?.id,
    checkInLabel: data?.checkInLabel,
    currentTime: data?.currentTime,
  }
  insertNewRealmObject(checkInData, CHECK_IN).then((res) => { });
};