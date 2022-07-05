import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Platform,
  ScrollView,
  Image,
  I18nManager
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '../../../assets/styles/colors/colors.js';

import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import Loader from '../../../components/Loader';
import { useColors } from '../../../hooks/useColors.js';

import HeaderComponents from '../../../components/header';
import MainHoc from '../../../components/Hoc';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { Header } from '../../../lib/buildHeader';
import { BlackMoreOptionIcon, AttchmentIcon } from '../../../assets/img/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { Dropdown } from '../../../components/Dropdown/index';
import api from '../../../lib/api';
import AddMoreModal from '../../screens/JobList/addMore';
import PairButton from '../../../components/Button/pairBtn';
import { emptyDropDown } from '../../../util/helper';
import LabelComponent from '../../../components/LableComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryAllRealmObject } from '../../../database/index';
import {
  AllWorkType,
  MASTER_DATA,
} from '../../../database/webSetting/masterSchema';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { ModalContainer } from '../../../components/Modal/index.js';
import AttchmentPickerComponent from '../Attachment/AttchmentPicker';
import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import {useFocusEffect} from '@react-navigation/native';
import {_storeLocalAddIncident, _updateIncident } from '../../../database/JobDetails/addIncident'
import { useNetInfo } from '../../../hooks/useNetInfo.js';
import { pendingApi } from '../../../redux/pendingApi/action.js';

const { width, height } = Dimensions.get('window');

