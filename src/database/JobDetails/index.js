import { databaseOptions, insertNewRealmObject, queryAllRealmObject } from '../index';
import Realm from 'realm';
import { JOB_DETAILS } from './schemas';


export const updateJobDetailsRealmObject = (value) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          value?.map((res) => {
            let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, res?.TechnicianJobInformation?.WoJobId);
            updatingObj.CompletedStatusReasons = JSON.stringify(res?.CompletedStatusReasons);
            updatingObj.GetWojobServiceNotesDetails = JSON.stringify(res?.GetWojobServiceNotesDetails);
            updatingObj.TechnicianJobInformation = JSON.stringify(res?.TechnicianJobInformation);
            updatingObj.utcOffset = JSON.stringify(res?.utcOffset);
            updatingObj.CustomFields = JSON.stringify(res?.CustomFields);
            updatingObj.CustomertimeZone = JSON.stringify(res?.CustomertimeZone);
            updatingObj.GetAllAttachment = JSON.stringify(res?.GetAllAttachment);
            updatingObj.GetAllCheckListAttachment = JSON.stringify(res?.GetAllCheckListAttachment);
            updatingObj.GetCustomerFeedback = JSON.stringify(res?.GetCustomerFeedback);
            updatingObj.GetJobEquipment = JSON.stringify(res?.GetJobEquipment);
            updatingObj.GetJobPaymentDetailsEntity = JSON.stringify(res?.GetJobPaymentDetailsEntity);
            updatingObj.GetPriceDetailsEntity = JSON.stringify(res?.GetPriceDetailsEntity);
            updatingObj.GetProjectDetails = JSON.stringify(res?.GetProjectDetails);
            updatingObj.GetTechnicianRemarks = JSON.stringify(res?.GetTechnicianRemarks);
            updatingObj.GetWOJobChecklist = JSON.stringify(res?.GetWOJobChecklist);
            updatingObj.GetWOJobSignature = JSON.stringify(res?.GetWOJobSignature);
            updatingObj.GetWojobServiceNotesDetails = JSON.stringify(res?.GetWojobServiceNotesDetails);
            updatingObj.GetWojobSplInsDetails = JSON.stringify(res?.GetWojobSplInsDetails);
            updatingObj.GetWorkOrderAppointment = JSON.stringify(res?.GetWorkOrderAppointment);
            updatingObj.IncidentDetails = JSON.stringify(res?.IncidentDetails);
            updatingObj.JobApprovalStatus = JSON.stringify(res?.JobApprovalStatus);
            updatingObj.OTPEnable = JSON.stringify(res?.OTPEnable);
            updatingObj.OTPTypeId = JSON.stringify(res?.OTPTypeId);
            updatingObj.SLADetails = JSON.stringify(res?.SLADetails);
            updatingObj.WOJobDetails = JSON.stringify(res?.WOJobDetails);
            updatingObj.WorkOrderCustomerContactDetails = JSON.stringify(res?.WorkOrderCustomerContactDetails);
            updatingObj.GetPartWarehouse = JSON.stringify(res?.GetPartWarehouse);
            updatingObj.GetJobStatusTimeLine = JSON.stringify(res?.GetJobStatusTimeLine);
            updatingObj.GetPartRequestList = JSON.stringify(res?.GetPartRequestList);
            updatingObj.GetAllPartRequestEntity = JSON.stringify(res?.GetAllPartRequestEntity)
          })
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

export const insertJobDetailsInstructionsRealmObject = (value, localCallBack) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {

          let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.jobId);
          if (value?.title == 'Service Notes') {
            let insData = updatingObj?.GetWojobServiceNotesDetails;
            insData = JSON.parse(insData);
            insData.push({ ...value?.apiPayload, sync: false, localId: 'SN' + insData.length + 1 })

            updatingObj.GetWojobServiceNotesDetails = JSON.stringify(insData);
            localCallBack()
          }
          else if (value?.title == 'Technician Remarks') {
            let techData = updatingObj?.GetTechnicianRemarks;
            techData = JSON.parse(techData);
            techData.push({ ...value?.apiPayload, sync: false, localId: 'TR' + techData + 1 })
            updatingObj.GetTechnicianRemarks = JSON.stringify(techData)
            localCallBack()
          }
          else {
            let noteData = updatingObj?.GetWojobSplInsDetails;
            noteData = JSON.parse(noteData);
            noteData.push({ ...value?.apiPayload, sync: false, localId: 'IN' + noteData.length + 1 })
            updatingObj.GetWojobSplInsDetails = JSON.stringify(noteData)
            localCallBack()
          }
          resolve();

        });
      })
      .catch((error) => reject(error));
  });

