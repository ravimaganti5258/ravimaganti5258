import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from '../JobDetails/schemas';



//insert new normal oem parts in Realm
export const _storeLocalAddPartObj = (value, id) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.JobId);
                        let reqList = JSON.parse(updatingObj?.GetPartRequestList)
                        let data = reqList?.PartLists
                        data.push({ ...value, sync: false, PartNumId: data.length + 1 })
                        let obj = {PartLists: data, TotalRecord: data.length}
                        updatingObj.GetPartRequestList = JSON.stringify(obj)
                    // }
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });
}
// update the normal oem parts based on PartNumId in realm 
export const _updateLocalPart = (value, id) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.JobId);
                    let reqList = JSON.parse(updatingObj?.GetPartRequestList)
                    let data = reqList?.PartLists
                    const extistingPart = data.findIndex(
                        (ele) => ele?.PartRequestId === value?.PartRequestId || ele?.PartNumId == value?.PartNumId)
                    if (extistingPart !== -1) {
                        data[extistingPart] = { ...value, sync: false }
                        let obj = {PartLists: data, TotalRecord: data.length}
                        // updatingObj.GetPartRequestList = JSON.stringify(obj)
                        // updatingObj.GetPartRequestList.PartLists = JSON.stringify(data)
                    }
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}

//insert new BOQ parts in Realm
export const _storeLocalBOQPartObj = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.JobId);
                    let reqList = JSON.parse(updatingObj?.GetPartRequestList)
                    let data = reqList?.PartLists
                    data.push({ ...value, sync: false, PartNumId: data.length + 1 })
                    let obj = {PartLists: data, TotalRecord: data.length}
                    updatingObj.GetPartRequestList = JSON.stringify(obj)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });
}
// update the BOQ parts based on PartNumId in realm 
export const _updateLocalBOQPart = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.JobId);
                    let reqList = JSON.parse(updatingObj?.GetPartRequestList)
                    let data = reqList?.PartLists
                    const extistingPart = data.findIndex(
                        (ele) => ele?.PartRequestId === value?.PartRequestId || ele?.PartNumId == value?.PartNumId)
                    if (extistingPart !== -1) {
                        data[extistingPart] = { ...value, sync: false }
                        // updatingObj.GetPartRequestList.PartLists = JSON.stringify(data)
                        let obj = {PartLists: data, TotalRecord: data.length}
                        updatingObj.GetPartRequestList = JSON.stringify(obj)
                    }
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}

//delete parts based on PartNumId in realm
export const _deletePartLocally = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let reqList = JSON.parse(updatingObj?.GetPartRequestList)
                    let data = reqList?.PartLists
                    // let data = JSON.parse(updatingObj?.GetPartRequestList.PartLists)
                    let newList = data.filter(item => item.PartRequestId != value?.PartRequestId || item?.PartNumId != value?.PartNumId);
                    // updatingObj.GetPartRequestList.PartLists = JSON.stringify(newList)
                    let obj = {PartLists: newList, TotalRecord: newList.length}
                        updatingObj.GetPartRequestList = JSON.stringify(obj)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}