const AddIncident = ({ navigation, route }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const [attechement, setAttechement] = useState('');
  const [comments, setComments] = useState('');
  const [workCategory, setworkCategory] = useState({});
  const [workType, setworkType] = useState({});
  const [workRequest, setWorkRequest] = useState({});
  const [workTypeItem, setworkTypeItem] = useState([]);
  const [workRequestItem, setworkRequestItem] = useState([]);
  const [workCategoryItem, setWorkCategoryItem] = useState([]);
  const [onToggleAttchment, setOnToggleAttchment] = useState(false);
  const [imagefromPicker, setImagefromPicker] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [imaCaptureDate, setimaCaptureDate] = useState(null);
  const [imageUploadedFrom, setimageUploadedFrom] = useState(null);
  const [imageBaseversion, setimageBaseversion] = useState(null);
  const [allWorkType, setAllWorkType] = useState([]);
  const [allWorkRequest, setAllWorkRequest] = useState([]);
  const [headerTitle, setheaderTitle] = useState(null);
  const [discriptions, setdiscriptions] = useState(null);
  const [imgData, setimgData] = useState([]);
  const dispatch = useDispatch();
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const [loading, setLoading] = useState(true);
  const { colors } = useColors();
  const [attcahmentCount, setAttchmentCount] = useState(0);
  const { isConnected, isInternetReachable } = useNetInfo();

  const {
    title,
    item,
    incidentAttchment,
    uploadedfrom,
  } = route?.params;
 
  const jobInformaaitions = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const [drop1, setDrop1] = useState(false);
  const [drop2, setDrop2] = useState(false);
  const [drop3, setDrop3] = useState(false);

  // const {uploadedfrom} = route?.params;

  const incidentList = useSelector(
    (state) => state?.jobDetailReducers?.data?.IncidentDetails,
  );
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: toggleAddMore,
    },
  ];
  useEffect(() => {
    fetchDataRealm();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((resp) => {
        const res = resp[0];

        const categoryList = res?.CategoryMaster.map((obj) => {
          let object = {
            ...obj,
            id: obj.WoCategoryId,
            label: obj.WoCategory,
            value: obj.WoCategory,
          };
          return object;
        });

        categoryList?.length > 0 && setWorkCategoryItem(categoryList);

        const workTask = res?.AllWorkTask.map((obj) => {
          let object = JSON.parse(JSON.stringify(obj));
          object.id = obj.WorkTaskId;
          object.label = obj.WorkTask;
          object.value = obj.WorkTask;
          return object;
        });
        workTask?.length > 0 && setAllWorkRequest(workTask);
        const workTypeDropDown = res?.AllWorkType.map((obj) => {
          let object = JSON.parse(JSON.stringify(obj));
          object.id = obj.WorkTypeId;
          object.label = obj.WorkType;
          object.value = obj.WorkType;
          return object;
        });

        setAllWorkType(workTypeDropDown);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (incidentAttchment) {
      const data1 = route?.params?.data;

      if (data1 != undefined) {
        const imgArray = [...imgData];
        imgArray.push(route?.params?.data);
        if (imgArray != undefined) {
          setimgData(imgArray);
          if (imgArray?.length > 0) {
            setAttchmentCount((prev) => prev + 1);
          }
        }
      }

      setImagefromPicker(route?.params?.imagePath);
      setImageName(route?.params?.filename);
      setimaCaptureDate(route?.params?.CapturedDate);
      setimageUploadedFrom(route?.params?.uploadedFrom);
      setimageBaseversion(route?.params?.imageBaseversions);
      setdiscriptions(route?.params?.Description);

      setLoading(false);
    }
  }, [route, incidentAttchment]);

  useEffect(() => {
    const { title, item, AttachmentIcon, attachmentName } = route?.params;
    setheaderTitle(title);
    if (title === strings('Add_Incident.Edit_Incidents') && incidentAttchment == false) {
      setComments(route?.params?.item?.Comments);
      setAttchmentCount(item?.Attachmentcounts);

      const shortedCat = workCategoryItem.filter(
        (obj) => obj.id == item.WoCategoryId,
      );
      setworkCategory(shortedCat[0]);
    }
  }, [route, workCategoryItem]);

  useEffect(() => {
    const { title, item } = route?.params;
    if (title === strings('Add_Incident.Edit_Incidents')) {
      const shortReq = allWorkRequest.filter(
        (obj) => obj.id == item.WorkTaskId,
      );

      setWorkRequest(shortReq[0]);
    }
  }, [route, allWorkRequest]);
  useEffect(() => {
    const { title, item } = route?.params;
    if (title === strings('Add_Incident.Edit_Incidents')) {
      const shortWorkType = allWorkType.filter(
        (obj) => obj.id == item.WorkTypeId,
      );
      setworkType(shortWorkType[0]);
    }
  }, [route, allWorkType]);

  useEffect(() => {
    let data = [];

    allWorkRequest.map((e) => {
      e.WoCategoryId === workCategory.id && data.push(e);
    });
    if (data?.length > 0) {
      setworkRequestItem(data);
    }
  }, [workCategory]);

  useEffect(() => {
    const data = allWorkType.filter((e) => e.id === workRequest?.WorkTypeId);

    setworkTypeItem(data);
  }, [workRequest]);

  const editIncidentDetails = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        WOPunchPointsId: route?.params?.item?.WOPunchPointsId,
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: jobInformaaitions.WorkOrderId,
        SourceJobId: jobInformaaitions.WoJobId,
        WoCategoryId: workCategory?.id,
        WorkTypeId: workType?.id,
        WorkTaskId: workRequest?.id,
        PunchPointStatusId: 1,
        StatusDate: null,
        Remarks: 'comeents test',
        Comments: comments,
        CreatedBy: jobInformaaitions.CreatedBy,
        CreatedDate: jobInformaaitions.CreatedDate,
        LastChangedBy: 0,
        LastUpdate: null,
      };
      _updateIncident({ ...data,  WorkType: workType?.value, WorkTask:workRequest?.value,WoCategory : workCategory?.value })
      
      const handleCallback = {
        success: (data) => {
          uploadIncidentAttechment(data?.Data);
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          dispatch({ type: SET_LOADER_FALSE });
          // setTimeout(() => {
          //   navigation.goBack();
          // }, 300);
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      if(isInternetReachable){
        api.saveIncidents(data, handleCallback, header);
      }
      else{
        let obj = {
          id: stateInfo?.pendingApi?.length + 1,
          url: 'EditIncident',
          data: data,
          jobId: jobInformaaitions?.WoJobId
        };
        let apiArr = [...stateInfo?.pendingApi]
          apiArr.push(obj)
          dispatch(pendingApi(apiArr));
        FlashMessageComponent('success', strings(`Response_code.${1002}`));
        setTimeout(() => {
      navigation.goBack()
                }, 1000);
      }
       
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  const callBack = (data) => {
    dispatch(saveJobDetails(data[0]));
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let dataset = {
  //       token: token,
  //       TechId: userInfo?.sub,
  //       WojobId: jobInformaaitions?.WoJobId,
  //       CompanyId: userInfo?.CompanyId,
  //       customFieldentity: '3,16',
  //     };
  //     fetchJobDetails(dataset, callBack);
  //   }, []),
  // );

  const saveIncidentDetails = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        WOPunchPointsId: 0,
        CompanyId: userInfo?.CompanyId,
        WorkOrderId: jobInformaaitions?.WorkOrderId,
        SourceJobId: jobInformaaitions?.WoJobId,
        WoCategoryId: workCategory?.id,
        WorkTypeId: workType?.id,
        WorkTaskId: workRequest?.id,
        PunchPointStatusId: 1,
        StatusDate: null,
        Remarks: 'comeents test',
        Comments: comments,
        CreatedBy: jobInformaaitions.CreatedBy,
        CreatedDate: jobInformaaitions.CreatedDate,
        LastChangedBy: 0,
        LastUpdate: null,
      };
     
      _storeLocalAddIncident({ ...data,  WorkType: workType?.value, WorkTask:workRequest?.value,WoCategory : workCategory?.value,  })
      const handleCallback = {
        success: (data) => {
          
          uploadIncidentAttechment(data?.Data);
          const msgCode = data?.Message?.MessageCode;
          if (msgCode.length > 0) {
            FlashMessageComponent(
              'success',
              strings(`Response_code.${msgCode}`),
            );
            dispatch({ type: SET_LOADER_FALSE });
          }
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      const header = Header(token);
      if(isInternetReachable){
        api.saveIncidents(data, handleCallback, header);
      }
      else{
        let obj = {
          id: stateInfo?.pendingApi?.length + 1,
          url: 'AddIncident',
          data: data,
          jobId: jobInformaaitions?.WoJobId
        };
        let apiArr = [...stateInfo?.pendingApi]
          apiArr.push(obj)
          dispatch(pendingApi(apiArr));
        FlashMessageComponent('success', strings(`Response_code.${1001}`));
        setTimeout(() => {
      navigation.goBack()
                }, 1000);
      }
    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  // const _handleNavigationOnCamera = (item) => {
  //   setOnToggleAttchment(false);
  //   setImagefromPicker(item.path);
  //   setImageName(item.fileName);
  //   setimaCaptureDate(item.date);
  //   setimageUploadedFrom(item.UploadedFrom);
  //   setimageBaseversion(item.base64);
  // };
  // const _handleNavigationOnGallery = (item) => {
  //   setOnToggleAttchment(false);
  //   setImagefromPicker(item.path);
  //   setImageName(item.fileName);
  //   setimaCaptureDate(item.date);
  //   setimageUploadedFrom(item.UploadedFrom);
  //   setimageBaseversion(item.base64);
  // };
  // const _handleNavigationOnDocument = async (item) => {
  //   setOnToggleAttchment(false);
  //   setImagefromPicker(item.path);
  //   setImageName(item.fileName);
  //   setimaCaptureDate(item.date);
  //   setimageUploadedFrom(item.UploadedFrom);
  //   setimageBaseversion(item.base64);
  // };

  const validation = async () => {
    let messages = [];
    if (!workCategory?.value) {
      await messages.push('Work category must be select.');
    }
    if (!workRequest?.value) {
      await messages.push('Work request must be select.');
    }
    if (!workType?.value) {
      await messages.push(' WorkType must be select.');
    }
    // if (!imageName) {
    //   await messages.push('Attachment must be select.');
    // }
    // if (!comments) {
    //   await messages.push('Comments must me added.');
    // }

    if (messages?.length === 0) {
      apiCalling();
    } else {
      FlashMessageComponent('warning', strings(`Add_Incident.${messages[0]}`))
      // FlashMessageComponent('warning', messages[0])
    }
  };

  const apiCalling = () => {
    saveIncidentDetails();
    // uploadIncidentAttechment();
  };
  const uploadIncidentAttechment = (id) => {
    if (imgData?.length > 0) {
      try {
        const payload = imgData.map((ele) => {
          let obj = {
            WoAttachmentId: 0,
            CompanyId: userInfo?.CompanyId,
            AttachmentCategoryId: uploadedfrom === 'imageUpload' ? 67 : 68,
            AttachementTypeId: ele?.AttachementTypeId,
            Description: ele?.Description,
            CapturedDate: ele?.CapturedDate,
            FileName: ele?.filename,
            Attachment: ele?.ByteString,
            FilePath: ele?.imagePath,
            CreatedBy: userInfo?.sub,
            CreatedDate: ele?.CapturedDate,
            CreatedSourceId: 2,
            CreatedSourceLoginId: userInfo?.sub,
            TechId: userInfo?.sub,
            WorkOrderId: jobInformaaitions.WorkOrderId,
            WoJobId: jobInformaaitions.WoJobId,
            ContentType: ele?.imageType,
            referenceID: 0,
            SubCategoryId: 5,
            WOPunchPointsId: id != null ? id : 1,
            TimeZoneId: 2,
          };
          return obj;
        });
        const data = [
          {
            WoAttachmentId: 0,
            CompanyId: userInfo?.CompanyId,
            AttachmentCategoryId: uploadedfrom === 'imageUpload' ? 67 : 68,
            AttachementTypeId: -1,
            Description: '',
            CapturedDate: imaCaptureDate,
            FileName: imageName,
            Attachment: imageBaseversion,
            FilePath: imagefromPicker,
            CreatedBy: userInfo?.sub,
            CreatedDate: imaCaptureDate,
            CreatedSourceId: 2,
            CreatedSourceLoginId: userInfo?.sub,
            TechId: userInfo?.sub,
            WorkOrderId: jobInformaaitions.WorkOrderId,
            WoJobId: jobInformaaitions.WoJobId,
            ContentType: imageUploadedFrom,
            referenceID: 0,
            SubCategoryId: 5,
            WOPunchPointsId: id != null ? id : 1,
            TimeZoneId: 2,
          },
        ];
        const handleCallback = {
          success: (data) => {
            FlashMessageComponent('success', 'success');
            dispatch({ type: SET_LOADER_FALSE });
            navigation.goBack();

            // dispatch({type: SET_LOADER_FALSE});
          },
          error: (error) => {
            dispatch({ type: SET_LOADER_FALSE });
          },
        };
        const header = Header(token);
        api.uploadIncidentAttechment(payload, handleCallback, header);
      } catch (error) {
        dispatch({ type: SET_LOADER_FALSE });
      }
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <Loader visibility={loading} />
      <View style={{ flex: 1 }}>
        <HeaderComponents
          title={headerTitle}
          leftIcon={'Arrow-back'}
          navigation={navigation}
          headerTextStyle={styles.headerStyles}
          HeaderRightIcon={headerRightIcons}
        />
        {showAddMore ? (
          <AddMoreModal
            handleModalVisibility={toggleAddMore}
            visibility={showAddMore}
          />
        ) : null}
        <View style={styles.container}>
          <ScrollView>
            <LabelComponent
              label={strings('Add_Incident.Work_category')}
              required={true}
              style={styles.mgTop}
              labelStyle={styles.TxtInputLabel}
            />

            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={workCategory?.label}
              list={
                workCategoryItem?.length > 0 ? workCategoryItem : emptyDropDown
              }

              selectedItem={workCategory}
              handleSelection={(val) => { setworkCategory(val), setDrop1(false) }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownState={() => {
                setDrop1(!drop1);
                setDrop2(false);
                setDrop3(false)

              }}
              dropdownOpen={drop1}
              multiSelectDrop={true}
            />
            <LabelComponent
              label={strings('Add_Incident.Work_Request')}
              required={true}
              style={styles.mgTop}
              labelStyle={styles.TxtInputLabel}
            />
            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={workRequest?.label}
              list={
                workRequestItem?.length > 0 ? workRequestItem : emptyDropDown
              }
              selectedItem={workRequest}
              handleSelection={(val) => { setWorkRequest(val), setDrop2(false) }}
              // handleSelection={(val) => { setWorkRequest(val), setDrop2(false) }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownState={() => {
                setDrop2(!drop2);
                setDrop1(false);
                setDrop3(false)

              }}
              dropdownOpen={drop2}
              multiSelectDrop={true}
            />

            <LabelComponent
              label={strings('Add_Incident.Work_Type')}
              required={true}
              style={styles.mgTop}
              labelStyle={styles.TxtInputLabel}
            />

            <Dropdown
              style={styles.dropDownWrap}
              hasBorder={true}
              label={workType?.label}
              list={workTypeItem?.length > 0 ? workTypeItem : emptyDropDown}
              selectedItem={workType}
              handleSelection={(val) => { setworkType(val), setDrop3(false) }}
              zIndexVal={0}
              align={'flex-start'}
              placeholder={''}
              dropDownContainer={styles.dropDownContainerStyle}
              dropDownBodyContainer={styles.dropDownBodyContainerstyle}
              itemStyle={styles.dropdownTextStyle}
              dropdownState={() => {

                setDrop3(!drop3);
                setDrop2(false);
                setDrop1(false)

              }}
              dropdownOpen={drop3}
              multiSelectDrop={true}
            />

            <LabelComponent
              label={strings('Add_Incident.Attachment')}
              labelStyle={styles.TxtInputLabel}
              style={styles.mgTop}
            />

            <View style={styles.attechmentcontainer}>
              <View style={styles.attechment}>
                {imageName ? (
                  <>
                    <Text>{imageName}</Text>
                  </>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={
                  () =>
                    // navigation.navigate('Attachment', {
                    //   attchmentDetail: undefined,
                    //   edit: false,
                    //   type: undefined,
                    //   screenName: 'Incident Attachment',
                    // })
                    navigation.navigate('IncidentAttechment', {
                      data: title === strings('Add_Incident.Edit_Incidents') ? item : {},
                      imgData: imgData,
                      screenName: 'Incident Attachment',
                      Edit: title === strings('Add_Incident.Edit_Incidents') ? true : false,
                    })
                  // setOnToggleAttchment(!onToggleAttchment)
                }>
                {/* {route?.params?.title === 'Edit Incidents' ? null : ( */}
                {/* <AttchmentIcon
                    color="#ffffff"
                    height={normalize(18)}
                    width={normalize(18)}
                  /> */}
                {/* )} */}
                <AttchmentIcon
                  style={styles.userImage}
                  height={normalize(18)}
                  width={normalize(18)}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                />
                {attcahmentCount > 0 ? (
                  <>
                    <View style={[styles.notifyNumber,{backgroundColor:colors.PRIMARY_BACKGROUND_COLOR}]}>
                      <Text style={styles.whitecolor}>{attcahmentCount}</Text>
                    </View>
                  </>
                ) : null}
              </TouchableOpacity>
            </View>
            <LabelComponent
              label={strings('Add_Incident.Comments')}
              labelStyle={styles.TxtInputLabel}
              style={styles.mgTop}
            />

            <TextInput
              placeholder=""
              multiline={true}
              onChangeText={(text) => {
                setComments(text);
              }}
              value={comments}
              style={styles.commentStyle}
            />
          </ScrollView>
        </View>
        <PairButton
          title1={strings('pair_button.cancel')}
          title2={route?.params?.title == strings('Add_Incident.Edit_Incidents')
            ? strings('pair_button.update')
            : strings('pair_button.add')}
          onPressBtn1={() => navigation.goBack()}
          onPressBtn2={() => {
            route?.params?.title == strings('Add_Incident.Edit_Incidents')
              ? editIncidentDetails()
              : validation();
          }}
          containerStyle={{ marginVertical: normalize(15) }}
        />
      </View>
      {/* <View style={{justifyContent: 'center'}}>
        <ModalContainer
          visibility={onToggleAttchment}
          containerStyles={styles.modalContainerStyles}
          handleModalVisibility={() => setOnToggleAttchment(false)}>
          <View>
            <AttchmentPickerComponent
              onSelectFromCamera={_handleNavigationOnCamera}
              onSelectGallery={_handleNavigationOnGallery}
              onSelectDoc={_handleNavigationOnDocument}
              containerStyle={{
                margin: normalize(30),
                backgroundColor: 'white',
              }}
            />
          </View>
        </ModalContainer>
      </View> */}
      <Loader visibility={isLoading} />
    </View>
  );
};

export default MainHoc(AddIncident);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    marginVertical: normalize(10),
    marginHorizontal: normalize(18),
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  TxtInputLabel: {
    fontSize: normalize(15),
    marginTop: normalize(17),
    color: '#252525',
    fontFamily: fontFamily.regular,
  },

  dropdownstyle: {
    width: width * 0.95,
    height: height * 0.05,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 15,
  },

  attechment: {
    width: width * 0.82,
    height: height * 0.06,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 5,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attechmentcontainer: {
    width: width * 0.9,
    height: height * 0.05,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentStyle: {
    width: width * 0.9,
    height: height * 0.12,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: '#D9D9D9',
    marginVertical: 5,
    paddingHorizontal: 9,
    alignSelf: 'center',
    textAlignVertical: 'top',
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  },
  mendatorycolor: {
    color: '#FF0000',
  },
  buttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4E4E4',
    borderRadius: 40,
  },
  savebuttonStyle: {
    width: width * 0.43,
    height: height * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002C71',
    borderRadius: 40,
  },
  dropDownWrap: {
    borderBottomColor: Colors.borderColor,
    borderRadius: normalize(10),
  },
  dropdownTextStyle: {
    fontFamily: fontFamily.semiBold,
    paddingLeft: normalize(5),
    padding: normalize(5),
    color: Colors.black,
  },
  dropDownBodyContainerstyle: {
    borderColor: Colors.darkSecondaryTxt,
    elevation: 10,
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(10),
  },
  mgTop: {
    marginTop: normalize(15),
    marginLeft: normalize(5),
  },
  modalContainerStyles: {
    borderRadius: normalize(8),
  },
  userImage: {
    alignSelf: 'center',
    marginHorizontal: normalize(10),
    color: Colors?.primaryColor
  },
  notifyNumber: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(15),
    // right:normalize(28),
    
    // backgroundColor: '#17499E',
    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whitecolor: {
    color: Colors?.white,
    fontSize: normalize(10),
  },
});
