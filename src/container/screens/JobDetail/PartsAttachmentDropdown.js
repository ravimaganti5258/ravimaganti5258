import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  AttachmentDateIcon,
  AttachmentDropdown,
  AttachmentIcon,
  DeleteWhiteIcon,
  EditWhiteIcon,
  FormsDropdownIcon,
  PartsIcon,
  PartsQuantityIcon,
  PlusIcon,
  PDF_ICON,
  PPT_ICON,
  DOC_Icon,
  XLM_Icon,
  CSV_Icon,
  NO_Icon,
  TXT_Icon,
  doc,
} from '../../../assets/img';
import { Colors } from '../../../assets/styles/colors/colors';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import SwipeableComponent from '../../../components/Swipeable';
import { useColors } from '../../../hooks/useColors';
import api from '../../../lib/api';
import { Header } from '../../../lib/buildHeader';
import { dateFormat, fontFamily, normalize } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
// import {decodeBase64} from '../../../util/helper';
import RNFetchBlob from 'rn-fetch-blob';

//add imagepreviewmodel
import { ImgPreviewModal } from '../../../components/ImagePreviewModal/index.js';
import { pendingApi } from '../../../redux/pendingApi/action';
import { _deleteFormLocally } from '../../../database/JobDetails/addChecklist';
import { useNetInfo } from '../../../hooks/useNetInfo';
import { saveJobDetails } from '../../../redux/jobDetails/action';
import { fetchjobDeailsPerId, fetchJobDetailsData } from '../../../database/JobDetails';
import { useIsFocused } from '@react-navigation/native';
import { _deletePartLocally } from '../../../database/JobDetails/parts';
import { getStatus } from '../../../lib/getStatus';
import { accessPermission } from '../../../database/MobilePrevi';

