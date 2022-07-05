import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import HeaderComponent from '../../../components/header/index.js';
import { Colors } from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../JobList/addMore.js';
import { BlackMoreOptionIcon } from '../../../assets/img/index.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Text } from '../../../components/Text/index.js';
import { strings } from '../../../lib/I18n/index.js';
import {
  fontFamily,
  normalize,
  textSizes,
  dateFormat,
} from '../../../lib/globals.js';
import { UserIcon } from '../../../assets/img/index.js';
import ZigzagLines from '../../../components/ZigZagLines/index.js';
import Button from '../../../components/Button';
import { useDimensions } from '../../../hooks/useDimensions';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import { AddPartsCalenderIcon } from '../../../assets/img';
import DatePickerModal from './PartsAttachments/DatePickerModal';
import {
  WhiteDeleteIcon,
  WhiteEditIcon,
  PlusIcon,
} from '../../../assets/img/index.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import TabShape from '../../navigators/BottomTab/TabShape.js';
import { Dropdown } from '../../../components/Dropdown/index.js';
import { pricing1 } from '../../../assets/jsonData/index.js';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';
import api from '../../../lib/api';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { Header } from '../../../lib/buildHeader';
import { useDispatch, useSelector } from 'react-redux';
import { queryAllRealmObject } from '../../../database/index.js';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { fetchjobDeailsPerId, fetchJobDetailsData } from '../../../database/JobDetails/index';
import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import { useColors } from '../../../hooks/useColors.js';
import { emptyDropDown, commonStyles } from '../../../util/helper.js';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { getStatus } from '../../../lib/getStatus.js';
import Loader from '../../../components/Loader';
import { pendingApi } from '../../../redux/pendingApi/action.js';
import { useNetInfo } from '../../../hooks/useNetInfo.js';
import { _deletePriceLocally } from '../../../database/JobDetails/pricing.js';

const iconWidth = textSizes.h10;
const iconHeight = textSizes.h10;
const current = new Date();
const initialDate = dateFormat(current, 'YYYY-MM-DD');

// export const TabShap = ({ navigation }) => {
//   return <TabShape navigation={navigation} />;
// };
const WrapperComponent = ({
  item,
  navigation,
  handleDeleteTimeOff,
  row,
  index,
  children,
  editEnable,
  closeRow = () => null,
  callback,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const priceDetail = useSelector(
    (state) => state?.jobDetailReducers?.GetPriceDetailsEntity,
  );
  const { isInternetReachable } = useNetInfo();
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const dispatch = useDispatch();
  const token = useSelector((state) => state?.authReducer?.token);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  // const callBack = (data) => {
  //   dispatch(saveJobDetails(data[0]));
  //   dispatch({type: SET_LOADER_FALSE});
  // };

  const callBack = (data) => {
    dispatch(saveJobDetails(data));
    //   dispatch({type: SET_LOADER_FALSE});
  };
  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      fetchjobDeailsPerId(fetchJobDetailsData, jobInfo?.WoJobId, callBack)
    }
  }, [IsFocused]);
  const fetchJobDetailRealm = () => {

    fetchjobDeailsPerId(fetchJobDetailsData, jobInfo?.WoJobId, callBack)
  }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     let dataset = {
  //       token: token,
  //       TechId: userInfo?.sub,
  //       WojobId: jobInfo?.WoJobId,
  //       CompanyId: userInfo?.CompanyId,
  //       customFieldentity: '3,16',
  //     };

  //     fetchJobDetails(dataset, callBack);
  //   }, []),
  // );

  const handleDeleteAction = (value) => {
    try {
      row[index].close();
      dispatch({ type: SET_LOADER_TRUE });
      const handleCallback = {
        success: (data) => {

          toggleDeleteModal();
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode?.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) === '1') {
              callback && callback()
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
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
          toggleDeleteModal();
        },
      };
      let headers = Header(token);
      let endpoint = `?CompanyId=${userInfo?.CompanyId}&WoPriceId=${priceDetail[index]?.WoJobPriceId}&WoJobId=${priceDetail[index]?.WoJobId}`;
      if (isInternetReachable) {
        api.deletePrice('', handleCallback, headers, endpoint);
      }
      else {
        let obj = {
          id: stateInfo?.pendingApi?.length + 1,
          url: 'deletePricing',
          data: '',
          jobId: userInfo?.WoJobId,
          endPoint: endpoint
        };
        let apiArr = [...stateInfo?.pendingApi]
        apiArr.push(obj)
        dispatch(pendingApi(apiArr));
      }
    } catch (error) {
      toggleDeleteModal();
      dispatch({ type: SET_LOADER_FALSE });
    }
    const LocalCb = () => {
      dispatch({ type: SET_LOADER_FALSE });
      !isInternetReachable && FlashMessageComponent('success', strings(`Response_code.${1003}`));
      fetchJobDetailRealm()
    }
    _deletePriceLocally({ ...value }, LocalCb)
  };

  const handleEditAction = () => {
    try {
      row[index].close();
      navigation.navigate('EditPricing', { data: item });
    } catch (error) { }
  };
  return (
    <>
      {/* {item?.PriceType === 'Part Price' ? (
        <SwipeableComponent
          enabled={false}
          index={index}
          row={row}
          containerStyle={{
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors?.white,
            elevation: 0,
          }}
          buttons={[]}>
          {children}
        </SwipeableComponent> */}
      {/* // ) : ( */}
      {item?.CreatedBy == jobInfo?.TechId ?
        <SwipeableComponent
          enabled={!editEnable && jobInfo?.SubmittedSource != 2 ? true : false}
          index={index}
          row={row}
          rowOpened={(index) => {

            closeRow(index);
          }}
          containerStyle={{
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors?.white,
            elevation: 0,
          }}
          buttons={[
            {
              title: strings('Pricing.Edit'),
              action: () => handleEditAction(),
              style: { backgroundColor: Colors.blue },
              SvgIcon:
                item?.title != ''
                  ? () => (
                    <WhiteEditIcon width={iconWidth} height={iconHeight} />
                  )
                  : null,
            },
            {
              title: strings('Pricing.Delete'),
              action: () => toggleDeleteModal(),
              style: { backgroundColor: Colors.deleateRed },
              SvgIcon:
                item?.title != ''
                  ? () => (
                    <WhiteDeleteIcon width={iconWidth} height={iconHeight} />
                  )
                  : null,
            },
          ]}>
          {children}
        </SwipeableComponent>
        :
        <SwipeableComponent
          enabled={!editEnable && jobInfo?.SubmittedSource != 2 ? true : false}
          index={index}
          row={row}
          containerStyle={{
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors?.white,
            elevation: 0,
          }}
          rowOpened={(index) => {

            closeRow(index);
          }}
          buttons={[
            {
              title: strings('Pricing.Edit'),
              action: () => handleEditAction(),
              style: { backgroundColor: Colors.blue },
              SvgIcon:
                item?.title != ''
                  ? () => (
                    <WhiteEditIcon width={iconWidth} height={iconHeight} />
                  )
                  : null,
            },

          ]}>
          {children}
        </SwipeableComponent>
      }

      {/* // ) */}
      {/* } */}

      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('confirmation_modal.title')}
          discription={strings('confirmation_modal.Delete_Discription')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => handleDeleteAction(item)}
        />
      ) : null}
    </>
  );
};

