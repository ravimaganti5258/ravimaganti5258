import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '../../../assets/styles/colors/colors.js';
import AddMoreModal from '../JobList/addMore.js';
import MainHoc from '../../../components/Hoc/index.js';
import { Text } from '../../../components/Text/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { fontFamily, normalize, textSizes } from '../../../lib/globals.js';
import { useDimensions } from '../../../hooks/useDimensions';
import { useDispatch, useSelector } from 'react-redux';

import {
  BlackMoreOptionIcon,
  CrossIcon,
  FilterIcon,
  SearchIcon,
  SerialSearchQRIcon,
  PlusIcon,
  AttachmentIcon,
  PlusBar,
  WhiteDeleteIcon,
  WhiteEditIcon,
  UserIcon,
} from '../../../assets/img/index.js';
import { pricedetails } from '../../../assets/jsonData/index.js';
import SwipeableComponent from '../../../components/Swipeable/index.js';
import ConfirmationModal from '../../../components/ConfirmationModal/index.js';
import TabShape from '../../navigators/BottomTab/TabShape.js';
import SearchBar from '../../../components/SearchBar/index.js';
import EquipmentServiceReportModal from './EquipmentServiceReportModal.js';
import {
  serviceReportdisable,
  serviceReportVisibleAction,
} from '../../../redux/serviceReport/action';
import QRCodeUI from '../../screens/JobDetail/PartsAttachments/QRCodeUI';
import { useColors } from '../../../hooks/useColors.js';
import Loader from '../../../components/Loader';
import HeaderComponents from '../../../components/header';
import { SET_LOADER_FALSE, SET_LOADER_TRUE } from '../../../redux/auth/types';

import { Header } from '../../../lib/buildHeader';
import api from '../../../lib/api';
import { FlashMessageComponent } from '../../../components/FlashMessge';
import { commonStyles } from '../../../util/helper';
import { useFocusEffect } from '@react-navigation/native';

import {
  fetchJobDetails,
  saveJobDetails,
} from '../../../redux/jobDetails/action';
import { DataNotFound } from '../../../components/DataNotFound/index.js';
import { saveEquimentattchment } from '../../../redux/Equipment/action.js';
import { fetchjobDeailsPerId, fetchJobDetailsData } from '../../../database/JobDetails/index.js';
import { pendingApi } from '../../../redux/pendingApi/action.js';
import { useNetInfo } from '../../../hooks/useNetInfo.js';
import { _deleteEquipLocally } from '../../../database/JobDetails/addNewEquipment.js';
import { accessPermission } from '../../../database/MobilePrevi/index.js';

const iconWidth = textSizes.h12;
const iconHeight = textSizes.h12;
const ff = fontFamily.semiBold;
const { width, height } = Dimensions.get('screen');

