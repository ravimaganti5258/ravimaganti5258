import {databaseOptions} from '../index';
import Realm from 'realm';
import {JOB_DETAILS} from './schemas';

//insert signature and feedback  in Realm
export const _storeLocalCustomerFeedback = (data) => {
  insertGetCustomerFeedbackRealmObject(data);
  };

export const insertGetCustomerFeedbackRealmObject = (value) =>

  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS,value?.customerfeedBack?.WoJobId);
           let updatingObj2 = realm.objectForPrimaryKey(JOB_DETAILS,value?.customerfeedBack?.WoJobId);
          let data = JSON.parse(updatingObj?.GetCustomerFeedback);
          let data2 =JSON.parse(updatingObj?.GetWOJobSignature);
          data2={ ...value, sync: false }
          updatingObj2.GetWOJobSignature =JSON.stringify(data2);           
          data={...value?.customerfeedBack, sync: false};
          updatingObj.GetCustomerFeedback = JSON.stringify(data);
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

//update the task  based on TaskNo in realm
// export const _updateSignature = (value) => {
//   new Promise((resolve, reject) => {
//     Realm.open(databaseOptions)
//       .then((realm) => {
//         realm.write(() => {
//           let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS,value?.customerfeedBack?.WoJobId);
//           let data = JSON.parse(updatingObj?.GetCustomerFeedback);

          // const extistingTaskIndex = data.findIndex(
          //   (ele) =>
          //     ele.WOPunchPointsId === value?.WOPunchPointsId ||
          //     ele?.id == value?.id,
          // );
          // if (extistingTaskIndex !== -1) {
          //   data[extistingTaskIndex] = {...value, sync: false};
          //   updatingObj.WOJobDetail = JSON.stringify(data);
          // }
          // updatingObj.GetCustomerFeedback = JSON.stringify(data);
//           resolve();
//         });
//       })
//       .catch((error) => reject(error));
//   });
// };
