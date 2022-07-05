import api from './api';
import { Header } from './buildHeader';

export const sharedApiCall = (apiRequest, token, callback, endPoint) => {
  const cb = {
    success: (data) => {
      console.log('response data', { data });
      callback();
    },
    error: (error) => {
      console.log({ error });
    },
  };
  let headers = Header(token);
  console.log('apiRequest', { apiRequest });

  apiRequest?.pendingApi.map((item, index) => {
    switch (item?.url) {

      case 'insertNotes':
        api?.insetNotes(item.data, cb, headers);
        break;
      case 'updateNotes':
        api?.updateNotes(item.data, cb, headers)
        break;
      case 'deleteNotes':
        api?.deleteNotes(item.data, cb, headers)
        break;

      case 'saveDaynamicCheckListDetails':
        api?.saveDaynamicCheckListDetails(item.data, cb, headers);
        break;

      case 'addTask':
        api?.addTask(item.data, cb, headers);
        break;
      case 'updateTask':
        api?.updateTask(item.data, cb, headers);
        break;
      case 'deleteTask':
        api?.deleteTask(item.data, cb, headers, item.endPoint);
        break

      case 'updateUserProfile':
        api?.updateUserProfile(item.data, cb, headers)
        break

      case 'addEquipment':
        api?.addNewEquipment(item.data, cb, headers);
        break;
      case 'editEquipment':
        api?.editEquipment(item.data, cb, headers);
        break;
      case 'deleteEquipment':
        api.deleteEquipment(item.data, cb, headers, item.endPoint);
        break;

      case 'addPricing':
        api.addPrice(item.data, cb, headers);
        break;
      case 'editPricing':
        api.addPrice(item.data, cb, headers);
        break;
      case 'deletePrice':
        api.deletePrice(item.data, cb, headers, item.endPoint);
        break;

      case 'updateStatus':
        api.updateStatus(item.data, cb, headers);
        break;

      case 'addForm':
        api.insertWOJobChecklistDetails(item.data, cb, headers);
        break;
      case 'deleteForm':
        api.deleteCheckList(item.data, cb, headers, item.endPoint);
        break;

      case 'addNormalOemEdit':
        api.addPartRequest(item.data, cb, headers);
        break;
      case 'addBOQPartEdit':
        api.updateInsertBOQParts(item.data, cb, headers);
        break;
      case 'deletePart':
        api.cancelParts(item.data, cb, headers);

      case 'updateAcceptRejectJob':
        api.updateAcceptRejectJob(item.data, cb, headers);
        break;

      case 'AllocatedPart':
        api.getPartRequirementInsertAllocate(item.data, cb, headers);
        break;
      case 'DeallocatedPart':
        api.getPartRequirementInsertAllocate(item.data, cb, headers);
        break;

      case 'AddIncident':
        api.saveIncidents(item.data, cb, headers);
        break;
      case 'EditIncident':
        api.saveIncidents(item.data, cb, headers);
        break;
      case 'DeleteIncident':
        api.deleteIncident(item.data, cb, headers, item.endPoint);
        break;

      case 'OtherInformation':
        api.insertcustomFields(item.data, cb, headers);
        break;

      case 'SignAndFeedback':
        api.saveSignAndFeedback(item.data, cb, headers);
        break;

      case 'ApplyTimeOff':
        api.applyTimeOff(item.data, cb, headers);
        break;

      default:
        break;
    }
  });
};
