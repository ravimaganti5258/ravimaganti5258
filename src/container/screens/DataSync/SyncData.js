import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import HeaderComponent from '../../../components/header';
import {Colors} from '../../../assets/styles/colors/colors';
import {
  fontFamily,
  normalize,
  normalizeHeight,
  textSizes,
} from '../../../lib/globals.js';
import {strings} from '../../../lib/I18n';
import { Header } from '../../../lib/buildHeader';
import Button from '../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import api from '../../../lib/api';
import {Text} from '../../../components/Text';
import MainHoc from '../../../components/Hoc';
import { FlashMessageComponent } from '../../../components/FlashMessge';

const SyncData = ({children, navigation, style, onClick, ...rest}) => {

  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const backgroundData = useSelector(
    (state) => state?.backgroungApiReducer,
  );
  const dispatch = useDispatch();

  //Static data
  /* static json */
  const DATA = [
    {
      id: 1,
      lable: 'Job List',
      date: 'Today 8:21 AM',
    },
    {
      id: 2,
      lable: 'Job Details',
      date: 'Today 8:21 AM',
    },
    {
      id: 3,
      lable: 'Customer Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 4,
      lable: 'Work Category',
      date: 'Today 8:21 AM',
    },
    {
      id: 5,
      lable: 'Work Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 6,
      lable: 'Work Request',
      date: 'Today 8:21 AM',
    },
    {
      id: 7,
      lable: 'Forms',
      date: 'Today 8:21 AM',
    },
    {
      id: 8,
      lable: 'Pricing Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 9,
      lable: 'Discount Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 10,
      lable: 'Payment Type',
      date: 'Today 8:21 AM',
    },
    {
      id: 11,
      lable: 'Brand',
      date: 'Today 8:21 AM',
    },
    {
      id: 12,
      lable: 'Model',
      date: 'Today 8:21 AM',
    },
    {
      id: 13,
      lable: 'Tax',
      date: 'Today 8:21 AM',
    },
    {
      id: 14,
      lable: 'Group',
      date: 'Today 8:21 AM',
    },
    {
      id: 15,
      lable: 'Priority',
      date: 'Today 8:21 AM',
    },
    {
      id: 16,
      lable: 'OTP Reason',
      date: 'Today 8:21 AM',
    },
  ];

  const syncDataApi = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const apiPayload = {
          CompanyId: userInfo.CompanyId,
          SourceId: 4,
          TechId: userInfo.sub,
          JobList: [
            {
              WoJobId: 0,
              AcceptJob: null,
              JobStatus: null,
              WoContact: {
                WoContactId: 65723,
                CompanyId: 416,
                WorkOrderId: 1170765617,
                WoAddressId: 38435764,
                CustContactId: 3579,
                AddressTypeId: 1,
                TitleId: 47,
                FirstName: "James Testt",
                MiddleInitial: "",
                LastName: "Tes",
                Phone1: 2525214125,
                Phone2: 1231214151,
                IsPrimary: 1,
                Fax: "",
                Email: "Malathis@ducont.com",
                ContactTypeId: 24,
                CreatedBy: 32,
                CreatedDate: "0001-01-01T00:00:00",
                LastChangedBy: 32,
                LastUpdate: "0001-01-01T00:00:00",
                CreatedSourceId: null,
                UpdatedSourceId: null,
                Title: null,
                ActualContactName: null,
                CreatedSourceLoginId: null,
                UpdatedSourceLoginId: null,
                CustomerId: 7024,
                CustomerAddressId: 17500,
                CustomerContactId: 65723,
                IsActive: 1
              },
              WoTasks: 
              [
                {
                  WoJobDetailsId: 0,
                  CompanyId: 416,
                  WoJobId: 19157957,
                  WorkTypeId: 1189,
                  WorkTaskId: 3989,
                  Days: 0,
                  Hours: 2,
                  Minutes: 30,
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: 0,
                  LastUpdate: null,
                  TaskNo: null,
                  CustomerPrice: 40,
                  WorkTask: "Split AC",
                  isOffline: 0,
                  CreatedSourceId: 1,
                  UpdatedSourceId: null,
                  WorkOrderId: 1170765617,
                  TaxTypeId: 0,
                  TaxIdGroupId: 0,
                  IsCreatedByClientPortal: null,
                  WorkTypePriorityId: 3,
                  CustomerId: 7024,
                  Qty: 1,
                  PricingUnitId: 417,
                  VendorId: null,
                  menuid: null,
                  TechId: 42
                }
               
              ],
              TechRemarks: [
                {
                  NotesID: 0,
                  NotesMasterId: 42,
                  PrimaryKeyId: 19157957,
                  CompanyId: 416,
                  Note: "Demo",
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: null,
                  LastUpdate: null,
                  Name: null,
                  CreatedByName: null,
                  LastChangedByName: null,
                  SouceTypeId: null,
                  CreatedDatesmobile: null,
                  LastUpdatesmobile: null,
                  WoId: null,
                  CreatedSourceId: 1,
                  UpdatedSourceId: 1,
                  CreatedSourceLoginId: null,
                  UpdatedSourceLoginId: null,
                  VisibleToVendor: null
                }
              ],
              SpecialInstructions: [
                {
                  NotesID: 0,
                  NotesMasterId: 1,
                  PrimaryKeyId: null,
                  CompanyId: 416,
                  Note: "Test Demo",
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: null,
                  LastUpdate: null,
                  Name: null,
                  CreatedByName: null,
                  LastChangedByName: null,
                  SouceTypeId: null,
                  CreatedDatesmobile: null,
                  LastUpdatesmobile: null,
                  WoId: null,
                  CreatedSourceId: 1,
                  UpdatedSourceId: 1,
                  CreatedSourceLoginId: null,
                  UpdatedSourceLoginId: null,
                  VisibleToVendor: null
                }
              ],
              ServiceNotes: [
                {
                  NotesID: 0,
                  NotesMasterId: 42,
                  PrimaryKeyId: 19157957,
                  CompanyId: 416,
                  Note: "test",
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: null,
                  LastUpdate: null,
                  Name: null,
                  CreatedByName: null,
                  LastChangedByName: null,
                  SouceTypeId: null,
                  CreatedDatesmobile: null,
                  LastUpdatesmobile: null,
                  WoId: null,
                  CreatedSourceId: 1,
                  UpdatedSourceId: 1,
                  CreatedSourceLoginId: null,
                  UpdatedSourceLoginId: null,
                  VisibleToVendor: null
                }
              ],
              Equipments: [
                {
                  WoEquipmentId: 0,
                  CompanyId: 416,
                  WorkOrderId: 1170765617,
                  WoAddressId: 0,
                  CustomerEquipmentId: 0,
                  BrandId: 4,
                  Brand: "Airtek",
                  ModelId: 11256,
                  Model: "ashh",
                  SerialNo: null,
                  TagNo: null,
                  Description: null,
                  IsActive: 1,
                  InstallationDate: null,
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: 0,
                  LastUpdate: null,
                  WoJobId: 19157957,
                  CustomerId: 0,
                  CustAddressId: null,
                  ContractStartDate: null,
                  ContractEndDate: null,
                  ContractTypeId: 0,
                  ManufactureDate: null,
                  WarrantyExpiryDate: null,
                  PriorityId: 0,
                  IsContractExpired: null,
                  CreatedSourceId: 1,
                  UpdatedSourceId: null,
                  CreatedSourceLoginId: null,
                  UpdatedSourceLoginId: null
                }
              ],
              JobSignature: {
                WoAppointmentId: 33896,
                CompanyId: 416,
                LastChangedBy: null,
                LastUpdate: null,
                CustomerSignature: "" ,
                IsCustomerSignatureReq: false,
                SignByName: "Test",
                customerfeedBack: {
                  CustomerFeedbackId: 0,
                  CompanyId: 416,
                  WoJobId: 19157957,
                  WorkOrderId: 1170765617,
                  VendorId: 2163,
                  CustomerId: 7024,
                  TechId: 42,
                  Rating: 5,
                  Feedback: "Test",
                  FeedbackBy: "Test",
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: 32,
                  LastUpdate: null
                }
              },
              JobAppointmentOTP: {
                CompanyId: 416,
                WoAppointmentOTPId: 11517,
                WoAppointmentId: 33896,
                Name: null,
                Relationship: null,
                MobileNumber: null,
                OTP: "6568",
                OTPNotRequired: 1,
                OTPReasonId: 2,
                IsActive: 1,
                CreatedBy: 0,
                CreatedDate: "0001-01-01T00:00:00",
                LastChangedBy: 32,
                LastUpdate: "0001-01-01T00:00:00",
                WoJobId: 19157957,
                TechId: 42,
                JobStatus: null,
                isMobile: 1
              },
              JobPayment: {
                WoJobPaymentId: 0,
                CompanyId: 416,
                WorkOrderId: 1170765617,
                WoJobId: 19157957,
                PaymentModeId: 78,
                CashReceived: 10,
                OtherAmount: null,
                ChequeNo: null,
                ChequeDate: null,
                ChequeDates: null,
                BankName: null,
                ReceiptNo: null,
                CreatedBy: 32,
                CreatedDate: "0001-01-01T00:00:00",
                LastChangedBy: null,
                LastUpdate: null,
                PaymentMode: null,
                AmountCollected: null,
                CashReceivedFormat: null,
                OtherAmountFormat: null,
                TimeZoneId: 2,
                PaymentStatusId: null,
                CreatedSourceId: 1,
                UpdatedSourceId: null
              },
              JobPrice: [
                {
                  WoJobPriceId: 0,
                  CompanyId: 416,
                  WoJobId: 19157957,
                  WoJobDetailsId: null,
                  WorkTypeId: null,
                  WorkTaskId: null,
                  PriceTypeId: 82,
                  Qty: 1,
                  UnitPrice: 10,
                  Description: "Test",
                  DiscountTypeId: 81,
                  Discount: null,
                  TaskNo: 0,
                  CreatedBy: 32,
                  CreatedDate: null,
                  LastChangedBy: null,
                  LastUpdate: null,
                  CreatedSourceId: 1,
                  UpdatedSourceId: null,
                  TaxTypeId: null,
                  TaxIdGroupId: null,
                  Tax: "0",
                  TaxPercent: 0,
                  TaxId: null,
                  ExistWoJobPriceId: null,
                  Warranty: 0,
                  PricingUnitId: 417,
                  DaysPerTask: 0,
                  HoursPerTask: 0,
                  MinutesPerTask: 0,
                  isApprovalQueue: null,
                  QOJobPriceId: null,
                  QOJobDetailsId: null,
                  MarkupPercentage: null,
                  MenuId: null
                }
              ],
              JobChecklist: [],
              CustomFiledsList: [
                {
                  EntityId: 16,
                  EntityName: "Mobile",
                  PanelId: 59,
                  PanelName: "Other Information Panel",
                  JobId: 19157957,
                  TransactionId: 0,
                  CustomFields: [
                    {
                      CustomFieldId: 2235,
                      CompanyId: 416,
                      FieldName: "Customer Confirmation",
                      FieldTypeId: 1,
                      MaxLength: 5,
                      TooltipText: "",
                      PrimaryEntityId: 4,
                      Description: null,
                      IsActive: 1,
                      FieldType: "Text Field",
                      Remarks: "",
                      CustomFieldPanelId: 20589,
                      DisplayOrder: 1,
                      IsMandatory: false,
                      IsViewable: true,
                      IsEditable: true,
                      CustomFieldValueId: 48440,
                      PkId: 1197793894,
                      Value: "Hihgg",
                      HeadingId: 0,
                      HeadingName: "",
                      JobId: 19157968,
                      EntityId: 16,
                      EntityName: "Mobile",
                      PanelId: 59,
                      PanelName: "Other Information Panel",
                      TransactionId: 0,
                      CustomFieldDropdown: []
                    }
                  ]
                }
              ],
              JobSLA: [],
              PushSyncChecklistAttachment: {
                ChecklistAttachment: [
                  {
                    WoJobChklistDtlListId: 0,
                    CompanyId: 416,
                    WoJobChklistDtlId: 1378036602,
                    AttachmentCategoryId: 67,
                    AttachementTypeId: 0,
                    Description: "",
                    CapturedDate: "2022-02-07T12:02:00",
                    FileName: "fplogo_7024.png",
                    FilePath: null,
                    CreatedSourceId: 1,
                    UpdatedSourceId: 1,
                    CreatedSourceLoginId: 32,
                    UpdatedSourceLoginId: 42,
                    CreatedBy: 42,
                    CreatedDate: "2022-02-07T12:02:00",
                    LastChangedBy: 42,
                    LastUpdate: null,
                    WorkOrderId: 1170765617,
                    WoJobId: 19157957,
                    TechId: 42,
                    ChklistDtlId: 16044,
                    ChklistMastId: 1158,
                    QuestionId: 6,
                    Attachment: "",
                    Category: null,
                    Type: null,
                    ChklistName: null,
                    Question: "Test",
                    TransactionId: null,
                    ActionTag: "",
                    referenceID: null
                  }
                ],
                SourceId: 4,
                CompleteStatusReason: null
              },
              PushSyncAttachment: {
                SourceId: 3,
                WoAttachment: [
                  {
                    WoAttachmentId: 0,
                    CompanyId: "416",
                    WorkOrderId: 1170765617,
                    WoJobId: 19157957,
                    AttachmentCategoryId: 67,
                    AttachementTypeId: -1,
                    Description: "Test Demo",
                    FileName: "19157957_20220203153212500G_1.jpg",
                    CapturedDate: "2/3/2022 05:02:00 am",
                    CreatedBy: "42",
                    Attachment: "",
                    TimeZoneId: 2,
                    Latitude: 11.3147155,
                    Longitude: 77.8010537,
                    Address: "",
                    CreatedSourceId: 3,
                    ContentType: ".jpg",
                    TechId: 42,
                    JobStatusId: 4,
                    TransactionId: 1643882536383,
                    isOfflineMobile: 1
                  }
                ]
              }
            }
          ]
        }
      let headers = Header(token);
      const handleCallback = {
        success: (data) => {
          // const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', 'hiiiii');
          dispatch({ type: SET_LOADER_FALSE });
        },
        error: (error) => {
          console.log('error',error)
          dispatch({ type: SET_LOADER_FALSE });
        },
      };
        api.syncData(apiPayload, handleCallback, headers);
    } catch (error) {
      console.log('error',error)
      dispatch({ type: SET_LOADER_FALSE });
      FlashMessageComponent('reject', 'Something went wrong');
    }
  }

  const handleBtnClick = () => {
    syncDataApi()
    //function on clicking manual data sync
  };

   /* To chnage the color of diffrent field */
  
  var colors = [Colors.white, Colors.appGray];

  const renderItem = ({item, index}) => {
    return (
      <View
        style={[
          styles.listingData,
          {backgroundColor: colors[index % colors.length]},
        ]}>
        <Text style={styles.text}>{item?.lable}</Text>
        <Text style={styles.text}>{item?.date}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderComponent
        title={strings('Data_Sync.header_Title')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyle}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={strings('Data_Sync.button_title')}
          txtStyle={styles.btnTxtStyles}
          style={styles.syncButton}
          backgroundColor={Colors.lightGreen}
          onClick={() => {
            handleBtnClick();
          }}
        />
      </View>
      <Text style={styles.text}>{strings('Data_Sync.title')}</Text>

      <View style={{margin: normalize(20), flex: 1}}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {strings('Data_Sync.sub_title_Entity')}
          </Text>
          <Text style={styles.titleText}>
            {strings('Data_Sync.sub_title_Date')}
          </Text>
        </View>

        <FlatList
          data={DATA}
          showsVerticalScrollIndicator={false}
          keyExtractor={(DATA) => DATA?.id?.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerStyle: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(20),
    color: Colors.secondryBlack,
  },
  //For Sync Button
  btnTxtStyles: {
    fontSize: textSizes.h10,
    fontWeight: 'bold',
    color: Colors.white,
  },
  syncButton: {
    padding: normalize(5),
    marginTop: normalize(10),
    width: 178,
    height: normalize(42),
  },
  buttonContainer: {
    margin: normalize(10),
    alignItems: 'center',
  },
  text: {
    fontSize: normalize(14),
    paddingBottom: normalize(5),
  },
  // FlatList Component Design
  title: {
    backgroundColor: Colors.greyBorder,
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: normalize(40),
    paddingRight: normalize(40),
  },
  titleText: {
    color: Colors.black,
    fontSize: normalize(16),
    paddingLeft: normalize(10),
    fontFamily: fontFamily.semiBold,
  },
  listingData: {
    color: Colors.black,
    justifyContent: 'space-between',
    paddingRight: normalize(50),
    paddingLeft: normalize(10),
    flexDirection: 'row',
    height: normalizeHeight(40),
  },
});
export default MainHoc(SyncData);