const CommonDropdown = ({
  iconHeight = 16,
  iconWidth = 16,
  Icon,
  title,
  countNumber,
  onPress,
  hasData,
}) => {
  return (
    <View style={{ paddingVertical: normalize(20) }}>
      <TouchableOpacity
        activeOpacity={hasData ? 0.8 : 1}
        style={[styles.dropDownContainer]}
        onPress={hasData ? onPress : undefined}>
        <View style={styles.iconContainer}>
          <Icon
          // fill = 
            color={Colors?.secondryBlack}
            height={normalize(iconHeight)}
            width={normalize(iconWidth)}
          />
          <Text style={styles?.partsTxt}>
            {title} {hasData ? `(${countNumber})` : ''}
          </Text>
        </View>
        {hasData ? (
          <AttachmentDropdown
            fill={Colors?.secondryBlack}
            height={normalize(7)}
            width={normalize(11)}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );
};
//icon component
const DocumentIcon = (fileExt, imgName) => {
  let icon = <PDF_ICON style={styles.iconStyle} />;
  switch (fileExt) {
    case 'jpg':
      icon =  <Image
      source={{ uri: imgName }}
      style={styles.partsImageStyle}
    />;
      break;
    case 'png':
      icon =   <Image
      source={{ uri: imgName }}
      style={styles.partsImageStyle}
    />;
      break;
    case 'ppt':
      icon = <PPT_ICON style={styles.iconStyle} />;
      break;
    case 'pdf':
      icon = <PDF_ICON style={styles.iconStyle} />;
      break;
    case 'jpeg':
      icon =   <Image
      source={{ uri: imgName }}
      style={styles.partsImageStyle}
    />;
      break;
    case 'xls':
    case 'xlsx':
    case 'xlm':
      icon = <XLM_Icon style={styles.iconStyle} />;
      break;
    case 'jgp':
      icon = <PDF_ICON style={styles.iconStyle} />;
      break;
    case 'doc':
      icon = <DOC_Icon style={styles.iconStyle} />;
      break;
    case 'docx':
      icon = <DOC_Icon style={styles.iconStyle} />;
      break;
    default:
      icon = <DOC_Icon style={styles.iconStyle} />;
      break;
  }
  return icon;
};
const PartsRenderItem = ({
  item,
  index,
  row,
  isAccept,
  submittedSource,
  navigation,
  token,
  getWorkOrderAppointment,
  callback,
  userInfo,
  localUpadationCb,
  // closeRow = () => null,
  permissionEdit = '',
  permissionDelete = ''
}) => {
  const { isInternetReachable } = useNetInfo();
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  
  const [permission, setPermission] = useState({});
  useEffect(() => {
    accessPermission('Parts').then((res) => {
      setPermission(res)
    })
  }, []);
  const bottons2 = [
    {
      title: strings('add_part.Cancel'),
      style: { backgroundColor:  Colors.darkGray, txtSize: normalize(12) },
      SvgIcon: () => (
        <DeleteWhiteIcon height={normalize(21)} width={normalize(21)} />
      ),
    },
  ];
  const buttons = [
    {
      title: strings('add_part.Edit'),
      action: () => permissionEdit ? handleEdit() : null,
      style: { backgroundColor: permissionEdit ? Colors.blue : Colors.darkGray, txtSize: normalize(12) },
      SvgIcon: () => (
        <EditWhiteIcon height={normalize(16)} width={normalize(16)} />
      ),
    },
    {
      title: strings('add_part.Cancel'),
      action: () => permissionDelete ? handleCancel() : null,
      style: { backgroundColor: permissionDelete ? Colors.deleateRed : Colors.darkGray, txtSize: normalize(12) },
      SvgIcon: () => (
        <DeleteWhiteIcon height={normalize(21)} width={normalize(21)} />
      ),
    },
  ];
  const [swiperIndex, setSwiperIndex] = useState('');
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const handleCancel = () => {
    try {
      row[index]?.close();
      toggleShowDeleteModal();
    } catch (error) { }
  };
  const handleEdit = () => {
    setSwiperIndex(index);
    try {
      row[index]?.close();
      navigation.navigate('AddParts', {
        partsData: item,
        technicianJobInformation:jobDetail,
        partsType: item?.type,
        jobId:item?.WoJobId,
        edit: true,
        getWorkOrderAppointment:getWorkOrderAppointment
      });
    } catch (error) { }
  };
  let testArr = [];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const handleDeleteParts = (value) => {
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        loginid: userInfo?.sub,
        PartRequestId: [
          {
            WoJobId: item?.WoJobId,
            PartNo: item?.PartNo,
            PartRequestNo: item?.PartRequestNo,
            Description: item?.Description,
            PartReqStatus: item?.PartReqStatus,
            RequestedQty: item?.RequestedQty,
            PartId: item?.PartId,
            PartReqStatusId: 5,
            PartRequestId: item?.PartRequestId,
            AttachmentExists: item?.AttachmentExists,
            ApprovalStatus: item?.ApprovalStatus,
            ApprovalStatusId: item?.ApprovalStatusId,
            IsBOQRequest: item?.IsBOQRequest,
            VendorId: item?.VendorId,
            ApproveReason: item?.ApproveReason,
            ApprovedQty: item?.ApprovedQty,
          },
        ],

        SourceID: 2,
      };
      const handleCallback = {
        success: (res) => {
          const msgCode = res?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
          callback();
          toggleShowDeleteModal();
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
          toggleShowDeleteModal();
        },
      };

      let headers = Header(token);
      if (isInternetReachable) {
        api.cancelParts(data, handleCallback, headers);
      }
      else {
        let obj = {
          id: stateInfo.pendingApi.length + 1,
          url: 'deletePart',
          data: data,
          jobId: item?.WoJobId
          // endPoint: endPoint
        };
        let apiArr = [...stateInfo?.pendingApi]
        apiArr.push(obj)
        dispatch(pendingApi(apiArr));
      FlashMessageComponent('success', strings(`Response_code.${1003}`));
      }
    _deletePartLocally(value);
    localUpadationCb()
  }catch (e) {}
  };
  // const handleDeleteParts = () => {
  //   try {
  //     const data = {
  //       CompanyId: userInfo?.CompanyId,
  //       loginid: userInfo?.sub,
  //       PartRequestId: [
  //         {
  //           WoJobId: item?.WoJobId,
  //           PartNo: item?.PartNo,
  //           PartRequestNo: item?.PartRequestNo,
  //           Description: item?.Description,
  //           PartReqStatus: item?.PartReqStatus,
  //           RequestedQty: item?.RequestedQty,
  //           PartId: item?.PartId,
  //           PartReqStatusId: 5,
  //           PartRequestId: item?.PartRequestId,
  //           AttachmentExists: item?.AttachmentExists,
  //           ApprovalStatus: item?.ApprovalStatus,
  //           ApprovalStatusId: item?.ApprovalStatusId,
  //           IsBOQRequest: item?.IsBOQRequest,
  //           VendorId: item?.VendorId,
  //           ApproveReason: item?.ApproveReason,
  //           ApprovedQty: item?.ApprovedQty,
  //         },
  //       ],

  //       SourceID: 2,
  //     };
  //     const handleCallback = {
  //       success: (res) => {
  //         const msgCode = res?.Message?.MessageCode;
  //         FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
  //         callback();
  //         toggleShowDeleteModal();
  //       },
  //       error: (error) => {
  //         FlashMessageComponent(
  //           'reject',
  //           error?.error_description
  //             ? error?.error_description
  //             : 'something went wrong',
  //         );
  //         toggleShowDeleteModal();
  //       },
  //     };

  //     const header = Header(token);
  //     api.cancelParts(data, handleCallback, header);
  //   } catch (e) {}
  // };

  //  const closeRow=(index) => {

  //     if (prevOpenedRow && prevOpenedRow !== row[index]) {
  // 		prevOpenedRow.close();
  //     }
  //     prevOpenedRow = row[index];
  // }
  let prevOpenedRow;
  let row2;
  const closeRow = () => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];

  };


  var test = -1;

  return (
    <View style={styles.dividerStyles}>
      {item?.PartReqStatus == 'Allocated' ||
        item?.PartReqStatus == 'Cancelled' ? (
        <SwipeableComponent
          containerStyle={{
            elevation: 0,
            borderRadius: 0,
            marginTop: index == 0 ? 0 : normalize(10),
            borderRadius: normalize(10),
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors?.white,
          }}
          // ref={swipeRef}
          enabled={isAccept == 1 && submittedSource != 2 ? true : false}
          openedRowIndex={test}
          buttons={bottons2}
          index={index}
          rowOpened={(index) => {
            closeRow(index);
          }}
          // onswipleOpen={closeRow(index)}
          row={row}
          style={styles.renderItemContainer}>
          <View style={{ backgroundColor: Colors?.appGray,paddingLeft: I18nManager.isRTL? normalize(10) : null }}>
            <View style={[styles?.dropDownContainer, { paddingVertical: 0 }]}>
              <Text
                style={[
                  styles.commonTxtStyles,
                  {
                    marginTop: index == 0 ? 0 : normalize(20),
                    marginBottom: normalize(15),
              
                  },
                ]}>
                {strings('add_part.Part_Request')}
                {item?.PartRequestNo}
              </Text>
              <View style={styles?.iconContainer}>
                <PartsQuantityIcon
                  height={normalize(17)}
                  width={normalize(14)}
                />
                <Text
                  style={[
                    styles.partsTxt,
                    { marginRight: normalize(10) },
                    { textAlign: 'left' },
                  ]}>
                  {item?.RequestedQty}
                </Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              {item?.image ? (
                <View style={{ borderRadius: normalize(10) }}>
                  <Image
                    resizeMode={'cover'}
                    source={{ uri: item?.image }}
                    style={styles.partsImageStyle}
                  />
                </View>
              ) : null}
              <View style={{ marginLeft: item?.image ? normalize(10) : 0 }}>
                <Text style={styles.commonTxtStyles}># {item?.PartNo}</Text>
                <Text style={styles.commonTxtStyles}>{item?.Description}</Text>
                <Text
                  style={[styles.commonTxtStyles, { fontSize: normalize(13) }]}>
                  {item?.ApprovalStatus}
                </Text>
                <Text
                  style={[
                    styles.commonTxtStyles,
                    {
                      fontFamily: fontFamily.bold,
                      color:
                        item?.PartReqStatus == 'Allocated'
                          ? Colors?.successGreen
                          : Colors?.dangerRed,
                    },
                  ]}>
                  {item?.PartReqStatus}
                </Text>
              </View>
            </View>
          </View>
        </SwipeableComponent>
      ) : (
        <SwipeableComponent
          rowOpened={(index) => {
            closeRow(index);
          }}
          containerStyle={{
            elevation: 0,
            borderRadius: 0,
            marginTop: index == 0 ? 0 : normalize(10),
            borderRadius: normalize(10),
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors?.white,
           
          }}
          enabled={isAccept == 1 && submittedSource != 2 ? true : false}
          buttons={buttons}
          index={index}
          row={row}
          style={styles.renderItemContainer}>
          <View style={{ backgroundColor: Colors?.appGray,
            paddingLeft: I18nManager.isRTL? normalize(10) : null
            }}>
            <View style={[styles?.dropDownContainer, { paddingVertical: 0 }]}>
              <Text
                style={[
                  styles.commonTxtStyles,
                  {
                    marginTop: index == 0 ? 0 : normalize(20),
                    marginBottom: normalize(15),
                  },
                ]}>
                {strings('add_part.Part_Request')} {item?.PartRequestNo}
              </Text>
              <View style={styles?.iconContainer}>
                <PartsQuantityIcon
                  height={normalize(17)}
                  width={normalize(14)}
                />
                <Text style={[styles.partsTxt, { marginRight: normalize(10) }]}>
                  {item?.RequestedQty}
                </Text>
              </View>
            </View>
            <View style={styles.iconContainer}>
              {item?.image ? (
                <View style={{ borderRadius: normalize(10) }}>
                  <Image
                    resizeMode={'cover'}
                    source={{ uri: item?.image }}
                    style={styles.partsImageStyle}
                  />
                </View>
              ) : null}
              <View style={{ marginLeft: item?.image ? normalize(10) : 0 }}>
                <Text style={styles.commonTxtStyles}># {item?.PartNo}</Text>
                <Text style={styles.commonTxtStyles}>{item?.Description}</Text>
                <Text
                  style={[styles.commonTxtStyles, { fontSize: normalize(13) }]}>
                  {item?.ApprovalStatus}
                </Text>
                <Text
                  style={[
                    styles.commonTxtStyles,
                    {
                      fontFamily: fontFamily.bold,
                      color:
                        item?.PartReqStatus == 'Allocated' ||
                          item?.PartReqStatus == 'Installed'
                          ? Colors?.successGreen
                          : Colors?.dangerRed,
                    },
                  ]}>
                  {item?.PartReqStatus}
                </Text>
              </View>
            </View>
          </View>
        </SwipeableComponent>
      )}
      {showDeleteModal ? (
        <ConfirmationModal
          visibility={showDeleteModal}
          handleModalVisibility={toggleShowDeleteModal}
          // handleConfirm={toggleShowDeleteModal}
          handleConfirm={() => permission?.Delete && handleDeleteParts()}
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
          permission={permission?.Delete}
        />
      ) : null}
    </View>
  );
};

