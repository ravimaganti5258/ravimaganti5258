import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from '../JobDetails/schemas';


//insert new equipment  in Realm
export const _storeLocalAddEquipmentObj = (data) => {
    const { WoEquipmentEntity } = data
    const equipObj = {
        ...WoEquipmentEntity[0],
    }
    insertEquipmentInRealmObject(equipObj)
}
export const insertEquipmentInRealmObject = (value) =>
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.GetJobEquipment)
                    data.push({ ...value, sync: false, EquipId: data.length + 1})
                    updatingObj.GetJobEquipment = JSON.stringify(data)
                    resolve();
                });
            })
            .catch((error) => reject(error));
    });

// update the equipment based on WoEquipmentId in realm 
export const _updateLocalEquipment = (value) => {
    const { WoEquipmentEntity } = value
    const equipObj = {
        ...WoEquipmentEntity[0],
    }

    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, equipObj?.WoJobId);
                    let data = JSON.parse(updatingObj?.GetJobEquipment)
                    const extistingEquipment = data.findIndex(
                        (ele) => ele?.WoEquipmentId === equipObj?.WoEquipmentId || ele?.EquipId == equipObj?.EquipId)
                    if (extistingEquipment !== -1) {
                        data[extistingEquipment] = { ...equipObj, sync: false }
                        updatingObj.GetJobEquipment = JSON.stringify(data)
                    }
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}

//delete equipment based on WoEquipmentId in realm
export const _deleteEquipLocally = (value, callback) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                    let data = JSON.parse(updatingObj?.GetJobEquipment)
                    let newList = data.filter(item => item.WoEquipmentId != value?.WoEquipmentId || item?.EquipId != value?.EquipId);
                    updatingObj.GetJobEquipment = JSON.stringify(newList)
                    resolve();
                    callback()
                });
            })
            .catch((error) => reject(error));
    })
}

