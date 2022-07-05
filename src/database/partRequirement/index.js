import Realm from 'realm';
import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from "..";
import { PART_REQUIREMENT } from "./schema";

export const savePartRequirementInLocal = (list) => {
    list?.map((item, index) => {
        let data = {
            id: item?.PartRequestId,
            ApprovalStatus: item?.ApprovalStatus,
            ApprovalStatusId: item?.ApprovalStatusId,
            ApprovedQty: item?.ApprovedQty,
            AttachmentExists: item?.AttachmentExists,
            Description: item?.Description,
            IsBOQRequest: item?.IsBOQRequest,
            JobId: item?.JobId,
            Model: item?.Model,
            ModelId: item?.ModelId,
            PartId: item?.PartId,
            PartNo: item?.PartNo,
            PartReqStatus: item?.PartReqStatus,
            PartRequestId: item?.PartRequestId,
            PartRequestNo: item?.PartRequestNo,
            Quantity: item?.Quantity,
            RequestStatusId: item?.RequestStatusId,
            WarehouseId: item?.WarehouseId,
            WorkOrderId: item?.WorkOrderId,
            dataSync: true

        };
        checkPartRequirementExistOrNot(data, PART_REQUIREMENT)

    });

}


export const checkPartRequirementExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                //update
                else {
                    updatePartObjFormApi(value)

                }
                resolve()
            })
            .catch((error) => reject(error));
    });


export const fetchPartRequirementLocal = async (callBack) => {
    const data = await queryAllRealmObject(PART_REQUIREMENT).then((res) => {
        let joblist = res.map((obj) => {
            return obj;
        });
        return joblist;
    });

    callBack && callBack(data)


    return data;
}

export const updatePartLocally = (value, callback, id) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(PART_REQUIREMENT, value?.PartRequestId);
                    updatingObj.PartReqStatus = id == 1 ? 'Requested' : id == 0 ? 'Allocated' : 'Awaiting Part'
                    updatingObj.dataSync = false

                    resolve()
                })
            }).catch((error) => { reject(error), console.log({ error }) })
    })








}


//update data when comming from api 
export const updatePartObjFormApi = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(PART_REQUIREMENT, value?.PartRequestId);
                    updatingObj = value
                    resolve()
                })
            }).catch((error) => { reject(error), console.log({ error }) })
    })








}



export const cancelPartLocally = (value, callBack) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let deletingObj = realm.objectForPrimaryKey(PART_REQUIREMENT, value?.PartRequestId);
                    // realm.delete(deletingObj);


                    // callBack && callBack()
                    resolve()
                });
            })
            .catch((error) => reject(error));
    });

}