const WrapperComponent = ({
  item,
  navigation,
  handleDeleteTimeOff,
  row,
  index,
  children,
  apiCallBack,
  Editable,
  Delete,
  closeRow = () => null,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const { isInternetReachable } = useNetInfo();
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const stateInfo = useSelector((state) => state?.backgroungApiReducer);
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );

  const callBack = (data) => {
    dispatch(saveJobDetails(data));
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

  const deleteEquipmentApi = (value) => {
    try {
      dispatch({ type: SET_LOADER_TRUE });

      const handleCallback = {
        success: (data) => {
          const msgCode = data?.Message?.MessageCode;
          FlashMessageComponent('success', strings(`Response_code.${msgCode}`));

          dispatch({ type: SET_LOADER_FALSE });
          apiCallBack();
          // let dataset = {
          //   token: token,
          //   TechId: userInfo?.sub,
          //   WojobId: jobInfo?.WoJobId,
          //   CompanyId: userInfo?.CompanyId,
          //   customFieldentity: '3,16',
          // };
          // fetchJobDetails(dataset, callBack);
        },
        error: (error) => {
          dispatch({ type: SET_LOADER_FALSE });
        },
      };

      let headers = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&WoJobId=${jobInfo?.WoJobId}&WoEquipmentId=${item?.WoEquipmentId}&SourceId=${1}`;
      if (isInternetReachable) {
        api.deleteEquipment('', handleCallback, headers, endPoint);
      }
      else {
        let obj = {
          id: stateInfo?.pendingApi?.length + 1,
          url: 'deleteEquipment',
          data: '',
          jobId: jobInfo?.WoJobId,
          endPoint: endPoint
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
    const LocalCb = () => {
      dispatch({ type: SET_LOADER_FALSE });
      !isInternetReachable && FlashMessageComponent('success', strings(`Response_code.${1003}`));
      fetchJobDetailRealm()
    }
    _deleteEquipLocally(value, LocalCb)
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteAction = (item) => {
    try {
      deleteEquipmentApi(item);

      row[index].close();
      toggleDeleteModal();
    } catch (error) {
      toggleDeleteModal();
    }
  };

  const handleEditAction = (item) => {
    try {
      row[index].close();
      navigation.navigate('AddNewEquipment', {
        title: strings('EditEquipment.title'),
        data: item,
      });
    } catch (error) { }
  };

  let Btns = [];
  let editBtn = {
    title: strings('Equipments.Edit'),
    action: () => handleEditAction(item),
    style: { backgroundColor: Colors.blue },
    SvgIcon:
      item?.title != ''
        ? () => <WhiteEditIcon width={iconWidth} height={iconHeight} />
        : null,
  };
  let deleteBtn = {
    title: strings('Equipments.Delete'),
    action: () => toggleDeleteModal(),

    style: { backgroundColor: Colors.deleateRed },
    SvgIcon:
      item?.title != ''
        ? () => <WhiteDeleteIcon width={iconWidth} height={iconHeight} />
        : null,
  };
  Editable == true && Btns.push(editBtn);
  Delete == true && Btns.push(deleteBtn);

  return (
    <>
      <SwipeableComponent
        index={index}
        row={row}
        rowOpened={(index) => {
          closeRow(index);
        }}
        enabled={Btns?.length > 0 && jobInfo?.SubmittedSource != 2 ? true : false}
        containerStyle={{
          shadowOffset: { width: 0, height: 0 },
          shadowColor: Colors?.white,
          elevation: 0,
          backgroundColor: Colors.white,
        }}
        buttons={Btns}>
        {children}
      </SwipeableComponent>
      {showDeleteModal ? (
        <ConfirmationModal
          title={strings('Equipments.Confirmation')}
          discription={strings('Equipments.Are_you_sure_want_to_Delete')}
          handleModalVisibility={toggleDeleteModal}
          visibility={showDeleteModal}
          handleConfirm={() => handleDeleteAction(item)}
        />
      ) : null}
    </>
  );
};

const EquipmentList = ({ navigation }) => {
  const [showAddMore, setShowAddMore] = useState(false);
  const { height, width } = useDimensions();
  const [width1, setWidth] = useState(width);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [showServiceReprtModal, setShowServiceReprtModal] = useState(false);
  const serviceReportVisible = useSelector(
    (state) => state?.ServiceReportReducer?.serviceReportVisible,
  );
  const isLoading = useSelector((state) => state?.authReducer?.isLoading);
  const { colors } = useColors();

  const jobDetails = useSelector((state) => state?.jobDetailReducers?.data);
  const equipmentList = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetJobEquipment,
  );
  const [permission, setPermission] = useState({});
  const [equipmentListData, setequipmentListData] = useState(
    [],
    // equipmentList,
  );

  const userInfo = useSelector((state) => state?.authReducer?.userInfo);

  const [scroll, setScroll] = useState(false);

  const dispatch = useDispatch();

  const toggleServiceReprtModal = () => {
    dispatch(serviceReportVisibleAction(!serviceReportVisible));
    if (serviceReportVisible) {
      dispatch(serviceReportdisable());
    }
  };
  const jobInfo = useSelector(
    (state) => state?.jobDetailReducers?.data?.TechnicianJobInformation,
  );
  const token = useSelector((state) => state?.authReducer?.token);
  const [allAttchmentList, setAllAttchmentList] = useState([]);

  const [showQR, setShowQR] = useState(false);

  const toggleShowQR = () => {
    setShowQR(!showQR);
  };
  useEffect(() => {
    setequipmentListData(equipmentList);
  }, [equipmentList]);

  useEffect(() => {
    getEquipmentAttachmentList();
  }, []);

  useEffect(() => {
    accessPermission('Equipment').then((res) => setPermission(res));
  }, []);


  useEffect(() => {
    if (IsFocused)
      fetchEquimentList();
  }, [IsFocused]);


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      fetchEquimentList();

    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchEquimentList = () => {
    try {
      const handleCallback = {
        success: (res) => {

          dispatch(saveJobDetails({ ...jobDetails, GetJobEquipment: res }));

          let temp = [];
          if (res?.length > 0) {
            res.forEach((item) => {
              if (temp?.length > 0) {
                let flag = false;
                temp.forEach((val) => {
                  if (
                    val.Brand == item.Brand &&
                    val.Model == item.Model &&
                    val.SerialNo == item.SerialNo &&
                    val.TagNo == item.TagNo
                  ) {
                    flag = true;
                  }
                });
                if (!flag) {
                  temp.push(item);
                }
              } else {
                temp.push(item);
              }
            });
            // setUserData(temp);
            // setUserDataList(temp);

          }

          setUserData(res);
          setUserDataList(res);
        },
        error: (Err) => { },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&JobId=${jobInfo?.WoJobId}`;
      const header = Header(token);
      api.GetJobEquimentOnline('', handleCallback, header, endPoint);
    } catch (error) {
    }
  };

  const getEquipmentAttachmentList = () => {
    try {
      const data = {
        CompanyId: userInfo?.CompanyId,
        JobId: [jobInfo?.WoJobId],
      };
      const handleCallback = {
        success: (getEquipAttachRes) => {
          console.log('getEquipAttachRes==>',getEquipAttachRes)
          setAllAttchmentList(getEquipAttachRes);
          dispatch(saveEquimentattchment(getEquipAttachRes));
        },
        error: (getEquipAttachErr) => { },
      };
      const header = Header(token);
      api.getEquipmentAttachment(data, handleCallback, header);
    } catch (error) { }
  };

  const searchAction = () => {
    if (searchQuery?.length != 0) {
      const filteredData = userDataList.filter(function (item) {
        const Brand =
          item?.Brand != null ? item?.Brand.toString().toLowerCase() : '';
        const Model =
          item?.Model != null ? item?.Model.toString().toLowerCase() : '';
        const SerialNo = item?.SerialNo
          ? item?.SerialNo.toString().toLowerCase()
          : '';
        const TagNo = item?.TagNo ? item?.TagNo.toString().toLowerCase() : '';
        const Desc = item?.Description ? item?.Description.toLowerCase() : '';
        const textData = searchQuery.toString().toLowerCase().trim();
        return (
          Brand.includes(textData) ||
          Model.includes(textData) ||
          SerialNo.includes(textData) ||
          TagNo.includes(textData) ||
          Desc.includes(textData)
        );
      });
      setUserData(filteredData);
    } else {
      setUserData(userDataList);
    }
  };

  const onSuccess = (e) => {
    try {
      e
        ? (setSearchQuery(e?.data),
          Alert.alert('Success', e?.data, [
            {
              text: 'Cancel',
              onPress: () => toggleShowQR(),
              style: 'cancel',
            },
            { text: 'Yes', onPress: () => searchAction() },
          ]))
        : Alert.alert(strings('QRCodeUI.Equipment_not_found'));
      // navigation.navigate('AddNewEquipment', {title: 'Add New Equipment'})
    } catch (error) {
      Alert.alert(`Something Went Wrong !!`);
    }
    setShowQR(!showQR);
  };

  const toggleSearchIcon = () => {
    setShowSearch(!showSearch);
  };
  const handleCancelSearch = () => {
    try {
      setUserData(userDataList);
      toggleSearchIcon();
      if (showSearch) {
        // coding
      }
    } catch (error) { }
  };

  const headerRightIcons = [
    {
      name: !showSearch ? SearchIcon : CrossIcon,
      onPress: handleCancelSearch,
    },
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
  //   if (IsFocused) {
  //     let data = {
  //       token: token,
  //       TechId: userInfo?.sub,
  //       WojobId: jobInfo?.WoJobId,
  //       CompanyId: userInfo?.CompanyId,
  //       customFieldentity: '3,16',
  //     };
  //     fetchJobDetails(data, callBack2);
  //   }
  // }, [IsFocused]);
  const filterByModal = (ele, item) => {
    return item?.ModelId == ele?.ModelId;
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
    const filterData = allAttchmentList.filter((ele) => {
      return item?.ModelId == ele?.ModelId;
    });

    return (
      <View style={styles.cardView}>
        <WrapperComponent
          item={item}
          navigation={navigation}
          row={row}
          index={index}
          Editable={permission?.Edit}
          Delete={permission?.Delete}
          closeRow={(index) => closeRow(index)}
          apiCallBack={fetchEquimentList}>
          <View style={styles.main}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <View style={{ marginBottom: normalize(12) }}>
                  <Text align={'flex-start'}>
                    {strings('Equipments.model_1')}
                  </Text>
                  <Text align={'flex-start'} style={{ fontFamily: ff }}>
                    {item?.Model}
                  </Text>
                </View>
                <View>
                  <Text align={'flex-start'}>{strings('Equipments.gps')}</Text>
                  <Text align={'flex-start'} style={{ fontFamily: ff }}>
                    {item?.TagNo == '' || item?.TagNo == null
                      ? `${strings('Equipments.tag')} -`
                      : `${strings('Equipments.tag')}`}
                    {item?.TagNo}
                  </Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text align={'flex-end'}>{strings('Equipments.brand_1')}</Text>
                <Text align={'flex-end'} style={{ fontFamily: ff }}>
                  {item?.Brand}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: '#D3D3D3',
                marginVertical: 10,
              }}
            />
            <View
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <Text 
              // align={'flex-start'} 
              style={{ fontFamily: ff, 
              // width: '90%',
               }}>
                {item.SerialNo == '' || item.SerialNo == null
                  ? `${strings('Equipments.serial')} -`
                  : `${strings('Equipments.serial')}`}
                {item.SerialNo}
              </Text>
              <View style={styles.title}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('EquipmentAttachment', {
                      attachmentData: filterData,
                    })
                  }>
                  {filterData.length > 0 ? (
                    <>
                  <AttachmentIcon
                    style={styles.userImage}
                    color={Colors?.secondryBlack}
                    // color={colors.PRIMARY_BACKGROUND_COLOR}
                    height={normalize(18)}
                    width={normalize(17.43)}
                  />
                  <View style={[styles.notifyNumber, { backgroundColor: colors.PRIMARY_BACKGROUND_COLOR, }]}>
                        <Text style={styles.whitecolor}>
                          {filterData?.length}
                        </Text>
                      </View>
                    </>
                  ) : null}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </WrapperComponent>
      </View>
    );
  };

  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
  };

  const HeaderSection = () => {
    return (
      <View style={styles.flexView}>
        <View style={{ paddingHorizontal: normalize(15) }}>
          <TouchableOpacity onPress={() => toggleShowQR()}>
            <Text>
              {' '}
              <SerialSearchQRIcon height={iconHeight} width={iconWidth} />
              {'   '}
              {strings('Equipments.scan')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: normalize(15) }}>
          <TouchableOpacity
            disabled={jobInfo?.SubmittedSource != 2 ? !permission?.Add : true}
            onPress={() => {
              navigation.navigate('AddNewEquipment', {
                title: 'Add New Equipment',
              });
            }}>
            <Text
              color={permission.Add ? Colors.secondryBlack : Colors.darkGray}>
              {' '}
              <PlusIcon
                fill={permission.Add ? Colors.secondryBlack : Colors.darkGray}
                height={iconHeight}
                width={iconWidth}
              />
              {'   '}
              {strings('Equipments.add_new')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ paddingHorizontal: normalize(15) }}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={jobInfo?.SubmittedSource != 2 ? !permission.Add : true}
            onPress={() => {
              navigation.navigate('SelectEquipment');
            }}>
            <Text
              color={permission.Add ? Colors.secondryBlack : Colors.darkGray}>
              {' '}
              <PlusBar
                height={iconHeight}
                width={iconWidth}
                fill={permission.Add ? Colors.secondryBlack : Colors.darkGray}
              />
              {'   '}
              {strings('Equipments.add_existing')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {!showQR ? (
        <View style={{ flex: 1 }}>
          <SafeAreaView style={commonStyles}>
            <HeaderComponents
              title={`${strings('Equipments.title')} (${userDataList.length})`}
              leftIcon={'Arrow-back'}
              navigation={navigation}
              headerTextStyle={styles.headerStyles}
              HeaderRightIcon={headerRightIcons}
              containerStyle={{
                shadowColor: '#ffffff',
                shadowOffset: { width: 0, height: 0 },
              }}
            />

            {showSearch ? (
              <SearchBar
                searchAction={() => searchAction()}
                onChangeText={(data) => setSearchQuery(data)}
                onEndEditing={searchAction}
              />
            ) : null}
            {scroll === true ? (
              <View
                style={{
                  marginBottom: normalize(40),
                  backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
                  borderBottomRightRadius: normalize(10),
                  borderBottomLeftRadius: normalize(10),
                }}>
                <View style={[styles.topView, { height: normalize(40) }]}></View>

                <View style={styles.outerView1}>{HeaderSection()}</View>
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
                  <Text style={{ color: 'white' }}>Job #{jobInfo?.WoJobId}</Text>
                </View>

                <View style={styles.outerView}>{HeaderSection()}</View>
              </View>
            ) : null}
            <ScrollView
              onScroll={({ nativeEvent }) => {
                if (isCloseToTop(nativeEvent)) {
                  setScroll(false);
                } else {
                  setScroll(true);
                }
              }}>
              {equipmentListData?.length > 0 ? (
                <FlatList
                  data={equipmentListData}
                  renderItem={renderComponent}
                  keyExtractor={(item, index) => `${index}`}
                />
              ) : (
                <View style={styles.emptyMsgStyle}>
                  <DataNotFound />
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
          <TabShape navigation={navigation} />
          {showAddMore ? (
            <AddMoreModal
              visibility={showAddMore}
              handleModalVisibility={toggleAddMore}
              txtColor={Colors.white}
              TxtStyle={{ color: Colors.white }}
            />
          ) : null}

          {serviceReportVisible ? (
            <EquipmentServiceReportModal
              visibility={serviceReportVisible}
              handleModalVisibility={toggleServiceReprtModal}
            />
          ) : null}
        </View>
      ) : (
        <QRCodeUI
          onSuccess={onSuccess}
          onCancel={toggleShowQR}
          onDone={onSuccess}
        />
      )}
      {/* <Loader visibility={isLoading} /> */}
    </>
  );
};

export default EquipmentList;
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
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    alignSelf: 'center',
    marginHorizontal: normalize(10),
    // color: '#ffffff',
  },
  TxtStyles: {
    flex: 1,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    marginLeft: normalize(20),
    color: Colors.white,
  },
  notifyNumber: {
    position: 'absolute',
    top: normalize(5),
    left: normalize(15),
    // right:normalize(28),

    height: normalize(18),
    width: normalize(18),
    borderRadius: 18,
    justifyContent: 'center',
  },
  whitecolor: {
    color: '#ffffff',
  },
  cardView: {
    borderRadius: 5,
    width: '95%',
    alignSelf: 'center',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.25,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 10,
    marginVertical: 6,
  },
  heading: {
    fontFamily: fontFamily.bold,
    marginTop: normalize(15),
    paddingBottom: normalize(2),
    fontSize: normalize(14),
  },
  outerView1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: normalize(10),
    backgroundColor: Colors.white,
    borderRadius: 50,
    shadowOffset: { height: 2, width: 2 },
    elevation: 2,
    shadowOpacity: 0.5,
    justifyContent: 'space-evenly',
    margin: normalize(20),
    position: 'absolute',
    alignSelf: 'center',
    width: width - 30,
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  main: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    backgroundColor: Colors.white,
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
  outerView: {
    // flexDirection: 'row',
    // alignItems: 'center',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    backgroundColor: Colors?.lightGray,
    justifyContent: 'space-between',
    // backgroundColor: 'red'
  },
  emptyMsgStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: normalize(100),
  },
});
