import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from '../JobDetails/schemas';


//add new apply timeoff in Realm
export const _storeLocalApplyTimeOffObj = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(USER_PROFILE, '1');
                    // let data = JSON.parse(updatingObj?.GetPriceDetailsEntity)
                    // data.push({ ...value, sync: false, PriceId: data.length + 1})
                    // updatingObj.GetPriceDetailsEntity = JSON.stringify(data)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });


//delete price detail based on WoJobPriceId in realm
// export const _deletePriceLocally = (value, callback) => {
//     new Promise((resolve, reject) => {
//         Realm.open(databaseOptions)
//             .then((realm) => {
//                 realm.write(() => {
//                     let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
//                     let data = JSON.parse(updatingObj?.GetPriceDetailsEntity)
//                     let newList = data.filter(item => item?.WoJobPriceId != value?.WoJobPriceId || item?.PriceId != value?.PriceId);
//                     updatingObj.GetPriceDetailsEntity = JSON.stringify(newList)
//                     resolve();
//                     callback()
//                 });
//             })
//             .catch((error) => reject(error));
//     })
// }
