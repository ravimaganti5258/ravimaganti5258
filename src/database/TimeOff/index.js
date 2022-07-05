import Realm from 'realm';
import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from "..";
import { TIME_OFF_HISTORY } from "./schema";

// insert time off history from api
export const saveTimeOffInLocal = (list) => {
    list?.map((item, index) => {
        if(Object.keys(item).length > 0 ){
        let data = {
            id: item?.TechOffTimeQueueId,
            TechOffTimeQueueId: item?.TechOffTimeQueueId,
            LeaveType: item?.LeaveType,
            Days: item?.Days,
            Hours: item?.Hours,
            StartTime: item?.StartTime,
            EndTime: item?.EndTime,
            Reason: item?.Reason,
            ReasonId: item?.ReasonId,
            Status: item?.Status,
            StatusId: item?.StatusId,
            AppliedOn: item?.AppliedOn,
            RejectedBy: item?.RejectedBy,
            RejectedDate: item?.RejectedDate,
            ApprovedBy: item?.ApprovedBy,
            ApprovedOn: item?.ApprovedOn,
            ApprovedRemarks: item?.ApprovedRemarks,
            RejectedRemarks: item?.RejectedRemarks,
            StatusId: item?.StatusId,
            LastSycnDate: new Date(),
            Sync: false

        };
        checkTimeOffExistOrNot(data, TIME_OFF_HISTORY)
    }
    });

}

export const checkTimeOffExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value?.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                //update
                else {
                    updateTimeOffObjFromApi(value)

                }
                resolve()
            })
            .catch((error) => reject(error))
    });

//update data when comming from api 
export const updateTimeOffObjFromApi = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(TIME_OFF_HISTORY, value?.TechOffTimeQueueId);
                    // updatingObj = value
                    resolve()
                })
            }).catch((error) => { reject(error), console.log('errr', { error }) })
    })
}

export const fetchTimeOffListLocal = async (callBack) => {
    const data = await queryAllRealmObject(TIME_OFF_HISTORY).then((res) => {
        let timeofflist = res.map((obj) => {
            return obj;
        });
        return timeofflist;
    });

    callBack && callBack(data)
    console.log({ data }, "timeoff local ")

    return data;
}