const PriceDetail = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const { colors } = useColors();
  const { height, width } = useDimensions();
  const [scroll, setScroll] = useState(false);
  const [flag, setFlag] = useState(false);
  const [paymentDropDown, setpaymentDropDown] = useState({});
  const [selectedpaymentDropDown, setSelelctedpaymentDropDown] = useState({});
  const todayDate = new Date();
  const currentDate = dateFormat(todayDate, 'YYYY-MM-DD');
  const [date, setDate] = useState(null);
  const [showDatePicker, setDatePicker] = useState(false);
  const [total, setTotal] = useState(0);
  const [chequeno, setChequeno] = useState(null);
  const [cash, setCash] = useState(null);
  const [other, setOther] = useState(null);
  const [bankName, setBankname] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const dispatch = useDispatch();
  const [dis, setDis] = useState(0);
  const [tax, setTax] = useState(0);
  const [priceDetail, setPriceDetail] = useState([]);
  const token = useSelector((state) => state?.authReducer?.token);
  const priceDetails = useSelector(
    (state) => state?.jobDetailReducers?.GetPriceDetailsEntity,
  );
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const isFocused = useIsFocused();

  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const userInfo = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const userInformation = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);
  const editableAddPrice = getStatus('Add Price', jobInfo?.JobStatus);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const paymantDetails = useSelector((state) => state?.jobDetailReducers?.data?.GetJobPaymentDetailsEntity);
  const [paymentInfo, setpaymentInfo] = useState(paymantDetails);

  useEffect(() => {
    if (paymentInfo != null) {
      const cashRs = paymentInfo?.CashReceived?.toString()
      setCash(cashRs)
      const repNo = paymentInfo?.ReceiptNo?.toString()
      setReceipt(repNo)
      setChequeno(paymentInfo?.ChequeNo)
      setDate(paymentInfo?.ChequeDate)
      setBankname(paymentInfo?.BankName)
      let amount = paymentInfo?.OtherAmount?.toString()
      setOther(amount)
    }


    if (paymentDropDown?.length > 0 && paymentInfo != null) {
      const data2 = paymentDropDown?.filter((ele) => ele?.id == paymentInfo?.PaymentModeId)

      data2?.length > 0 && setSelelctedpaymentDropDown(data2[0])
    }

  }, [paymentInfo])



  useEffect(() => {
    if (isFocused) {

      fetchPriceDetails();
    }
  }, [isFocused]);
  const fetchPriceDetails = () => {
    try {
      const handleCallback = {
        success: (res) => {
          dispatch(saveJobDetails({ ...jobDetails, GetPriceDetailsEntity: res }));
        },
        error: (Err) => { },
      };
      const endPoint = `?CompanyId=${userInformation?.CompanyId}&woJobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetPriceDetailsEnityOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };

  const callBack2 = (data) => {
    // dispatch(saveJobDetails(data[0]));
    dispatch(saveJobDetails(data));
  };
  const IsFocused = useIsFocused();
  useEffect(() => {
    if (IsFocused) {
      fetchjobDeailsPerId(fetchJobDetailsData, jobInfo?.WoJobId, callBack2)
    }
  }, [IsFocused]);

  // useEffect(() => {
  //   GetWoJobPaymentOnlineApi();
  // }, []);

  const GetWoJobPaymentOnlineApi = () => {
    try {
      const handleCallback = {
        success: (res) => {
          setpaymentInfo(res)
          // dispatch(saveJobDetails({ ...jobDetails, GetJobPaymentDetailsEntity: res }));
          // dispatch(saveJobDetails({...jobDetails, GetJobEquipment: res}));
        },
        error: (Err) => { },
      };
      const endPoint = `?CompanyId=${userInformation?.CompanyId}&Wojobid=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetWoJobPaymentOnline('', handleCallback, header, endPoint);
    } catch (error) {
      console.log({ error });
    }
  };



  // const calculateTotal = (addvalue) => {
  //   test = addvalue + test;
  //   setTotal(test);
  // };
  // const calculateDiscount = (disc) => {
  //   discount = discount + disc;
  //   setDis(discount);
  // };
  // const calculateTax = (tax) => {
  //   taxAmt = taxAmt + tax;
  //   setDis(taxAmt);
  // };

  // var amt = 0;
  // const [amnt, setAmnt] = useState();

  // const calculateAmt = (item) => {
  //   amt =
  //     item?.UnitPrice * item?.Qty -
  //     item?.UnitPrice * item?.Qty * (item?.Discount / 100) +
  //     item?.Tax;
  //   amt = amt.toFixed(2);
  //   setAmnt(amt);
  // };

  useEffect(() => {
    setPriceDetail(priceDetails);
  }, [priceDetails]);


  useEffect(() => {
    calculationTotalTaxDisc()
  }), [];

  const calculationTotalTaxDisc = () => {
    var prices = 0;
    var discount = 0;
    var taxAmt = 0;


    for (let i = 0; i < priceDetail.length; i++) {
      var price = 0
      var disct = 0
      var taxS = 0
      if (priceDetail[i]?.PricingUnit == 'Hourly') {
        price = ((priceDetail[i]?.MinutesPerTask / 60 + priceDetail[i]?.HoursPerTask) * priceDetail[i]?.UnitPrice)
        disct = (priceDetail[i]?.Discount != 0 && priceDetail[i]?.Discount != undefined && priceDetail[i]?.Discount != null ?
          priceDetail[i].DiscountType == "Flat" ? parseInt(priceDetail[i]?.Discount) :
            (priceDetail[i]?.MinutesPerTask / 60 + priceDetail[i]?.HoursPerTask) * priceDetail[i]?.UnitPrice *
            (parseInt(priceDetail[i]?.Discount) / 100) : 0)
        taxS = (priceDetail[i]?.Percentage != 0 && priceDetail[i]?.Percentage != undefined && priceDetail[i]?.Percentage != null ?
          (price - disct) *
          (priceDetail[i]?.Percentage / 100) : 0)
      }
      else {
        price = (priceDetail[i]?.UnitPrice * priceDetail[i]?.Qty)
        disct = (priceDetail[i]?.Discount != 0 && priceDetail[i]?.Discount != undefined && priceDetail[i]?.Discount != null ?
          priceDetail[i].DiscountType == "Flat" ? parseInt(priceDetail[i]?.Discount) :
            priceDetail[i]?.UnitPrice * priceDetail[i]?.Qty * (parseInt(priceDetail[i]?.Discount) / 100) : 0)
        taxS = (priceDetail[i]?.Percentage != 0 && priceDetail[i]?.Percentage != undefined && priceDetail[i]?.Percentage != null ?
          (price - disct) * (priceDetail[i]?.Percentage / 100) : 0)
      }
      prices = prices + price
      discount = discount + disct
      taxAmt = taxAmt + taxS
    }
    setTotal(prices);
    setDis(discount);
    setTax(taxAmt);
  }

  useEffect(() => {
    fetchDataRealm();
  }, []);

  const fetchDataRealm = () => {
    queryAllRealmObject(MASTER_DATA)
      .then((data) => {
        const res = data[0];
        const result = res?.PaymentModes.map((obj) => {
          let data = {
            id: obj?.PaymentModeId,
            label: obj?.PaymentModeDesc,
            value: obj?.PaymentModeDesc,
            ...obj,
          };
          return data;
        });
        if (result != undefined && result?.length > 0) {
          setpaymentDropDown(result);
        }
      })

      .catch((error) => { });
  };

  const headerRightIcons = [
    {
      name: BlackMoreOptionIcon,
      onPress: () => {
        toggleAddMore();
      },
    },
  ];
  const toggleAddMore = () => {
    setShowAddMore(!showAddMore);
  };
  const onSave = () => {
    if (selectedpaymentDropDown.value != null) {
      if (parseFloat(other && other != 0 ? parseFloat(other) + parseFloat(cash) : cash).toFixed(2) === parseFloat(total - dis + tax).toFixed(2)) {
        paySave();
      } else {
        FlashMessageComponent('warning', strings('Pricing.Greater_Amount'));
      }
    }
    else {
      FlashMessageComponent('warning', strings('Pricing.Choose_the_payment_mode'));
    }
  };
  const payAmount = () => {
    setFlag(true);
    // setScroll(true);
  };
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };


  const paySave = () => {
    try {
      dispatch({ type: SET_LOADER_TRUE });
      const data = {
        WoJobPaymentId: paymentInfo !== null ? paymentInfo.WoJobPaymentId : 0,
        CompanyId: userInformation?.CompanyId,
        WorkOrderId: jobInfo?.WorkOrderId,
        WoJobId: jobInfo?.WoJobId,
        PaymentModeId: selectedpaymentDropDown?.id,
        CashReceived: cash != '' ? cash : null,
        OtherAmount: other != '' && other != 0 ? other : null,
        ChequeNo: chequeno,
        ChequeDate: date,
        ChequeDates: null,
        BankName: bankName,
        ReceiptNo: receipt,
        CreatedBy: jobInfo?.CreatedBy,
        CreatedDate: currentDate,
        LastChangedBy: null,
        LastUpdate: null,
        PaymentMode: selectedpaymentDropDown?.value,
        AmountCollected: cash != '' ? parseFloat(cash) : 0 + other != '' && other != 0 ? parseFloat(other) : 0,
        CashReceivedFormat: null,
        OtherAmountFormat: null,
        TimeZoneId: 2,
        PaymentStatusId: null,
        CreatedSourceId: 1,
        UpdatedSourceId: 2,
      };
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode?.length > 5) {
              FlashMessageComponent('warning', strings(`Response_code.${msgCode}`));
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
              );
            } else {
              FlashMessageComponent(
                'warning',
                strings(`Response_code.${msgCode}`),
              );
            }
            setFlag(false);
            // setScroll(false);
            dispatch({ type: SET_LOADER_FALSE });
            GetWoJobPaymentOnlineApi()

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

      let headers = Header(token);
      api.savePayment(data, handleCallback, headers);

    } catch (error) {
      dispatch({ type: SET_LOADER_FALSE });
    }
  };

  let row = [];

  let prevOpenedRow;

  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow != row[index]) {
      prevOpenedRow.close();
    }

    prevOpenedRow = row[index];

  };


  const renderComponent = ({ item, index }) => {

    return (
      <View
        style={styles.priceCard}>
        <WrapperComponent
          item={item}
          navigation={navigation}
          row={row}
          editEnable={!editableAddPrice}
          closeRow={(index) => closeRow(index)}
          callback={fetchPriceDetails}
          index={index}>
          <View style={{ backgroundColor: Colors.white }}>
            <View
              style={styles.desc}>
              {item?.PriceType == 'Part Price' && item?.IsBOQRequest === 0 ? (
                <Text style={styles.description}>
                  {item?.Description}
                </Text>
              ) : item?.PriceType == 'Part Price' &&
                item?.IsBOQRequest === 1 ? (
                <Text style={styles.description}>
                  {'[BOQ] '}
                  {item?.Description}
                </Text>
              ) : (
                <Text style={styles.description}>
                  {item?.Description}
                </Text>
              )}

              {item?.PricingUnit == 'Hourly' ? (
                <Text
                  align="flex-start"
                  style={styles.price}>
                  $
                  {parseFloat(
                    (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice -
                    (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                      (item.DiscountType == "Flat" ? item?.Discount :
                        (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice * (item?.Discount / 100)) : 0) +
                    (item?.Percentage != 0 && item?.Percentage != undefined && item?.Percentage != null ?
                      (((item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice -
                        (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                          (item.DiscountType == "Flat" ? item?.Discount :
                            (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice * (item?.Discount / 100)) : 0)) * (item?.Percentage / 100)) : 0)
                  ).toFixed(2) < 0 ? '0.00' : parseFloat(
                    (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice -
                    (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                      (item.DiscountType == "Flat" ? item?.Discount :
                        (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice * (item?.Discount / 100)) : 0) +
                    (item?.Percentage != 0 && item?.Percentage != undefined && item?.Percentage != null ?
                      (((item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice -
                        (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                          (item.DiscountType == "Flat" ? item?.Discount :
                            (item?.MinutesPerTask / 60 + item?.HoursPerTask) * item?.UnitPrice * (item?.Discount / 100)) : 0)) * (item?.Percentage / 100)) : 0)
                  ).toFixed(2)}
                </Text>
              ) :
                <Text
                  align="flex-start"
                  style={styles.price}>
                  $
                  {parseFloat(
                    item?.UnitPrice * item?.Qty -
                    (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                      (item.DiscountType == "Flat" ? item?.Discount :
                        item?.UnitPrice * item?.Qty * (item?.Discount / 100)) : 0) +
                    (item?.Percentage != 0 && item?.Percentage != undefined && item?.Percentage != null ?
                      ((item?.UnitPrice * item?.Qty -
                        (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                          (item.DiscountType == "Flat" ? item?.Discount :
                            item?.UnitPrice * item?.Qty * (item?.Discount / 100)) : 0)) * (item?.Percentage / 100)) : 0)
                  ).toFixed(2) < 0 ? '0.00' : parseFloat(
                    item?.UnitPrice * item?.Qty -
                    (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                      (item.DiscountType == "Flat" ? item?.Discount :
                        item?.UnitPrice * item?.Qty * (item?.Discount / 100)) : 0) +
                    (item?.Percentage != 0 && item?.Percentage != undefined && item?.Percentage != null ?
                      ((item?.UnitPrice * item?.Qty -
                        (item?.Discount != 0 && item?.Discount != undefined && item?.Discount != null ?
                          (item.DiscountType == "Flat" ? item?.Discount :
                            item?.UnitPrice * item?.Qty * (item?.Discount / 100)) : 0)) * (item?.Percentage / 100)) : 0)
                  ).toFixed(2)}
                </Text>
              }
            </View>

            {item?.PriceType == 'Part Price' ? (
              <Text style={{ alignSelf: 'flex-start' }}>{'Part'}</Text>
            ) : item?.PriceType == 'Work Request' ? (
              <Text style={{ alignSelf: 'flex-start' }}>{'Work Request'}</Text>
            ) : item?.AdditionalPricing?.MiscellaneousLabor ==
              'Miscellaneous Labor' ? (
              <Text style={{ alignSelf: 'flex-start' }}>
                {'Miscellaneous Labor'}
              </Text>
            ) : item?.AdditionalPricing?.MiscellaneousPart ==
              'Miscellaneous Part' ? (
              <Text style={{ alignSelf: 'flex-start' }}>
                {'Miscellaneous Part'}
              </Text>
            ) : (
              <Text style={{ alignSelf: 'flex-start' }}>{item?.PriceType}</Text>
            )}

            {item?.PricingUnit == 'Hourly' ? (
              <Text
                style={styles.taxDiscount}>
                {item?.HoursPerTask}.{item?.MinutesPerTask} Hr * $
                {item?.UnitPrice}{' '}
                {item?.Percentage != 0 && item?.Discount != 0 ?
                  ` + (${item?.Percentage}% Tax & ${item?.Discount}${item.DiscountType === 'Flat' ? ' Discount' : '% Discount'})`
                  : item?.Percentage != 0 && item?.Discount == 0 ?
                    ` + (${item?.Percentage}% Tax)`
                    : item?.Percentage == 0 && item?.Discount != 0 ?
                      ` + (${item?.Discount}${item?.DiscountType === 'Flat' ? ' Discount' : '% Discount'})` : ''
                }
              </Text>
            ) :
              <Text
                style={styles.taxDiscount}>
                {item?.Qty} Qty * ${item?.UnitPrice}
                {item?.Percentage != 0 && item?.Discount != 0 && item?.Discount != undefined && item?.Percentage != undefined ?
                  ` + (${item?.Percentage}% Tax & ${item?.Discount}${item.DiscountType === 'Flat' ? ' Discount' : '% Discount'})`
                  : item?.Percentage != 0 && item?.Percentage != undefined ?
                    ` + (${item?.Percentage}% Tax)`
                    : item?.Discount != 0 && item?.Discount != undefined ?
                      ` + (${item?.Discount}${item?.DiscountType === 'Flat' ? ' Discount' : '% Discount'})` : ''
                }
              </Text>
            }
          </View>
        </WrapperComponent>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: '#f1f1f1', flex: 1 }}>
      <SafeAreaView style={commonStyles}>
        <View style={{ flex: 1 }}>
          <HeaderComponent
            onent
            title={strings('Pricing.Price_Details')}
            leftIcon={'Arrow-back'}
            navigation={navigation}
            headerTextStyle={styles.headerStyles}
            HeaderRightIcon={headerRightIcons}
            containerStyle={{
              shadowColor: '#ffffff',
              shadowOffset: { width: 0, height: 0 },
            }}
          />

          {scroll === true ? (
            <View
              style={{
                marginBottom: normalize(40),
                backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                borderBottomRightRadius: normalize(10),
                borderBottomLeftRadius: normalize(10),
              }}>
              <View style={[styles.topView, { height: normalize(40) }]}></View>

              <View style={styles.outerView1}>
                <View style={styles.flexView}>
                  <Text>{strings('Pricing.net_total')}</Text>
                  <Text
                    style={[
                      styles.TxtStyles,
                      {
                        color: Colors.black,
                        fontFamily: fontFamily.semiBold,
                        marginLeft: normalize(10),
                      },
                    ]}>
                    ${parseFloat(total - dis + tax).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    disabled={jobInfo.SubmittedSource != 2 ? !editableAddPrice : true}
                    onPress={() => {
                      navigation.navigate('AddPricing');
                    }}>
                    <Text
                      style={{
                        color: !editableAddPrice
                          ? Colors?.darkGray
                          : Colors.black,
                        fontFamily: fontFamily.semiBold,
                      }}>
                      <PlusIcon
                        height={normalize(12)}
                        width={normalize(12)}
                        fill={
                          editableAddPrice ? Colors.black : Colors?.darkGray
                        }
                      />
                      {'  '}
                      {strings('Pricing.add_price')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          {scroll === false ? (
            <View>
              <View
                style={{
                  ...styles.topView,
                  backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                }}>
                <UserIcon
                  height={normalize(30)}
                  width={normalize(23)}
                  style={{ marginLeft: normalize(20) }}
                />
                <Text style={styles.TxtStyles}>{jobInfo?.CustomerName}</Text>
                <Text style={{ color: 'white' }}>Job #{userInfo?.WoJobId}</Text>
              </View>

              <View style={styles.outerView}>
                <Text>{strings('Pricing.net_total')}</Text>
                <Text
                  style={[
                    styles.TxtStyles,
                    {
                      color: Colors.black,
                      fontFamily: fontFamily.semiBold,
                      marginLeft: normalize(10),
                    },
                  ]}>
                  ${parseFloat((total - dis) + tax).toFixed(2)}
                </Text>
                <TouchableOpacity
                  disabled={jobInfo.SubmittedSource != 2 ? !editableAddPrice : true}
                  onPress={() => {
                    navigation.navigate('AddPricing');
                  }}>
                  <Text
                    style={{
                      color: !editableAddPrice
                        ? Colors?.darkGray
                        : Colors.black,
                      fontFamily: fontFamily.semiBold,
                    }}>
                    <PlusIcon
                      height={normalize(12)}
                      width={normalize(12)}
                      fill={
                        editableAddPrice ? Colors.black : Colors?.darkGray
                      }
                    />
                    {'  '}
                    {strings('Pricing.add_price')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <ScrollView
          keyboardShouldPersistTaps={'handled'}
            onScroll={() => {
              setScroll(true);
            }}>
            <View style={{ paddingBottom: 15, backgroundColor: '#f1f1f1' }}>
              <View style={styles.cardView}>
                <ZigzagLines
                  position="top"
                  width={width - 50}
                  backgroundColor={'#f1f1f1'}
                  color={Colors.white}
                  jagWidth={15}
                  jagBottom={2}
                  style={{ marginLeft: 12, marginRight: 12 }}
                />
                <View
                  style={{
                    marginLeft: normalize(20),
                    marginRight: normalize(20),
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.borderGrey,
                  }}>
                  <Text style={styles.heading} align={'flex-start'}>
                    {strings('Pricing.invoice')}
                  </Text>
                </View>

                <FlatList
                  style={{ height: normalize(350) }}
                  ListFooterComponent={() => (
                    <View style={{ marginHorizontal: normalize(20) }}>
                      <View style={styles.head}>

                        <Text style={styles.subTotalTextWrap}>
                          {strings('Pricing.sub_total')}
                        </Text>
                        <Text style={{ flex: 0.25 }}>${parseFloat(total).toFixed(2)}</Text>

                      </View>
                      <View style={styles.head}>

                        <Text
                          style={[{
                            fontFamily: fontFamily.bold,

                          }, styles.subTotalTextWrap]}>
                          {strings('Pricing.net_total')}
                        </Text>
                        <Text style={{ fontFamily: fontFamily.bold, flex: 0.25 }}>
                          ${parseFloat(total - dis + tax).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  )}
                  data={priceDetail}
                  renderItem={renderComponent}
                  keyExtractor={(item, index) => `${index}`}
                />
              </View>
            </View>

            {flag === false ? (
              <Button
                backgroundColor={colors?.PRIMARY_BACKGROUND_COLOR}
                title={strings('Pricing.Pay_Amount')}
                txtColor={'#FFFFFF'}
                fontSize={normalize(14)}
                width={normalize(320)}
                style={{ margin: normalize(20), alignSelf: 'center' }}
                onClick={jobInfo?.SubmittedSource != 2 ? () => {
                  payAmount();
                } : () => { }}
              />
            ) : null}

            {flag === true ? (
              <View>
                <View style={{ paddingBottom: 15, backgroundColor: '#f1f1f1' }}>
                  <View style={styles.cardView}>
                    <ZigzagLines
                      position="top"
                      width={width - 50}
                      backgroundColor={'#f1f1f1'}
                      color={Colors.white}
                      jagWidth={15}
                      jagBottom={2}
                      style={{ marginLeft: 12, marginRight: 12 }}
                    />
                    <View
                      style={{
                        marginLeft: normalize(20),
                        marginRight: normalize(20),
                        borderBottomWidth: 1,
                        borderBottomColor: Colors.borderGrey,
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ justifyContent: 'flex-start' }}>
                        <Text
                          style={[
                            styles.heading,
                            { paddingBottom: normalize(15) },
                          ]}>
                          {strings('Pricing.payment')}
                        </Text>
                      </View>
                      <View style={{ alignContent: 'flex-end' }}>
                        <TouchableOpacity
                          onPress={() => {
                            setFlag(false);
                            setScroll(false);
                          }}>
                          <Text
                            style={[
                              styles.heading,
                              {
                                paddingBottom: normalize(15),
                                fontFamily: fontFamily.regular,
                              },
                            ]}>
                            {strings('Pricing.remove')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{ padding: normalize(15) }}>
                      <Text align={'flex-start'} style={styles.txt}>
                        {''} {strings('Pricing.payment_mode')}
                      </Text>
                      <Dropdown
                        style={styles.dropDownWrap}
                        hasBorder={true}
                        label={selectedpaymentDropDown?.label}
                        list={
                          paymentDropDown?.length > 0
                            ? paymentDropDown
                            : emptyDropDown
                        }
                        selectedItem={selectedpaymentDropDown}
                        handleSelection={(val) =>
                          setSelelctedpaymentDropDown(val)
                        }
                        zIndexVal={1}
                        align={'flex-start'}
                        placeholder={''}
                        dropDownContainer={styles.dropDownContainerStyle}
                        dropDownBodyContainer={styles.dropDownBodyContainerstyle}
                        itemStyle={styles.dropdownTextStyle}
                      />
                      {selectedpaymentDropDown?.value === 'Cash' ||
                        selectedpaymentDropDown?.value === 'Cheque' ? (
                        [
                          <Text align={'flex-start'} style={styles.txt}>
                            {''} {strings('Pricing.cash_received')}
                          </Text>,
                          <TextInput
                            style={styles.textInput1}
                            value={cash}
                            keyboardType={'numeric'}
                            onChangeText={(val) => {
                              // setCash(val)
                              if (isNaN(val) === false) {
                                setCash(val);
                              }
                              else{
                                setCash(0)
                              }
                            }}
                          />,
                        ]
                      ) : (
                        <></>
                      )}
                      {selectedpaymentDropDown?.value !== 'Cash' ? (
                        [
                          <Text align={'flex-start'} style={styles.txt}>
                            {''} {strings('Pricing.other_amount')}
                          </Text>,
                          <TextInput
                            style={styles.textInput1}
                            value={other}
                            onChangeText={(val) => {
                              // setOther(val)
                              if (isNaN(val) === false) {
                                setOther(val);
                              }
                              else{
                                setOther(0)
                              }
                            }}
                          />,
                        ]
                      ) : (
                        <></>
                      )}

                      {selectedpaymentDropDown?.value === 'Cheque' ? (
                        [
                          <Text align={'flex-start'} style={styles.txt}>
                            {''} {strings('Pricing.cheque')}
                          </Text>,
                          <TextInput
                            style={styles.textInput1}
                            value={chequeno}
                            onChangeText={(val) => {

                              setChequeno(val);

                            }}
                          />,
                        ]
                      ) : (
                        <></>
                      )}

                      {selectedpaymentDropDown?.value === 'Cheque' ? (
                        [
                          <View>
                            <Text align={'flex-start'} style={styles.txt}>
                              {''} {strings('Pricing.cheque_date')}
                            </Text>
                            <TouchableOpacity
                              activeOpacity={1}
                              onPress={() => {
                                toggleDatePicker();
                              }}
                              style={styles.calenderInputContainer}>
                              <Text style={styles.dateTxtStyles}>
                                {date != '' && date != null ? dateFormat(date, 'DD/MM/YYYY') : ''}
                              </Text>
                              <AddPartsCalenderIcon
                                height={normalize(21)}
                                width={normalize(23)}
                              />
                            </TouchableOpacity>
                          </View>,
                        ]
                      ) : (
                        <></>
                      )}

                      {selectedpaymentDropDown?.value === 'Cheque' ? (
                        [
                          <Text align={'flex-start'} style={styles.txt}>
                            {''} {strings('Pricing.bank_name')}
                          </Text>,
                          <TextInput
                            style={styles.textInput1}
                           
                            value={bankName}
                            onChangeText={(val) => {
                              setBankname(val);
                            }}
                          />,
                        ]
                      ) : (
                        <></>
                      )}

                      <Text align={'flex-start'} style={styles.txt}>
                        {''} {strings('Pricing.receipt')}
                      </Text>
                      <TextInput
                        style={[styles.textInput1, { marginBottom: normalize(5) }]}
                        multiline={true}
                        value={receipt}
                        onChangeText={(val) => {

                          setReceipt(val);

                        }}
                      />


                    </View>


                  </View>

                  <View style={{ flex: 1, marginTop: normalize(20), paddingHorizontal: normalize(20) }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',

                      }}>
                      <Text align="flex-start">
                        {strings('Pricing.amount_tobe')}
                      </Text>
                      <Text
                        align="flex-end"
                        style={{ fontFamily: fontFamily.bold, paddingRight: normalize(5) }}>
                        ${parseFloat(total - dis + tax).toFixed(2)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: normalize(10)
                      }}>
                      <Text align="flex-start">
                        {strings('Pricing.amount_collected')}
                      </Text>
                      <Text
                        align="flex-end"
                        style={{ fontFamily: fontFamily.bold, paddingRight: normalize(5) }}>
                        {/* ${cash === '' || cash == undefined || isNaN(cash) || isNaN(other) || other == undefined || other === '' ? '0.00' 
                        : isNaN(other) || other == undefined || other === '' ? parseFloat(cash).toFixed(2)
                        : parseFloat(parseInt(cash) + parseInt(other)).toFixed(2)} */}
                        ${
                        cash != '' && cash != undefined && other != '' && other != undefined && other != 0 ? 
                        parseFloat(parseFloat(cash) + parseFloat(other)).toFixed(2) : cash != '' ? parseFloat(cash).toFixed(2)
                        : other != '' ? parseFloat(other).toFixed(2): '0.00'
                        }
                      </Text>
                    </View>
                  </View>

                  <Button
                    disabled={!editableAddPrice}
                    backgroundColor={editableAddPrice ? colors?.PRIMARY_BACKGROUND_COLOR : Colors.darkGray}
                    title={'Save'}
                    txtColor={'#FFFFFF'}
                    fontSize={normalize(14)}
                    width={'90%'}
                    style={{ margin: normalize(20), alignSelf: 'center', }}
                    onClick={() => {
                      onSave();
                    }}
                  />
                </View>

              </View>
            ) : null}
          </ScrollView>
        </View>
        {showAddMore ? (
          <AddMoreModal
            visibility={showAddMore}
            handleModalVisibility={toggleAddMore}
            txtColor={Colors.white}
            TxtStyle={{ color: Colors.white }}
          />
        ) : null}

        {showDatePicker ? (
          <DatePickerModal
            handleModalVisibility={toggleDatePicker}
            visibility={showDatePicker}
            setDate={(val) => {
              setDate(val);
            }}
            selectedDate={() => {
              date;
            }}
          />
        ) : null}
      </SafeAreaView>
      <Loader visibility={isLoading} />

      <TabShape navigation={navigation} />
    </View>
  );
};
export default PriceDetail;

export const TabShap = ({ navigation }) => {
  return <TabShape navigation={navigation} />;
};

const styles = StyleSheet.create({
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    flex: 1,
  },
  topView: {
    // backgroundColor: Colors.primaryColor,
    height: normalize(55),
    borderBottomRightRadius: normalize(15),
    borderBottomLeftRadius: normalize(15),
    color: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    paddingRight: normalize(10),
  },
  TxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(20),
    color: Colors.white,
    textAlign: 'left'
  },
  outerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    paddingRight: normalize(20),
    paddingLeft: normalize(20),
    backgroundColor: '#f1f1f1',
  },
  cardView: {
    marginRight: normalize(15),
    marginLeft: normalize(15),
    shadowColor: Colors.darkGray,
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowRadius: 2,
    shadowOpacity: 1.0,
    backgroundColor: Colors.white,
    borderRadius: normalize(10),
  },
  heading: {
    fontFamily: fontFamily.bold,
    marginTop: normalize(15),
    paddingBottom: normalize(2),
    fontSize: normalize(14),
  },
  textInput1: {
    height:Platform.OS === 'ios' ? normalize(40): null,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: normalize(20),
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    paddingLeft: Platform.OS === 'ios' ? normalize(10) : normalize(10),
  },
  outerView1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowOffset: { height: 2, width: 2 },
    elevation: 2,
    shadowOpacity: 0.5,
    justifyContent: 'space-evenly',
    margin: normalize(20),
    position: 'absolute',
  },
  flexView: {
    flexDirection: 'row',
    paddingLeft: normalize(20),
    paddingRight: normalize(20),
  },
  head: {
    paddingVertical: normalize(5),
    flexDirection: 'row',
    alignSelf: 'flex-end',
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

  calenderInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(10),
    borderWidth: normalize(1),
    borderColor: Colors?.silver,
    borderRadius: normalize(10),
    marginTop: normalize(8),
    paddingRight: normalize(10),
    marginBottom: normalize(15),
  },
  dateTxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(10),
  },
  dropDownContainerStyle: {
    borderColor: Colors.darkSecondaryTxt,
    borderRadius: normalize(10),
    marginBottom: normalize(20),
  },
  txt: {
    paddingBottom: normalize(2),
  },
  priceCard: {
    marginLeft: normalize(20),
    marginRight: normalize(20),
    flex: 1,
    flexDirection: 'column',
    borderBottomColor: Colors.borderGrey,
    borderBottomWidth: normalize(1),
    backgroundColor: Colors.white,
  },
  desc: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginTop: normalize(10),

  },
  description: {
    flex: 0.85,
    fontFamily: fontFamily.semiBold,
    textAlign: 'left',
    paddingRight: normalize(5)
  },
  price: {
    flex: 0.25,
    fontFamily: fontFamily.semiBold,

  },
  taxDiscount: {
    alignSelf: 'flex-start',
    marginTop: normalize(10),
    paddingBottom: normalize(10),
    fontSize: normalize(12),
    maxWidth: normalize(250),
  },
  subTotalTextWrap: {
    flex: 0.8,
    textAlign: 'right',
    paddingRight: normalize(25)
  }
});
