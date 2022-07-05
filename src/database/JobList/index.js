import {
  databaseOptions,
  insertNewRealmObject,
  queryAllRealmObject,
} from '../index';
import Realm from 'realm';
import { JOB_LIST } from './schema';




// export const updateJobListRealmObject = (value) =>{
//   // value.map((item) => {
//     new Promise((resolve, reject) => {
//       Realm.open(databaseOptions)
//         .then((realm) => {
//           realm.write(() => {
//             let updatingObj = realm.objectForPrimaryKey(JOB_LIST, value?.jobno);
//             updatingObj = item;
//             resolve();
//           });
//         })
//         .catch((error) => reject(error));
//     });
//   // })
// }
export const updateJobListRealmObject = (value) => {
  new Promise((resolve, reject) => {
      Realm.open(databaseOptions)
          .then((realm) => {
              realm.write(() => {
                  let updatingObj = realm.objectForPrimaryKey(JOB_LIST, value?.jobno);
                  // updatingObj = value
                  resolve()
              })
          }).catch((error) => { reject(error), console.log('errr', { error }) })
  })
}
// export const fetchJobListStatus = (data, id, callback) => {
//   data().then((res) => {
//     res.map((item) => {
//       if (
//         JSON.parse(item?.TechnicianJobInformation)?.WoJobId ===
//         id
//       ) {
//         const obj = {
//           jobstatus: id,
//         };
//         callback(obj)
//       }
//     });
//   });
// }

export const checkExistOrNot = (value, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let existObj = realm.objectForPrimaryKey(realmObj, value.id);
        if (existObj === undefined) {
          insertNewRealmObject(value, realmObj);
        }
        else {
          updateJobListRealmObject(value)
      }
      resolve()
  })
      .catch((error) => reject(error));
  });

export const storeJobListInLocal = (Data) => {
  Data?.map((item, index) => {
    let data = {
      id: item?.jobno,
      ...item,
    };
    checkExistOrNot(data, JOB_LIST);
  });
};

export const getJobListFromLocal = async () => {
  const data = await queryAllRealmObject(JOB_LIST).then((res) => {
    let joblist = [];
    joblist = res.map((obj) => {
      return obj;
    });
    return joblist;
  });
  return data;
};

//Joblist -job status upfate 
export const updateStatusJobListRealmObject = async (value, lable) =>

  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {

          if (lable == 'AcceptReject') {
            let updatingObj = realm.objectForPrimaryKey(JOB_LIST, value?.WoJobId);
            updatingObj.AcceptanceStatusId = value.AcceptanceStatusId
          } else {
            let updatingObj = realm.objectForPrimaryKey(JOB_LIST, value?.jobid);
            updatingObj.JobStatusid = value.jobstatus,
              updatingObj.jobstatus = value?.JOBSTATUS
          }
          resolve();
        });
      })
      .catch((error) => reject(error));
  });


