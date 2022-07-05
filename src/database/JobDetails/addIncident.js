import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from './schemas';


//update new object add task in WOJobDetail 
export const insertIncidentInRealmObject = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS,value?.SourceJobId);
                    let data = JSON.parse(updatingObj?.IncidentDetails)
                    
                    data.push({ ...value, sync: false, id:data?.length+1 })
                    updatingObj.IncidentDetails = JSON.stringify(data)
                    
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });
//insert new task  in Realm
export const _storeLocalAddIncident = (data) => {
   let obj={
        WOPunchPointsId:data?.WOPunchPointsId == undefined ?0:data?.WOPunchPointsId ,
        CompanyId:data?.CompanyId == undefined ?0:data?.CompanyId ,
        WorkOrderId: data?.WorkOrderId ==undefined?0:data?.WorkOrderId,
        SourceJobId: data?.SourceJobId,
        WoCategoryId: data?.WoCategoryId,
        WorkTypeId: data?.WorkTypeId,
        WorkTaskId: data?.WorkTaskId,
        PunchPointStatusId: 1,
        WoCategory: data?.WoCategory,
        WorkType: data?.WorkType,
        WorkTask: data?.WorkTask,
        Status: data?.Status!=undefined ?data?.Status:0,
        Comments: data?.Comments,
        Attachmentcounts: data?.Attachmentcounts!=undefined ?data?.Attachmentcounts:0,
        DaysPerTask: data?.DaysPerTask !=undefined ?data?.DaysPerTask :0 ,
        HoursPerTask:data?.HoursPerTask !=undefined ?data?.HoursPerTask:0 ,
        MinutesPerTask: data?.MinutesPerTask !=undefined? data?.MinutesPerTask :0,
        WorkGroupId: data?.WorkGroupId !=undefined ?data?.WorkGroupId:0 ,
        TaxTypeId: data?.TaxTypeId !=undefined ?data?.TaxTypeId:0,
        TaxIdGroupId: data?.TaxIdGroupId !=undefined,
        CustomerPrice: data?.CustomerPrice != undefined ?data?.CustomerPrice:0 ,
        PricingUnitId: data?.PricingUnitId != undefined? data?.PricingUnitId:0
    }
    

     insertIncidentInRealmObject(obj)


}

//update the task  based on TaskNo in realm 

export const _updateIncident = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS,value?.SourceJobId);
                    let data = JSON.parse(updatingObj?.IncidentDetails)


                    const extistingTaskIndex = data.findIndex(
                        (ele) => ele.WOPunchPointsId  === value?.WOPunchPointsId  || ele?.id == value?.id               
                         )
                     if (extistingTaskIndex !== -1) {
                     data[extistingTaskIndex] = { ...value, sync: false }
                        updatingObj.WOJobDetail = JSON.stringify(data)
                    }
                    updatingObj.IncidentDetails = JSON.stringify(data)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}
//delete task based on id in realm
export const deleteIncidentLocally = (value, callback) => {

    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.SourceJobId);
                    let data = JSON.parse(updatingObj?.IncidentDetails)
                     let newList = data.filter(item => item.WOPunchPointsId != value?.WOPunchPointsId || item?.id == value?.id  );
                    updatingObj.IncidentDetails = JSON.stringify(newList)

                    resolve();
                    callback()
                });
            })
            .catch((error) => reject(error));
    })
}

