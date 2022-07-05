import Realm from 'realm';
import { DASHBOARD_DATA } from './schemas';
import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from '../index';

//Update  data from realm  based on id
export const updateDashboardRealmObject = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(DASHBOARD_DATA, '1');
                    updatingObj.AmountCollectedJob = value?.AmountCollectedJob;
                    updatingObj.InProgressJobs = value?.InProgressJobs;
                    updatingObj.OverdueJobs = value?.OverdueJobs;
                    updatingObj.Todayjobs = value?.Todayjobs;
                    updatingObj.TotalPartRequestJobs = value?.TotalPartRequestJobs;
                    updatingObj.TotalAmounttobepaidjobs = value?.TotalAmounttobepaidjobs;
                    updatingObj.UpcommingJobs = value?.UpcommingJobs;
                    updatingObj.WaitingAllocationJobs = value?.WaitingAllocationJobs;
                    updatingObj.WaitingforSubmissionJobs = value?.WaitingforSubmissionJobs;
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });

export const checkDashboardDataExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                //update
            })
            .catch((error) => reject(error));
    });

export const saveDashboardDataInLocal = (data) => {
    let obj = {
        id: '1',
        AmountCollectedJob: data?.AmountCollectedJob,
        InProgressJobs: data?.InProgressJobs,
        OverdueJobs: data?.OverdueJobs,
        Todayjobs: data?.Todayjobs,
        TotalAmounttobepaidjobs: data?.TotalAmounttobepaidjobs,
        TotalPartRequestJobs: data?.TotalPartRequestJobs,
        UpcommingJobs: data?.UpcommingJobs,
        WaitingAllocationJobs: data?.WaitingAllocationJobs,
        WaitingforSubmissionJobs: data?.WaitingforSubmissionJobs,
    };
    checkDashboardDataExistOrNot(obj, DASHBOARD_DATA);
};

export const fetchDashboardData = async () => {
    const data = await queryAllRealmObject(DASHBOARD_DATA).then((res) => {
        let dashboard = [];
        dashboard = res.map((obj) => {
            return obj;
        });
        return dashboard;
    });
    return data;
}
