import Realm from 'realm';
import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from "..";
import { SERIAL_NUMBER } from './schema';

export const savePartSerialNoInLocal = (list) => {
    list?.map((item, index) => {
        let data = {
            id: item?.SerialNo,
            SerialNo: item?.SerialNo,
            ExpiryDate: item.ExpiryDate,
            LastSycnDate: new Date()


        };
        checkPartSerialNoExistOrNot(data, SERIAL_NUMBER)

    });

}


export const checkPartSerialNoExistOrNot = (value, realmObj) =>
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
//update data when comming from api 
export const updateSerialNoObjFormApi = (value) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(SERIAL_NUMBER, value?.SerialNo);

                    // updatingObj = value
                    resolve()
                })
            }).catch((error) => { reject(error), console.log({ error }) })
    })

}


export const fetchPartSerialNoListLocal = async (callBack) => {
    const data = await queryAllRealmObject(SERIAL_NUMBER).then((res) => {
        let joblist = res.map((obj) => {
            return obj;
        });
        return joblist;
    });

    callBack && callBack(data)
    console.log({ data }, "Serial Number local ")

    return data;
}
