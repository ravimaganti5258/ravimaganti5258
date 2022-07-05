import { databaseOptions } from "../index";
import Realm from 'realm';
import { JOB_DETAILS } from '../JobDetails/schemas';
import { getJobListFromLocal, updateStatusJobListRealmObject } from "../JobList";


export const _storeLocalJobStatusObj = (value, callback, label) => {
    new Promise((resolve, reject) => {
        Realm.open(databaseOptions)
            .then((realm) => {
                realm.write(() => {
                    if (label == 'AcceptReject') {

                        let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.WoJobId);
                        let TechJobInformation = JSON.parse(updatingObj?.TechnicianJobInformation)
                        let timeline = JSON.parse(updatingObj?.GetJobStatusTimeLine)
                        let obj = {
                            ...TechJobInformation,
                            IsAccept: value.AcceptanceStatusId
                        }

                        updatingObj.TechnicianJobInformation = JSON.stringify(obj)
                        updateStatusJobListRealmObject(value, label)
                    } else {
                        let updatingObj = realm.objectForPrimaryKey(JOB_DETAILS, value?.jobid);
                        let timeline = JSON.parse(updatingObj?.GetJobStatusTimeLine)
                        let TechJobInformation = JSON.parse(updatingObj?.TechnicianJobInformation)

                        let timeLineObj = [{
                            ...timeline[0],
                            JobStatusId: value.jobstatus
                        }]
                        updatingObj.GetJobStatusTimeLine = JSON.stringify(timeLineObj)

                        let technicianJobInformation = {
                            ...TechJobInformation,
                            JobStatusid: value.jobstatus,
                            JobStatus: value?.JOBSTATUS
                        }

                        updatingObj.TechnicianJobInformation = JSON.stringify(technicianJobInformation)
                        if (value.jobstatus == 5) {
                            let CompletedStatusReasons = JSON.parse(updatingObj?.CompletedStatusReasons)
                            let reasonArr = [{ StatusReasonId: value.reason }]
                            let obj = {
                                CompanyId: value.companyid,
                                Reasons: reasonArr,
                                Remarks: value?.Remarks,
                                WoJobId: value?.jobid,
                            }
                            updatingObj.CompletedStatusReasons = JSON.stringify(obj)
                        }
                        updateStatusJobListRealmObject(value)
                    }
                    callback && callback()
                    resolve();
                });
            })
            .catch((error) => reject(error));
    })
}