const AttachmentRenderItem = ({
  item,
  index,
  row,
  isAccept,
  submittedSource,
  onPressDelete,
  onPressEdit,
  navigation,
  getAttachments,
  token,
  data,
  techId,
  closeRow = () => null,

}) => {


  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );

  const buttons = [
    {
      title: strings('attachments.Edit'),
      action: () => handleEdit(),
      style: { backgroundColor: Colors.blue, txtSize: normalize(12) },
      SvgIcon: () => (
        <EditWhiteIcon height={normalize(16)} width={normalize(16)} />
      ),
    },

  ];
  const buttons2 = [
    {
      title: strings('attachments.Edit'),
      action: () => handleEdit(),
      style: { backgroundColor: Colors.blue, txtSize: normalize(12) },
      SvgIcon: () => (
        <EditWhiteIcon height={normalize(16)} width={normalize(16)} />
      ),
    },
    {
      title: strings('attachments.Delete'),
      action: () => handleCancel(),
      style: { backgroundColor: Colors.deleateRed, txtSize: normalize(12) },
      SvgIcon: () => (
        <DeleteWhiteIcon height={normalize(21)} width={normalize(21)} />
      ),
    },
  ];

  const handleCancel = () => {
    try {
      row[index]?.close();
      toggleShowDeleteModal();
    } catch (error) { }
  };
  const handleEdit = () => {
    try {
      row[index]?.close();
      //downlaod iamge
      //const iospath=`${RNFetchBlob.fs.dirs.DocumentDir}/test.png`;
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/test.png`;
      RNFetchBlob.fs.writeFile(path, item?.AttachmentTumbnail, 'base64');

      navigation.navigate('AddAttachment', {
        attchmentDetail: item,
        edit: true,
        //Adding type condition for photo and document
        //type: item?.AttachementCategoryType,
        type:
          item?.AttachementCategoryType == 'Photo'
            ? 'imageUpload'
            : 'docUpload',
        screenName: strings('attachments.edit_attachment'),
        //Adding path for android issue
        Path: path,
        formDetail: {},
      });
    } catch (error) { }
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  const [showImage, setShowImage] = useState(false);


  const toggleShowImage = () => {
    setShowImage(!showImage);
  };

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteAttachment = () => {
    try {
      const data = {
        CompanyId: item?.CompanyId,
        JobId: [item?.WoJobId],
      };
      const handleCallback = {
        success: (res) => {
          getAttachments();
          toggleShowDeleteModal();
          const msgCode = res?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        },
        error: (error) => {
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
          toggleShowDeleteModal();
        },
      };
      const endPoint = `?CompanyId=${item?.CompanyId}&WoAttachmentId=${item?.WoAttachmentId}`;
      const header = Header(token);
      api.deleteAttachments(data, handleCallback, header, endPoint);
    } catch (error) {
      toggleShowDeleteModal();
    }
  };
  const onPressThumbnail = () => {
    setShowIndicator(true);
    try {
      setShowImage(true);
      setShowIndicator(false);
      const handleCallback = {
        success: (res) => {
          // base64Data=res.byteData;
          // navigation.navigate('AttachmentList', {
          //   title: 'Attachment List',
          //   data: [res],
          // });
          // setShowIndicator(false);
        },
        error: (err) => {
          setShowIndicator(false);
        },
      };
      const endPoint = `?CompanyId=${item?.CompanyId}&WoAttachmentId=${item?.WoAttachmentId}`;
      const header = Header(token);
      api.jobAttachmentDownload('', handleCallback, header, endPoint);
    } catch (error) {
      setShowIndicator(false);
    }
  };
  const base64Image = item?.AttachmentTumbnail
    ? `data:image/png;base64,${item?.AttachmentTumbnail}`
    : undefined;

  //changing the document icon using useeffect
const imgName = `data:image/png;base64,${item?.AttachmentTumbnail}`
  const filename = item?.FileName;
  const filetype =
    filename.substring(filename.lastIndexOf('.') + 1, filename?.length) ||
    filename;
  return (
    <View style={styles.dividerStyles}>
      {showImage ? (
        <ImgPreviewModal
          visibility={showImage}
          handleModalVisibility={toggleShowImage}
          containerStyles={styles.img}
          source={{ uri: base64Image }}
          data={data}
          index={index}
          type={'Normal Attachment'}
        />
      ) : null}

      <SwipeableComponent
        containerStyle={{
          elevation: 0,
          borderRadius: 0,
          marginTop: index == 0 ? 0 : normalize(20),
          borderRadius: normalize(10),
          shadowOffset: { width: 0, height: 0 },
          shadowColor: Colors?.white,
        }}
        buttons={item?.CreatedBy === jobDetail?.TechId ? buttons2 : buttons}
        index={index}
        row={row}
        rowOpened={(index) => {
          closeRow(index);
        }}
        enabled={isAccept == 1 && submittedSource != 2 ? true : false}
        style={styles.renderItemContainer}>
        <View style={{ backgroundColor: Colors?.appGray,paddingLeft:I18nManager.isRTL? normalize(10) : null }}>
          <View
            style={[styles?.dropDownContainer, { paddingVertical: 0 }]}></View>
          <View style={{ flexDirection: 'row' }}>
            {item?.AttachmentTumbnail ? (
              <TouchableOpacity
                style={{ opacity: showIndicator ? 0.5 : null }}
                onPress={
                  isAccept == 1
                    ? () => {
                      onPressThumbnail();
                    }
                    : null
                }>
                <Image
                  source={{ uri: base64Image }}
                  style={styles.partsImageStyle}
                />
                <ActivityIndicator
                  animating={showIndicator}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                  color={Colors?.blue}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={{ marginRight: normalize(6), marginLeft: normalize(5) }}>
                {DocumentIcon(filetype)}
              </View>

              //    <Image
              //     source={{

              //      uri: 'https://images.fineartamerica.com/images-medium-large-5/close-up-of-mechanical-parts-rory-turnbull--eyeem.jpg',
              //     }}
              //     style={styles.partsImageStyle}
              //   />
            )}
            <View
              style={{
                marginLeft: normalize(10),
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <View>
                <Text
                  style={[
                    styles.commonTxtStyles,
                    {
                      fontFamily: fontFamily.semiBold,
                      paddingLeft: normalize(5),
                      textAlign: 'left',
                    },
                  ]}>
                  {item?.FileName}
                </Text>
                {item?.Description != '' &&
                  <Text
                    style={{
                      fontSize: normalize(13),
                      marginLeft: normalize(6),
                      color: Colors?.lightSecondaryTxt,
                      textAlign: 'left',
                    }}>
                    {item?.Description}
                  </Text>}
              </View>
              {item?.Longitude && item?.Latitude ? (
                <Text
                  numberOfLines={1}
                  style={
                    styles?.latLongTxtStyle
                  }>{`Lat - ${item?.Latitude}    Long - ${item?.Longitude}`}</Text>
              ) : null}
            </View>
          </View>
          <View
            style={[styles.iconContainer, styles.attachmentDateContainer]}>
            <AttachmentDateIcon
              fill={Colors?.latLongTxtColor}
              height={normalize(19)}
              width={normalize(18)}
            />
            <Text style={styles.attachmentDateStyles}>
              {/* {item?.CapturedDate} */}
              {dateFormat(item?.CapturedDate, 'DD/MM/YYYY HH:MM:MS 12TF')}
            </Text>
          </View>
        </View>
      </SwipeableComponent>
      {/* ) : ( */}

      {/* )} */}

      {showDeleteModal ? (
        <ConfirmationModal
          visibility={showDeleteModal}
          handleModalVisibility={toggleShowDeleteModal}
          handleCancle={toggleShowDeleteModal}
          handleConfirm={handleDeleteAttachment}
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
        />
      ) : null}
    </View>
  );
};

const FormRenderItem = ({
  item,
  index,
  row,
  isAccept,
  submittedSource,
  navigation,
  callback,
  getJobCheckList,
  localUpadationCb,
  token,
  userInfo,
  onPressFormSave,
  closeRow = () => null
}) => {
  const buttons = [
    {
      title: strings('attachments.Delete'),
      action: () => handleDelete(),
      style: { backgroundColor: Colors.deleateRed, txtSize: normalize(12) },
      SvgIcon: () => (
        <DeleteWhiteIcon height={normalize(18)} width={normalize(18)} />
      ),
    },
  ];
  const buttons2 = [
    {
      title: strings('add_part.Edit'),
      // action: () =>  handleEdit(),
      style: { backgroundColor: Colors.blue , txtSize: normalize(12) },
      SvgIcon: () => (
        <EditWhiteIcon height={normalize(16)} width={normalize(16)} />
      ),
    },
  ];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isConnected, isInternetReachable } = useNetInfo();
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  
  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const handleDelete = () => {
    try {
      row[index]?.close();
      toggleShowDeleteModal();
    } catch (error) { }
  };
  const dispatch = useDispatch();
  const handleDeleteForm = (value) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        CompanyId: item?.CompanyId,
        JobId: [item?.WoJobId],
      };
      const endPoint = `?CompanyId=${item?.CompanyId}&woJobId=${item?.WoJobId}&WoJobChklistId=${item?.WoJobChklistId}&ChkMastId=${item?.ChklistMastId}&LoginId=${userInfo?.sub}`;
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
              callback();
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
          }
          toggleShowDeleteModal();
          getJobCheckList();
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (responseErrorCkList) => {
          toggleShowDeleteModal();
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
      let headers = Header(token);
      if (isInternetReachable) {
        api.deleteCheckList(data, handleCallback, headers, endPoint);
      }
      else {
        let obj = {
          id: stateInfo.pendingApi.length + 1,
          url: 'deleteForm',
          data: data,
          jobId: item?.WoJobId,
          endPoint: endPoint
        };
        let apiArr = [...stateInfo?.pendingApi]
        apiArr.push(obj)
        dispatch(pendingApi(apiArr));
      FlashMessageComponent('success', strings(`Response_code.${1003}`));
      }
    } catch (error) {
      console.log({ error });
      toggleShowDeleteModal();
      dispatch({ type: SET_LOADER_FALSE });
    }
    _deleteFormLocally(value);
    localUpadationCb()
  };
  return (
    <>
      {jobDetail?.TechId === item?.CreatedBy ? (
        <SwipeableComponent
          containerStyle={{
            marginTop: index == 0 ? 0 : normalize(15),
            borderRadius: normalize(5),
          }}
          buttons={buttons}
          index={index}
          enabled={isAccept == 1 && submittedSource != 2 ? true : false}
          row={row}
          rowOpened={(index) => {
            closeRow(index);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              (isAccept == 1 && submittedSource != 2) && onPressFormSave(item.ChklistName, item)
            }
            style={styles?.formCardView}>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.formDotStyles,
                  {
                    backgroundColor:
                      item?.Mandatory != 0
                        ? Colors?.deleateRed
                        : Colors?.darkGray,
                  },
                ]}
              />
              <View>
                <Text style={styles.formTitle} numberOfLines={1}>
                  {item?.ChklistName}
                </Text>
                <Text style={[styles?.latLongTxtStyle]} numberOfLines={1}>
                  {item?.Description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableComponent>
      ) : (
        <SwipeableComponent
          containerStyle={{
            marginTop: index == 0 ? 0 : normalize(15),
            borderRadius: normalize(5),
          }}
           enabled={false}
           buttons={buttons2}
          index={index}
          enabled={false}
          // enabled={isAccept == 1 && submittedSource != 2 ? true : false}
          row={row}
          rowOpened={(index) => {
            closeRow(index);
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              (isAccept == 1 && submittedSource != 2) && onPressFormSave(item.ChklistName, item)
            }
            style={styles?.formCardView}>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.formDotStyles,
                  {
                    backgroundColor:
                      item?.Mandatory != 0
                        ? Colors?.deleateRed
                        : Colors?.darkGray,
                  },
                ]}
              />
              <View>
                <Text style={styles.formTitle} numberOfLines={1}>
                  {item?.ChklistName}
                </Text>
                <Text style={[styles?.latLongTxtStyle]} numberOfLines={1}>
                  {item?.Description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </SwipeableComponent>
      )}

      {showDeleteModal ? (
        <ConfirmationModal
          visibility={showDeleteModal}
          handleModalVisibility={toggleShowDeleteModal}
          handleCancle={toggleShowDeleteModal}
          handleConfirm={()=>handleDeleteForm(item)}
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
        />
      ) : null}
    </>
  );
};

const NoRecodFoundContainer = () => {
  return (
    <View>
      <Text style={styles.noRecordTxt}>No Records found</Text>
    </View>
  );
};

const AddContent = ({ title, onPress, color }) => {
  return (
    <TouchableOpacity
      style={[styles.addContentStyles, styles.iconContainer]}
      onPress={onPress}
      activeOpacity={0.8}>
      <PlusIcon height={normalize(10)} width={normalize(10)} fill={color} />
      <Text style={[styles?.addTextStyles, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const PartsAttachmentDropdown = ({
  data,
  onAdd,
  type,
  isAccept,
  submittedSource,
  navigation,
  onPressEdit,
  onPressDelete,
  getJobCheckList,
  localUpadationCb,
  getWorkOrderAppointment,
  getList,
  onPressFormSave,
}) => {
  const [expand, setExpand] = useState(false);
  const [permission, setPermission] = useState({});
  const toggleDropDown = () => {
    setExpand(!expand);
  };
  let row = [];
  let prevOpenedRow;


  let formRow = [];
  let attachmentRow = [];
  const closeRow = (index, type) => {
    if (type == 'Part') {
      if (prevOpenedRow && prevOpenedRow != row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    }
    else if (type == 'Attachment') {
      if (prevOpenedRow && prevOpenedRow != attachmentRow[index]) {
        prevOpenedRow.close();
      }

      prevOpenedRow = attachmentRow[index];
    }
    else if (type == 'Form') {
      if (prevOpenedRow && prevOpenedRow != formRow[index]) {
        prevOpenedRow.close();
      }

      prevOpenedRow = formRow[index];
    }
  };

  const { colors } = useColors();

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetail = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const editable = getStatus('forms', jobDetail?.JobStatus);

  useEffect(() => {
    accessPermission('Parts').then((res) => {
      setPermission(res)
    })
  }, [])

  switch (type) {
    case 'parts': {
      return (
        <>
          <CommonDropdown
            Icon={PartsIcon}
            expand={expand}
            setExpand={setExpand}
            title={strings('add_part.parts')}
            countNumber={data?.length}
            onPress={toggleDropDown}
            hasData={data?.length > 0}
          />
          {data?.length == 0 || data == null || data == undefined ? (
            <View style={styles.dropDownContainer}>
              <NoRecodFoundContainer/>
                <AddContent
                  title={strings('add_part.Add_Parts')}
                  color={permission?.Add ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray}
                  onPress={permission?.Add && submittedSource != 2 && isAccept == 1? onAdd : null}
                />
            </View>
          ) : null}
          {expand ? (
            <>
              <View>
                {data.map((parts, index) => {
                  return (
                    <PartsRenderItem
                      item={parts}
                      index={index}
                      key={`ID-${index}`}
                      isAccept={isAccept}
                      submittedSource={submittedSource}
                      row={row}
                      closeRow={(index) => closeRow(index, "Part")}
                      prevOpenedRow={prevOpenedRow}
                      navigation={navigation}
                      onAdd={permission?.Add ? onAdd : null}
                      token={token}
                      callback={getList}
                      getWorkOrderAppointment={getWorkOrderAppointment}
                      userInfo={userInfo}
                      localUpadationCb={localUpadationCb}
                      permissionEdit={permission?.Edit}
                      permissionDelete={permission?.Delete}
                    />
                  );
                })}
              </View>
              {data?.length > 0 ? (
                <AddContent
                  title={strings('add_part.Add_Parts')}
                  color={permission?.Add ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray}
                  onPress={permission?.Add && submittedSource != 2 && isAccept == 1? onAdd : null}
                />
              ) : null}
            </>
          ) : null}
        </>
      );
    }
    case 'attachments': {
      return (
        <>
          <CommonDropdown
            Icon={AttachmentIcon}
            expand={expand}
            setExpand={setExpand}
            title={strings('attachments.header_title')}
            countNumber={data?.length}
            onPress={toggleDropDown}
            hasData={data?.length > 0}
            iconHeight={normalize(18)}
            iconWidth={normalize(16)}
          />
          {data?.length == 0 || data == null || data == undefined ? (
            <View style={styles.dropDownContainer}>
              <NoRecodFoundContainer />
                <AddContent
                  title={strings('attachments.add_attachment')}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                  onPress={submittedSource != 2 && isAccept == 1? onAdd:null}
                />
            </View>
          ) : null}
          {expand ? (
            <>
              <View>
                {data.map((attachment, index) => {
                  return (
                    <AttachmentRenderItem
                      item={attachment}
                      index={index}
                      key={`ID-${index}`}
                      isAccept={isAccept}
                      submittedSource={submittedSource}
                      row={attachmentRow}
                      onPressDelete={onPressDelete}
                      onPressEdit={onPressEdit}
                      navigation={navigation}
                      getAttachments={getList}
                      token={token}
                      data={data}
                      techId={jobDetail?.TechId}
                      closeRow={(index) => closeRow(index, "Attachment")}

                    />
                  );
                })}
              </View>
              {data?.length > 0 ? (
                <AddContent
                  title={strings('attachments.add_attachment')}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                  onPress={submittedSource != 2 && isAccept == 1? onAdd:null}
                />
              ) : null}
            </>
          ) : null}
        </>
      );
    }
    case 'forms': {
      return (
        <>
          <CommonDropdown
            Icon={FormsDropdownIcon}
            expand={expand}
            setExpand={setExpand}
            title={strings('forms.header_title')}
            countNumber={data?.length}
            onPress={toggleDropDown}
            hasData={data?.length > 0}
            iconHeight={normalize(18)}
            iconWidth={normalize(16)}
          />
          {data?.length == 0 || data == null || data == undefined ? (
            <View style={styles.dropDownContainer}>
              <NoRecodFoundContainer />
                <AddContent
                  title={strings('forms.Add_Form')}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                  onPress={submittedSource != 2 && isAccept == 1?onAdd:null}
                />
            </View>
          ) : null}
          {expand ? (
            <>
              <View>
                {data.map((form, index) => {
                  return (
                    <FormRenderItem
                      item={form}
                      index={index}
                      key={`ID-${index}`}
                      isAccept={isAccept}
                      submittedSource={submittedSource}
                      row={formRow}
                      navigation={navigation}
                      callback={getList}
                      getJobCheckList={getJobCheckList}
                      token={token}
                      onPressFormSave={onPressFormSave}
                      userInfo={userInfo}
                      localUpadationCb={localUpadationCb}
                      closeRow={(index) => closeRow(index, "Form")}
                    />
                  );
                })}
              </View>
              {data?.length > 0 ? (
                <AddContent
                  title={strings('forms.Add_Form')}
                  color={colors?.PRIMARY_BACKGROUND_COLOR}
                  onPress={submittedSource != 2 && isAccept == 1?onAdd:null}
                />
              ) : null}
            </>
          ) : null}
        </>
      );
    }
  }
};

export default PartsAttachmentDropdown;

const styles = StyleSheet.create({
  dropDownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partsTxt: {
    fontSize: normalize(14),
    fontFamily: fontFamily.bold,
    marginLeft: normalize(10),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownBtn: {
    padding: normalize(10),
  },
  partsImageStyle: {
    height: normalize(85),
    width: normalize(99),
    borderRadius: normalize(10),
  },
  renderItemContainer: {
    paddingHorizontal: normalize(20),
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(20),
    borderBottomColor: Colors?.borderColor,
    // backgroundColor:'gray'
  },
  commonTxtStyles: {
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginBottom: normalize(5),
    textAlign: 'left',
  },
  noRecordTxt: {
    fontSize: normalize(13),
    color: Colors?.darkGray,
  },
  addContentStyles: {
    alignSelf: 'flex-end',
    marginTop: normalize(10),
  },
  addTextStyles: {
    fontFamily: fontFamily.bold,
    fontSize: normalize(14),
    marginLeft: normalize(10),
  },
  latLongTxtStyle: {
    fontSize: normalize(13),
    color: Colors?.latLongTxtColor,
    textAlign: 'left',
  },
  attachmentDateStyles: {
    fontSize: normalize(12),
    color: Colors?.latLongTxtColor,
    marginLeft: normalize(10),
  },
  attachmentDateContainer: {
    marginTop: normalize(15),
    marginLeft: normalize(10),
  },
  iconStyle: {
    marginLeft: normalize(8),
    marginRight: normalize(5),
  },
  formDotStyles: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(100),
    marginRight: normalize(10),
  },
  formCardView: {
    backgroundColor: Colors?.white,
    padding: normalize(20),
    borderRadius: normalize(5),
  },
  formTitle: {
    fontSize: normalize(16),
    fontFamily: fontFamily.bold,
    marginBottom: normalize(5),
    textAlign:"left"
  },
  dividerStyles: {
    borderBottomWidth: normalize(1),
    paddingBottom: normalize(15),
    borderBottomColor: Colors?.borderGrey,

  },
  img: {
    top: Platform.OS == 'android' ? 0 : normalize(30),
    bottom: normalize(20),
  },
  iconStyle: {
    marginLeft: normalize(8),
    marginRight: normalize(5),
  },
  
});