export const updateJobDetailsInstructionsRealmObject = (value, localCallBack) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value.jobId);

          if (value.title == 'Service Notes') {
            let insData = updatingObj?.GetWojobServiceNotesDetails;
            insData = JSON.parse(insData);
            const extistingTaskIndex = insData.findIndex(
              (ele) => ele.localId == value?.localId || ele.NotesID == value?.NotesID
            )
            if (extistingTaskIndex !== -1) {
              insData[extistingTaskIndex] = { ...value.apiPayload, localId: value.localId, sync: false }

              updatingObj.GetWojobServiceNotesDetails = JSON.stringify(insData)
              localCallBack()
            }

          }
          else if (value.title == 'Technician Remarks') {
            let techData = updatingObj?.GetTechnicianRemarks;
            techData = JSON.parse(techData);
            const extistingTaskIndex = techData.findIndex(
              (ele) => ele.localId == value?.localId || ele.NotesID == value?.NotesID
            )
            if (extistingTaskIndex !== -1) {
              techData[extistingTaskIndex] = { ...value.apiPayload, localId: value.localId, sync: false }
              updatingObj.GetTechnicianRemarks = JSON.stringify(techData)
              localCallBack()
            }

          }
          else {
            let noteData = updatingObj?.GetWojobSplInsDetails;
            noteData = JSON.parse(noteData);
            const extistingTaskIndex = noteData.findIndex(
              (ele) => ele.localId == value?.localId || ele.NotesID == value?.NotesID
            )
            if (extistingTaskIndex !== -1) {
              noteData[extistingTaskIndex] = { ...value.apiPayload, localId: value.localId, sync: false }
              updatingObj.GetWojobSplInsDetails = JSON.stringify(noteData)
              localCallBack()
            }
          }
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

export const checkJobDetailsExistOrNot = (value, realmObj) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let existObj = realm.objectForPrimaryKey(realmObj, value.id);
        if (existObj === undefined) {
          insertNewRealmObject(value, realmObj);
        }
        else {
          updateJobDetailsRealmObject(value)
      }
      resolve()
        //update
      })
      .catch((error) => reject(error));
  });

export const saveJobDetailInLocal = (data) => {

  data?.map((item, index) => {
    let obj = {
      id: item?.TechnicianJobInformation?.WoJobId,
      CompletedStatusReasons: JSON.stringify(item?.CompletedStatusReasons),
      GetWojobServiceNotesDetails: JSON.stringify(
        item?.GetWojobServiceNotesDetails,
      ),
      TechnicianJobInformation: JSON.stringify(item?.TechnicianJobInformation),
      utcOffset: JSON.stringify(item?.utcOffset),
      CustomFields: JSON.stringify(item?.CustomFields),
      CustomertimeZone: JSON.stringify(item?.CustomertimeZone),
      GetAllAttachment: JSON.stringify(item?.GetAllAttachment),
      GetAllCheckListAttachment: JSON.stringify(item?.GetAllCheckListAttachment),
      GetCustomerFeedback: JSON.stringify(item?.GetCustomerFeedback),
      GetDynamicChecklist: JSON.stringify(item?.GetDynamicChecklist),
      GetJobEquipment: JSON.stringify(item?.GetJobEquipment),
      GetJobPaymentDetailsEntity: JSON.stringify(
        item?.GetJobPaymentDetailsEntity,
      ),
      GetPriceDetailsEntity: JSON.stringify(item?.GetPriceDetailsEntity),
      GetProjectDetails: JSON.stringify(item?.GetProjectDetails),
      GetTechnicianRemarks: JSON.stringify(item?.GetTechnicianRemarks),
      GetWOJobChecklist: JSON.stringify(item?.GetWOJobChecklist),
      GetWOJobSignature: JSON.stringify(item?.GetWOJobSignature),
      GetWojobServiceNotesDetails: JSON.stringify(
        item?.GetWojobServiceNotesDetails,
      ),
      GetWojobSplInsDetails: JSON.stringify(item?.GetWojobSplInsDetails),
      GetWorkOrderAppointment: JSON.stringify(item?.GetWorkOrderAppointment),
      IncidentDetails: JSON.stringify(item?.IncidentDetails),
      JobApprovalStatus: JSON.stringify(item?.JobApprovalStatus),
      OTPEnable: JSON.stringify(item?.OTPEnable),
      OTPTypeId: JSON.stringify(item?.OTPTypeId),
      SLADetails: JSON.stringify(item?.SLADetails),
      WOJobDetails: JSON.stringify(item?.WOJobDetails),
      WorkOrderCustomerContactDetails: JSON.stringify(
        item?.WorkOrderCustomerContactDetails,
      ),
      GetPartWarehouse: JSON.stringify(item?.GetPartWarehouse),
      GetJobStatusTimeLine: JSON.stringify(item?.GetJobStatusTimeLine),
      GetPartRequestList: JSON.stringify(item?.GetPartRequestList),
      GetAllPartRequestEntity: JSON.stringify(item?.GetAllPartRequestEntity)
    };
    checkJobDetailsExistOrNot(obj, JOB_DETAILS);
  });
};

