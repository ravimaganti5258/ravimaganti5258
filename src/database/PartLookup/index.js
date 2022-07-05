import Realm from 'realm';
import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from "..";
import { PART_LOOKUP_LIST, PART_REQUIREMENT } from "./schema";

export const savePartLookUpInLocal = (list) => {
    list?.map((item, index) => {
        let data = {
            id: item?.PartId,
            AttachmentExists: item?.AttachmentExists,
            Brand: item.Brand,
            BrandId: item.BrandId,
            Category: item.Category,
            Description: item.Description,
            IsActive: item.IsActive,
            IsSerialized: item.IsSerialized,
            Model: item.Model,
            ModelId: item.ModelId,
            MovingCost: item.MovingCost,
            PartId: item.PartId,
            PartNo: item.PartNo,
            PartType: item.PartType,
            TaxIdGroupId: item.TaxIdGroupId,
            TaxTypeId: item.TaxTypeId,
            UnitPrice: item.UnitPrice,
            Uom: item.Uom,
            UomId: item.UomId,
            LastSycnDate: new Date()


        };
        checkPartLookExistOrNot(data, PART_LOOKUP_LIST)

    });

}


export const checkPartLookExistOrNot = (value, realmObj) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                let existObj = realm.objectForPrimaryKey(realmObj, value.id);
                if (existObj === undefined) {
                    insertNewRealmObject(value, realmObj);
                }
                //update
                else {
                    // fetchPartLookUpListLocal()
                    updatePartObjFormApi(value)

                }
                resolve()
            })
            .catch((error) => reject(error));
    });
//update data when comming from api 
export const updatePartObjFormApi = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(PART_LOOKUP_LIST, value?.PartId);

                    // updatingObj = value
                    resolve()
                })
            }).catch((error) => { reject(error), console.log({ error }) })
    })

}


export const fetchPartLookUpListLocal = async (callBack) => {
    const data = await queryAllRealmObject(PART_LOOKUP_LIST).then((res) => {
        let joblist = res.map((obj) => {
            return obj;
        });
        return joblist;
    });

    callBack && callBack(data)
    console.log({ data }, "partLooke up local ")

    return data;
}
