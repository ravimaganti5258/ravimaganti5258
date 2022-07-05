import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from '../JobDetails/schemas';


//insert new form  in Realm
export const _storeLocalAddFormObj = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.GetWOJobChecklist)
                    data.push({ ...value, sync: false, FormId: data.length + 1})
                    updatingObj.GetWOJobChecklist = JSON.stringify(data)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });
}

//delete form based on WoJobChklistId in realm
export const _deleteFormLocally = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.GetWOJobChecklist)
                    let newList = data.filter(item => item.WoJobChklistId != value?.WoJobChklistId || item?.FormId != value?.FormId);
                    updatingObj.GetWOJobChecklist = JSON.stringify(newList)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}