//fetch the perticular job Details based on id
export const fetchjobDeailsPerId = (data, id, callback) => {
updateJobDetailLocally(id)
  data().then((res) => {
    res.map((item) => {
var jobItem = JSON.parse(item?.TechnicianJobInformation)
      if (
        jobItem?.WoJobId == id
      ) 
      {
        const obj = {
          CompletedStatusReasons: JSON.parse(item?.CompletedStatusReasons),
          GetWojobServiceNotesDetails: JSON.parse(
            item?.GetWojobServiceNotesDetails,
          ),
          TechnicianJobInformation: JSON.parse(item?.TechnicianJobInformation),
          utcOffset: JSON.parse(item?.utcOffset),
          CustomFields: JSON.parse(item?.CustomFields),
          CustomertimeZone: JSON.parse(item?.CustomertimeZone),
          GetAllAttachment: JSON.parse(item?.GetAllAttachment),
          GetAllCheckListAttachment: JSON.parse(item?.GetAllCheckListAttachment),
          GetCustomerFeedback: JSON.parse(item?.GetCustomerFeedback),
          GetDynamicChecklist: JSON.parse(item?.GetDynamicChecklist),
          GetJobEquipment: JSON.parse(item?.GetJobEquipment),
          GetJobPaymentDetailsEntity: JSON.parse(
            item?.GetJobPaymentDetailsEntity,
          ),
          GetPriceDetailsEntity: JSON.parse(item?.GetPriceDetailsEntity),
          GetProjectDetails: JSON.parse(item?.GetProjectDetails),
          GetTechnicianRemarks: JSON.parse(item?.GetTechnicianRemarks),
          GetWOJobChecklist: JSON.parse(item?.GetWOJobChecklist),
          GetWOJobSignature: JSON.parse(item?.GetWOJobSignature),
          GetWojobServiceNotesDetails: JSON.parse(
            item?.GetWojobServiceNotesDetails,
          ),
          GetWojobSplInsDetails: JSON.parse(item?.GetWojobSplInsDetails),
          GetWorkOrderAppointment: JSON.parse(item?.GetWorkOrderAppointment),
          IncidentDetails: JSON.parse(item?.IncidentDetails),
          JobApprovalStatus: JSON.parse(item?.JobApprovalStatus),
          OTPEnable: JSON.parse(item?.OTPEnable),
          OTPTypeId: JSON.parse(item?.OTPTypeId),
          SLADetails: JSON.parse(item?.SLADetails),
          WOJobDetails: JSON.parse(item?.WOJobDetails),
          WorkOrderCustomerContactDetails: JSON.parse(
            item?.WorkOrderCustomerContactDetails,
          ),
          GetPartWarehouse: JSON.parse(item?.GetPartWarehouse),
          GetJobStatusTimeLine: JSON.parse(item?.GetJobStatusTimeLine),
          GetPartRequestList: JSON.parse(item?.GetPartRequestList),
          GetAllPartRequestEntity: JSON.parse(item?.GetAllPartRequestEntity)

        };
        callback(obj)
      }
    });
  });
}


export const fetchJobDetailsData = async () => {
  const data = await queryAllRealmObject(JOB_DETAILS).then((res) => {
    let jobdetials = [];
    jobdetials = res.map((obj) => {
      return obj;
    });
    return jobdetials;
  });
  return data;
}

export const updateJobDetailLocally = (id) => {
  new Promise((resolve, reject) => {
      Realm.open(databaseOptions)
          .then((realm) => {
              realm.write(() => {
                  let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, id);
                  resolve()
              })
          }).catch((error) => { reject(error), console.log({ error }) })
  })
}

export const deleteJobDetailsInstructionsRealmObject = (value, jobId, title) => {

  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          let deletingObj = realm.objectForPrimaryKey(JOB_DETAILS, jobId);
          if (title == 'Service Notes') {
            let insData = deletingObj?.GetWojobServiceNotesDetails;
            insData = JSON.parse(insData);
            let newList
            if (value.localId) {
              newList = insData.filter(item => item.localId != value.localId);
            }
            else {
              newList = insData.filter(item => item.NotesID != value.NotesID);
            }
            deletingObj.GetWojobServiceNotesDetails = JSON.stringify(newList);
          }
          else if (title == 'Technician Remarks') {
            let techData = deletingObj?.GetTechnicianRemarks;
            techData = JSON.parse(techData);
            let newList = []
            if (value.localId) {
              newList = techData.filter(item => item.localId != value.localId);
            }
            else {
              newList = techData.filter(item => item.NotesID != value.NotesID);
            }

            deletingObj.GetTechnicianRemarks = JSON.stringify(newList)
          }
          else {
            let noteData = deletingObj?.GetWojobSplInsDetails;
            noteData = JSON.parse(noteData);
            let newList = []

            if (value.localId) {
              newList = noteData.filter(item => item.localId != value.localId);
            }
            else {
              newList = noteData.filter(item => item.NotesID != value.NotesID);
            }

            deletingObj.GetWojobSplInsDetails = JSON.stringify(newList)
          }


          resolve();
        });
      })
      .catch((error) => reject(error));
  });
}