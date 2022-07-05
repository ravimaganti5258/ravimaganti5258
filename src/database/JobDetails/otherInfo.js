import {databaseOptions} from '../index';
import Realm from 'realm';
import {JOB_DETAILS} from './schemas';

//insert other information in Realm
export const _storeLocalOtherInfo = (data) => {
  insertOtherInfoRealmObject(data);
};

export const insertOtherInfoRealmObject = (value) =>

  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS,value?.JobId);
       
          let data = JSON.parse(updatingObj?.CustomFields);
          data.push({ ...value, sync: false })
          updatingObj.CustomFields = JSON.stringify(data)
          
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

