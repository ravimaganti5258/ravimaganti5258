import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from './schemas';


//update new object add task in WOJobDetail 
export const insertTaskInRealmObject = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.WOJobDetails)
                    data.push({ ...value, TaskNo: data.length + 1, sync: false })
                    updatingObj.WOJobDetails = JSON.stringify(data)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });
//insert new task  in Realm
export const _storeLocalAddTaskObj = (data) => {
    const { WorkRequestSaveModel, WorkType } = data
    const taskObj = {
        ...WorkRequestSaveModel,
        WorkType
    }
    insertTaskInRealmObject(taskObj)

    // let obj = {
    //     WoJobId: WorkRequestSaveModel?.WoJobId,
    //     WoJobDetailsId: WorkRequestSaveModel?.WoJobDetailsId,
    //     WorkTypeId: WorkRequestSaveModel?.WorkTypeId,
    //     WorkTaskId: WorkRequestSaveModel?.WorkTaskId,
    //     WorkType: WorkRequestSaveModel?.WorkType,
    //     WorkTask: WorkRequestSaveModel?.WorkTask,
    //     WorkTaskNumber: "0",
    //     CustomerPrice: WorkRequestSaveModel?.CustomerPrice,
    //     TechCost: 30,
    //     IsAutoSchedule: false,
    //     Days: WorkRequestSaveModel?.Days,
    //     Hours: WorkRequestSaveModel?.Hours,
    //     Minutes: WorkRequestSaveModel?.Minutes,
    //     CreatedBy: WorkRequestSaveModel?.CreatedBy,
    //     CreatedDate: WorkRequestSaveModel?.CreatedDate,
    //     LastChangedBy: WorkRequestSaveModel?.LastChangedBy,
    //     LastUpdate: WorkRequestSaveModel?.LastUpdate,
    //     WoCategoryId: WorkRequestSaveModel?.WoCategoryId,
    //     WoCategory: "Connected Objects",
    //     TaskNo: 1,
    //     WorkGroupId: 6,
    //     JobStatusId: 4,
    //     WoStatusId: 0,
    //     CreatedSourceId: null,
    //     UpdatedSourceId: null,
    //     IsCreatedByClientPortal: null,
    //     VendorName: null,
    //     Technician: null,
    //     PricingUnitId: 417,
    //     Qty: 1,
    //     ScheduleDate: null,
    //     ScheduleStartDateTime: null,
    //     ScheduleEndDateTime: null,
    //     IsHold: null,
    //     ApptPrefDate: null,
    //     SlotStartTime: null,
    //     SlotEndTime: null,
    //     SlotName: null
    // }

}

//update the task  based on TaskNo in realm 

export const _updateLocalTask = (value) => {
    const { WorkRequestSaveModel, WorkType } = value
    const taskObj = {
        ...WorkRequestSaveModel,
        WorkType
    }

    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, taskObj?.WoJobId);
                    let data = JSON.parse(updatingObj?.WOJobDetails)
                    const extistingTaskIndex = data.findIndex(
                        (ele) => ele.TaskNo === taskObj?.TaskNo
                    )
                    if (extistingTaskIndex !== -1) {
                        data[extistingTaskIndex] = { ...taskObj, sync: false }
                        updatingObj.WOJobDetails = JSON.stringify(data)
                    }
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}
//delete task based on id in realm
export const deleteTaskLocallyBasedOnTaskNo = (value, callback) => {


    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.WOJobDetails)
                    let newList = data.filter(item => item.TaskNo != value?.TaskNo);

                    updatingObj.WOJobDetails = JSON.stringify(newList)

                    resolve();
                    callback()
                });
            })
            .catch((error) => reject(error));
    })
}

