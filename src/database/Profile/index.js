import {
    databaseOptions,
    insertNewRealmObject,
    queryAllRealmObject,
} from '../index';
import Realm from 'realm';
import { USER_PROFILE } from './schema';

export const updateProfileRealmObject = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(USER_PROFILE, '1');
                    updatingObj = JSON.stringify(value)

                    // updatingObj.CompanyId = parseInt(value?.CompanyId);
                    // updatingObj.DisplayName = value?.DisplayName;
                    // updatingObj.FirstName = value?.FirstName;
                    // updatingObj.LastName = value?.LastName;
                    // updatingObj.LoginId = parseInt(value?.LoginId);
                    // updatingObj.Phone1 = value?.Phone1;
                    // updatingObj.Phone2 = value?.Phone2;
                    // updatingObj.PhotoPath = value?.PhotoPath;
                    // updatingObj.ProfileImage = value?.Attachment;
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })

export const checkProfileExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                //update
                else {
                    updateProfileRealmObject(value)
                }
            })
            .catch((error) => reject(error));
    });

export const saveProfileInLocal = (data) => {
    let obj = {
        id: '1',
        CompanyId: data?.CompanyId,
        DisplayName: data?.DisplayName,
        FirstName: data?.FirstName,
        LastLogindatetime: data?.LastLogindatetime,
        LastName: data?.LastName,
        LoginId: data?.LoginId,
        Phone1: data?.Phone1,
        Phone2: data?.Phone2,
        PhotoPath: data?.PhotoPath,
        ProfileImage: data?.ProfileImage,
        dataSync: false,
        LastSync: new Date()
    };
    checkProfileExistOrNot(obj, USER_PROFILE);
};

export const getProfileFromLocal = async () => {
    const data = await queryAllRealmObject(USER_PROFILE).then((res) => {
        let profile = [];
        profile = res.map((obj) => {
            return obj;
        });
        return profile;
    });
    return data;
};
