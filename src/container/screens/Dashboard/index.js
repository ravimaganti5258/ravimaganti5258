import AsyncStorage from '@react-native-async-storage/async-storage';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  BlueCalendar,
  Cube,
  Download,
  GrayArrowBack,
  GreenTick,
  Lock,
  SandClock,
  Settings2,
  Timmer,
  WhiteLogout,
  WhiteLogout2,
  YellowCalendar,
} from '../../../assets/img/index.js';
import {Colors} from '../../../assets/styles/colors/colors';
import DashboardBottomTab from '../../../components/DashboardBottomTab';
import Graph from '../../../components/Graph';
import Loader from '../../../components/Loader/index.js';
import SearchBar from '../../../components/SearchBar/index.js';
import { CHECK_IN, USERINFO } from '../../../database/allSchemas';
import { storeLoginData, storeUserInfo } from '../../../database/Auth';
import {
  insertNewRealmObject,
  queryAllRealmObject,
} from '../../../database/index';
import {
  saveJobDetailInLocal,
  updateJobDetailsRealmObject,
  fetchJobDetailsData,
} from '../../../database/JobDetails';
import {
  storeJobListInLocal,
  updateJobListRealmObject,
  getJobListFromLocal,
} from '../../../database/JobList';
import {
  fetchJobCalenderSetting,
  storeMasterData,
} from '../../../database/webSetting';
import {useColors} from '../../../hooks/useColors';
import {useNetInfo} from '../../../hooks/useNetInfo';
import api from '../../../lib/api/index.js';
import {
  addZeroPrecesion,
  dateFormat,
  fontFamily,
  normalize,
} from '../../../lib/globals';
import {strings} from '../../../lib/I18n';
import {pushNotification} from '../../../lib/pushNotification';
import {ASK_AGAIN, ENABLE_SECURITY} from '../../../redux/auth/types';
import {fetchJobDetails} from '../../../redux/jobDetails/action';
import {fetchJobList} from '../../../redux/jobList/action';
import {handleCheckIn, handleCheckOut} from '../../../redux/log/action/action';
import {fetchMasterData} from '../../../redux/masterData/action';
import {Header} from '../../../lib/buildHeader';
import moment from 'moment';
import {
  saveDashboardDataInLocal,
  fetchDashboardData,
  updateDashboardRealmObject,
} from '../../../database/dashboard/index.js';
import { useIsFocused } from '@react-navigation/native';
import {useAppState} from '../../../hooks/useAppState'
import {
  getProfileDataSuccess,
  getProfileDataFailure,
} from '../../../redux/Profile/action';
import {
  checkSupportForBiometric,
  dummyWeek,
  getCurrentLocation,
  StartEndDate,
} from '../../../util/helper';
import BottomSheet from './BottomSheet';
import { useFocusEffect } from '@react-navigation/native';
import { encrypter } from '../../../util/encrypter.js';
import BackgroundTimer from 'react-native-background-timer';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import CheckBtn from '../../../components/Button/checkBtn.js';
import { fetchNotificationList } from '../../../redux/notification/action.js';
import { saveProfileInLocal } from '../../../database/Profile/index.js';
import { savePartRequirementInLocal } from '../../../database/partRequirement/index.js';
import { fetchPartLookUpListLocal, savePartLookUpInLocal } from '../../../database/PartLookup/index.js';
import { storeMobilePrevilageInLocal } from '../../../database/MobilePrevi/index.js';
import { CHECK_IN_SUCCESS, CHECK_OUT_SUCCESS } from '../../../redux/log/type.js';

const accessToken =
  'pk.eyJ1Ijoic2FtamhvbiIsImEiOiJja3BtcHJkYmwwNDZ2MnBwNGFxM2t6aHNhIn0.J98EOu8zFbzMQ3fi34K6zw';
MapboxGL.setAccessToken(`${accessToken}`);

const Dashboard = (props) => {
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const token = useSelector((state) => state?.authReducer?.token);
  const AuthDatail = useSelector((state) => state?.authReducer);
  const masterData = useSelector((state) => state?.masterDataReducer.data);
  const stateInfo = useSelector((state) => state.backgroungApiReducer);
  const [jobsatatus, setjobsatatus] = useState([{ JobStatus: 'pending' }]);
  const [searchQuery, setSearchQuery] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [graphVisible, SetGraphVisible] = useState(true);
  const checkIn = useSelector((state) => state.logReducer.ischeckIn);
  const checkoutData = useSelector((state) => state.logReducer);
  const { isInternetReachable } = useNetInfo();
  const { isConnected } = useNetInfo();
  const [paymentCollection, setPaymentCollection] = useState(false);
  const [loader, setLoader] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [profileData, setProfileData] = useState(null);
  const [trackData, setTrackData] = useState([]);
  const [totalJobsInWeek, setTotalJob] = useState([]);
  const [completedJobsInWeek, setCompletedJob] = useState([]);
  const [userCurrentLocation, setUserCurrentLocation] = useState(null);
  const [backgroundTimout, setBackgroundTimout] = useState(300000);
  const notification_list = useSelector(
    (state) => state?.NotificationReducer?.data,
  );
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {appStateVisible} = useAppState();

useEffect(()=>{
  let interval =null;
  const calenderListSetting = masterData?.SystemSettings?.filter((obj) => {
   
    if(obj?.SettingId == 23){
      var systemVal =parseFloat(obj?.SettingValue) *20000
      interval =   setInterval(() => {
        TrackDataPush();
        _insertTrackRouteApiCall()
        userLocation()
      }, systemVal);

    }
    
  });
  return ()=>clearInterval(interval);
},[appStateVisible,masterData])

  let jobListFromLocal;
  let jobDetailsFromLocal;
  let FromDate;
  let ToDate;
  useEffect(() => {
    fetchDashboardData().then((res) => {
      setDashboardData(res[0]);
    });
    getJobListFromLocal().then((data) => {
      jobListFromLocal = data;
    });
    fetchJobDetailsData().then((data) => {
      jobDetailsFromLocal = data;
    });
    queryAllRealmObject(USERINFO).then((obj) => {
      if (obj[0] !== undefined) {
        setProfileData(obj[0]);
      }
    });
  }, [masterData]);

  useEffect(() => {
    pushNotification.configure();
    if (isInternetReachable) {
      userLocation();
    }
    // dahsboardDataAPI();
  }, []);

  useEffect(() => {
    checkIfFirstLaunch();
    queryAllRealmObject(MASTER_DATA).then((data) => {
      const value = data[0]?.SystemSettings[32]?.SettingValue;
      let time = value * 1000 * 60;
      setBackgroundTimout(time);
    });
  }, []);

  const getPartsLookupList = () => {
    try {
      const handleCallback = {
        success: (partsLookupListRes) => {
          savePartLookUpInLocal(partsLookupListRes.PartLookupLists)
        },
        error: (lookUpError) => {
          console.log({ lookUpError })
        },
      };
      const endPoint = `?CompanyId=${userInfo?.CompanyId}`;
      let headers = Header(token);
      api.getPartsLookupList('', handleCallback, headers, endPoint);
    } catch (error) {

    }
  };

  useEffect(() => {
    if (isInternetReachable)
      getPartsLookupList();
  }, []);

  useEffect(() => {
    queryAllRealmObject(MASTER_DATA).then((data) => {
      const arr = [];
      const dayRef = data[0];
      const jobDetailsCalender = dayRef?.SystemSettings.filter(
        (obj) => obj?.SettingId === 77,
      );
      // return jobDetailsCalender;
      const days = jobDetailsCalender[0]?.SettingValue;
      const FDate = moment().subtract(days, 'd').format('MM/DD/YYYY');
      const TDate = moment().add(days, 'd').format('MM/DD/YYYY');
      const monthFDate = (FDate.split('/'));
      const monthTDate = (TDate.split('/'));
      // if (FDate[0] < TDate[0]) {
        FromDate = FDate
        ToDate = TDate
      // }
      // else {
      //   const FeDate = moment().subtract(30, 'd').format('MM/DD/YYYY');
      //   const TeDate = moment().add(15, 'd').format('MM/DD/YYYY');
      //   FromDate = FeDate
      //   ToDate = TeDate
      //   // FromDate = '01/01/2022'
      //   // ToDate = '06/01/2022'
      // }
    });
  }, [masterData]);

  useEffect(() => {
    if (isInternetReachable) {
      storeLoginData(AuthDatail);
      storeUserInfo(AuthDatail);
    }
  }, [AuthDatail]);


  useFocusEffect(
    React.useCallback(() => {
      if (isInternetReachable) {
        fetchProfileData()
      }
    }, []),

  );

  //current week view for job for week
  const weeks = [];
  (() => {
    var currentDate = moment();

    var weekStart = currentDate.clone().startOf('isoweek');

    for (var i = 0; i <= 6; i++) {
      weeks.push(moment(weekStart).add(i, 'days').format('DD MMM'));
    }
  })();

  const fetchProfileData = () => {
    try {
      const handleCallback = {
        success: (data) => {
          dispatch(getProfileDataSuccess(data));
          setProfileData(data);
          setLoader(false);
          saveProfileInLocal(data);
        },
      };
      let endpoint = `?CompanyId=${userInfo?.CompanyId}&LoginId=${userInfo?.sub}`;
      api.getUserProfile(
        '',
        handleCallback,
        {
          Authorization: `Bearer ${token}`,
        },
        endpoint,
      );
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    if (isInternetReachable) {
      fetchAllNotificationApi();
    }
  }, [masterData]);

  const fetchAllNotificationApi = () => {
    const NoOfDays = getNoOFDaysFetch();
    const startEndDate = StartEndDate(NoOfDays);
    const data = {
      CompanyId: userInfo?.CompanyId,
      TechId: userInfo?.sub,
      FromDate: startEndDate?.startDate,
      ToDate: startEndDate?.endDate,
      token: token,
    };

    dispatch(fetchNotificationList(data));
  };

  useEffect(() => {
    getLanguage_DataApi();
  }, []);

  const getLanguage_DataApi = () => {
    try {
      const handleCallback = {
        success: (data) => {},
      };
      const header = Header(token);
      const endPoint = `/${userInfo?.CompanyId}/${'en'}`;
      api.getLanguage_Data('', handleCallback, header, endPoint);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleGraphView = () => {
    SetGraphVisible(!graphVisible);
  };

  const userLocation = async () => {
    await getCurrentLocation()
      .then((loc) => {
        setUserCurrentLocation(loc);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkIfFirstLaunch = async () => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value == null) {
        getMasterData();

        AsyncStorage.setItem('alreadyLaunched', 'true');
      } else {
        getMasterData();
      }
      if (isInternetReachable) {
        getJobList();
        getJobDetails();
      }
    });
  };

  const getMasterData = () => {
    if (isInternetReachable) {
      let obj = {
        LoginId: userInfo?.sub,
        CompanyId: userInfo?.CompanyId,
        token: token,
      };
      dispatch(fetchMasterData(obj, storeMasterData));
    }
  };

  const getJobList = () => {

    const data = {
      CompanyId: userInfo?.CompanyId,
      MaxRoleGroupId: userInfo?.MaxRoleGroup,
      LoginVendorId: userInfo?.VendorId,
      LoginId: userInfo?.sub,
      token: token,
      DurationStartDate: FromDate ?? '06/02/2021',
      DurationEndDate: ToDate ?? '12/07/2022',
      //LastSyncDate: new date('DD:MM:YYYY HH:MM:SS'),
    };
    dispatch(fetchJobList(data, jobListCompare));
  };


  const jobListCompare = (res) => {
    //compare code....
    storeJobListInLocal(res);
    let array1 = res.sort();
    let array2 = jobListFromLocal.sort();
    let check = false;
    array1.filter(function (value, index) {
      if (JSON.stringify(value) !== JSON.stringify(array2[index])) {
        check = true;
      }
    });
    if (check === true) {
      updateJobListRealmObject(res);
    }
  };

  const getJobDetails = () => {
    let data = {
      token: token,
      TechId: userInfo?.sub,
      WojobId: 0,
      CompanyId: userInfo?.CompanyId,
      customFieldentity: '3,16',
      DurationStartDate: FromDate ?? '06/02/2021',
      DurationEndDate: ToDate ?? '12/07/2022',
      LastSyncDate: '',
    };

    fetchJobDetails(data, jobDetailsCompare);
  };

  const jobDetailsCompare = (res) => {
    
    //compare code....
    saveJobDetailInLocal(res);
    let array1 = res.sort();
    let array2 = jobDetailsFromLocal.sort();
    let check = false;
    array1.filter(function (value, index) {
      if (JSON.stringify(value) !== JSON.stringify(array2[index])) {
        check = true;
      }
    });
    if (check === true) {
      updateJobDetailsRealmObject(res);
    }
    setLoader(false);
  };

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      timer();
    }, backgroundTimout);
  }, [FromDate]);

  const timer = () => {
    getJobList();
    getJobDetails();
    BackgroundTimer.stopBackgroundTimer();
  };

  const askForManageSecurity = useSelector(
    (state) => state.authReducer?.askForManageSecurity,
  );
  const enableSecurity = useSelector(
    (state) => state.authReducer?.enableSecurity,
  );

  const rememberMe = useSelector((state) => state.authReducer?.rememberMe);

  const {colors} = useColors();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(true);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkLoader, setcheckLoader] = useState(false);

  const handleCancel = async (value) => {
    setShowModal(false);
    dispatch({type: ASK_AGAIN, payload: value});
    dispatch({type: ENABLE_SECURITY, payload: switchValue});
    if (rememberMe) {
      try {
        await AsyncStorage.setItem(
          'enableSecurity',
          JSON.stringify(switchValue),
        );
        await AsyncStorage.setItem('askAgain', JSON.stringify(value));
      } catch (error) {}
    }
  };

  const toggleSwitch = () => {
    setSwitchValue(!switchValue);
  };

  const [biometricSupported, setBiometricSupported] = useState(false);

  useEffect(() => {
    handleCheckSupport();
  }, []);

  const handleCheckSupport = async () => {
    try {
      const value = await checkSupportForBiometric();
      setBiometricSupported(value);
    } catch (error) {}
  };

  // const fetchDataRealm = () => {
  //   queryAllRealmObject(MASTER_DATA).then((obj) => {
  //     let resRelam = obj;
  //   });
  // };
//structure compon
  const fetchData = () => {
    queryAllRealmObject(CHECK_IN).then((obj) => {
      obj?.map((item) => {
        if (item.checkInLabel == 'CHECK_IN') {
          dispatch({ type: CHECK_IN_SUCCESS })
        }
        else {
          dispatch({ type: CHECK_OUT_SUCCESS });
        }
      });
    });
  };

  /* Check-in Check-out handler  */

  const handleBtnClick = () => {
    setcheckLoader(true);
    const CHECKIN = checkoutData.ischeckIn;

    if (!isInternetReachable) {
      let date = new Date();
      date = date.toUTCString();
      let obj = {
        id: '1',
        checkInLabel: checkIn ? 'CHECK_IN' : 'CHECK_OUT',
        currentTime: date,
      };
      insertNewRealmObject(obj, CHECK_IN).then((res) => {
        fetchData();
      });
      // dispatch(handleCheckIn(data));
      setcheckLoader(false);
    } else {
      if (!CHECKIN) {
        let data = {
          MobUserLogId: 0,
          CompanyId: userInfo.CompanyId,
          TechId: userInfo.sub,
          token: token,
          isConnected: isInternetReachable,
          length: stateInfo?.pendingApi.length,
        };

        dispatch(handleCheckIn(data));
        setcheckLoader(false);
      } else {
        let res = checkoutData.userData;
        let response = res?.Data;

        const logId = response?.split('~');

        let data = {
          MobUserLogId: logId ? logId[0] : 0,
          CompanyId: userInfo.CompanyId,
          TechId: userInfo.sub,
          token: token,
          isConnected: isInternetReachable,
          length: stateInfo?.pendingApi.length,
        };

        dispatch(handleCheckOut(data));
        setcheckLoader(false);
      }
    }
  };

  const togglePaymentCollection = () => {
    setPaymentCollection(!paymentCollection);
  };
  useEffect(() => {
    if (isInternetReachable) {
      allPartRequirementApiCall()
      getMobileChildPrivilegesApi();
    }
  }, []);


  const allPartRequirementApiCall = () => {
    try {

      const handleCallback = {
        success: (data) => {
          savePartRequirementInLocal(data)

        },
        error: (error) => {

        },
      };

      const header = Header(token);

      const endPoint = `?CompanyId=${userInfo?.CompanyId}&TechId=${userInfo?.sub}`;
      api.getAllPartRequirement('', handleCallback, header, endPoint)
    } catch (error) {

    }
  };
  /* for get menubar permission  */

  const getMobileChildPrivilegesApi = () => {
    try {
      const handleCallback = {
        success: (data) => {
          storeMobilePrevilageInLocal(data);
        },
        error: (error) => {},
      };
      const header = Header(token);
      const endPoint = `?CompanyId=${userInfo?.CompanyId}&LoginId=${userInfo?.sub}`;
      api.getMobileChildPrivileges('', handleCallback, header, endPoint);
    } catch (error) {}
  };

  const getNoOFDaysFetch = () => {
    const calenderListSetting = masterData?.SystemSettings?.filter((obj) => {
      return obj?.SettingId == 77;
    });
    const days =
      calenderListSetting != undefined
        ? calenderListSetting[0]?.SettingValue
        : 1;
    return days;
  };


  useEffect(() => {
    const isEmpty = Object.keys(masterData).length === 0;
    if (isFocused && !isEmpty && isInternetReachable) {
      dahsboardDataAPI();
    }
  }, [isFocused, masterData]);

  /* for get DashboardData */

  const dahsboardDataAPI = () => {
    let datefrmt = moment(new Date()).format('L');
    try {
      const data = {
        CompanyId: userInfo.CompanyId,
        LoginId: userInfo.sub,
        FromDate: FromDate ?? '08/06/2021',
        ToDate: ToDate ?? moment(new Date()).format('L'),
      };
      const handleCallback = {
        success: (data) => {
          saveDashboardDataInLocal(data);
          let DD = Object.entries(data);
          let DDD = Object.entries(dashboardData);
          DDD.shift(0);
          let array1 = DD.slice().sort();
          let array2 = DDD.slice().sort();
          let check = false;
          array1.filter(function (value, index) {
            if (JSON.stringify(value) !== JSON.stringify(array2[index])) {
              check = true;
            }
          });
          if (check === true) {
            updateDashboardRealmObject(data);
          }

          let cj = data.GetWeeklyReport.map(item => item.CompletedJobs);
          let tj = data.GetWeeklyReport.map(item => item.TotalJobs);

          setCompletedJob(cj);
          setTotalJob(tj);
          setDashboardData(data);
          setLoader(false);
        },
        error: (error) => {
          console.log(error);
        },
      };
      let endpoint = `?CompanyId=${userInfo?.CompanyId}`;
      api.getDashboardData(
        data,
        handleCallback,
        {Authorization: `Bearer ${token}`},
        endpoint,
      );
    } catch (er) {
      setLoader(false);
      console.log(er);
    }
  };

  useEffect(() => {
    if (AuthDatail?.userCredentials?.userName !== undefined && AuthDatail?.userCredentials?.userName != null) {
      const userNameEncoded = encrypter(AuthDatail?.userCredentials?.userName);
      const passwordEncoded = encrypter(AuthDatail?.userCredentials?.password);
      if (AuthDatail?.userCredentials?.userName) {
        AuthDatail.userCredentials.userName = userNameEncoded;
        AuthDatail.userCredentials.password = passwordEncoded;
        storeLoginData(AuthDatail);
        storeUserInfo(AuthDatail);
      } else {
        if (isInternetReachable) {
          storeLoginData(AuthDatail);
          storeUserInfo(AuthDatail);
        }
      }
    }
  }, [AuthDatail]);
  /* for pushed Current location */

  const TrackDataPush = () => {
    let data = [...trackData];

    const currentDate = new Date();
    let obj = {
      CompanyId: userInfo?.CompanyId,
      TechId: userInfo?.sub,
      Latitude: userCurrentLocation != null && userCurrentLocation[0],
      Longitude: userCurrentLocation != null && userCurrentLocation[0],
      CreatedBy: userInfo?.sub,
      CreatedDate: dateFormat(currentDate, 'DD/MM/YYYY HH:MM:MS 12TF'),
    };
    data.push(obj);
    setTrackData(data);
  };

  useEffect(() => {
    const interval = setInterval(() => TrackDataPush(), 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const interval = setInterval(() => _insertTrackRouteApiCall(), 300000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  /* for inserts live location */
  const _insertTrackRouteApiCall = () => {
    if (isInternetReachable) {
      try {
        const handleCallback = {
          success: (data) => {
            setTrackData([]);
          },
          error: (error) => {
            console.log({ error });
          },
        };

        const payload = trackData;

      api.insertTrackRoute(payload, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (er) {
      console.log(er);
    }
  }};
  //For navigating JobList

  const navigateToJobList = (jobId) => {
    try {
      navigation.navigate('JobList', {
        screen: 'JobList',
        params: {JobStatusId: jobId},
      });
    } catch (error) {}
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
        bounces={false}
        scrollEnabled={true}
        style={styles.container}>
        <SafeAreaView style={styles.safeAreaContainer}>
          {/* <Loader visibility={loader} /> */}
          {/* <View
            style={{
              backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
              paddingTop: normalize(10),
            }}>
            {searchBarVisible ? (
              <SearchBar
                searchAction={searchAction}
                onChangeText={(data) => setSearchQuery(data)}
                style={{ ...props.style, color: Colors.white }}
                iconColorStyle={{ color: Colors.white, fontSize: normalize(18) }}
              />
            ) : null}
          </View> */}
          <View
            style={[
              styles.topViewContainer,
              {backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR},
            ]}>
            <View style={styles.userNameView}>
              <Text style={styles.headerText1}>{strings('login.hello')}</Text>
              <Text style={styles.headerText2}>
                {profileData?.DisplayName ? profileData?.DisplayName : userInfo?.DisplayName ? userInfo?.DisplayName : ''}
                {/* {profileData?.DisplayName ? profileData?.DisplayName : ''} */}
              </Text>
            </View>
            <View style={styles.checkInView}>
              <View style={styles.checkButtonContainer}>
                <CheckBtn
                  title={
                    !checkIn
                      ? strings(`side_menu.check-in`)
                      : strings(`side_menu.check-out`)
                  }
                  onPress={() => handleBtnClick()}
                  bgColor={colors?.PRIMARY_BACKGROUND_COLOR}
                  checkIn={checkIn}
                  loader={checkLoader}
                />
              </View>
              <TouchableOpacity
                style={styles.settingIcon}
                onPress={() => navigation.navigate('Settings')}>
                <Settings2
                  style={[
                    styles.svgIcons,
                    {
                      marginRight: normalize(5),
                    },
                  ]}
                  height={normalize(24)}
                  width={normalize(23)}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.appointmentToday}
            activeOpacity={1}
            onPress={() => navigateToJobList(-1)}>
            <YellowCalendar
              style={styles.svgIcons}
              height={normalize(25)}
              width={normalize(25)}
            />
            <Text style={styles.appointmentText}>
              {strings('dashboard.Appointments_Today')}
            </Text>
            <Text
              style={[
                styles.appointmentText,
                {
                  fontSize: normalize(30),
                  color: Colors.deepDarkOrange,
                  position: 'absolute',
                  right: 0,
                },
              ]}>
              {addZeroPrecesion(dashboardData?.Todayjobs) ?? '0'}
            </Text>
          </TouchableOpacity>

          <View style={styles.bottomViewContainer}>
            <View style={styles.cardsView}>
              <TouchableOpacity onPress={() => navigateToJobList(5)}>
                <View
                  style={[
                    styles.subCards,
                    {backgroundColor: Colors.lightGreenLeaf},
                  ]}>
                  <GreenTick
                    style={styles.svgIcons}
                    height={normalize(25)}
                    width={normalize(25)}
                  />
                  <Text
                    style={[
                      styles.cardNumber,
                      {
                        color: '#18BE12',
                        fontSize: normalize(25),
                        width: '100%',
                      },
                    ]}
                    numberOfLines={1}>
                    {dashboardData?.InProgressJobs
                      ? dashboardData?.InProgressJobs
                      : '0'}
                  </Text>
                  <Text style={[styles.cardText, {paddingTop: normalize(10)}]}>
                    {strings('dashboard.Jobs_in_Progress')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToJobList(10)}>
                <View
                  style={[
                    styles.subCards,
                    {backgroundColor: Colors.deepLightBlue},
                  ]}>
                  <Lock
                    style={styles.svgIcons}
                    height={normalize(25)}
                    width={normalize(25)}
                  />
                  <Text
                    style={[
                      styles.cardNumber,
                      {
                        color: '#3C37FF',
                        fontSize: normalize(25),
                        width: '100%',
                      },
                    ]}
                    numberOfLines={1}>
                    {dashboardData?.UpcommingJobs ?? '0'}
                  </Text>
                  <Text style={[styles.cardText, {paddingTop: normalize(10)}]}>
                    {strings('dashboard.Upcoming_Jobs')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToJobList(13)}>
                <View
                  style={[
                    styles.subCards,
                    {backgroundColor: Colors.deepLightDangerRed},
                  ]}>
                  <Download
                    style={styles.svgIcons}
                    height={normalize(25)}
                    width={normalize(25)}
                  />
                  <Text
                    style={[
                      styles.cardNumber,
                      {
                        color: '#E53935',
                        fontSize: normalize(25),
                        width: '100%',
                      },
                    ]}
                    numberOfLines={1}>
                    {dashboardData?.OverdueJobs ?? '0'}
                  </Text>
                  <Text style={[styles.cardText, {paddingTop: normalize(10)}]}>
                    {strings('dashboard.Overdue_Jobs')}&nbsp;
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToJobList(12)}>
                <View
                  style={[
                    styles.subCards,
                    {backgroundColor: Colors.extraDeepLightBlue},
                  ]}>
                  <Timmer
                    style={styles.svgIcons}
                    height={normalize(25)}
                    width={normalize(25)}
                  />
                  <Text
                    style={[
                      styles.cardNumber,
                      {
                        color: '#1E6CFF',
                        fontSize: normalize(25),
                        width: '100%',
                      },
                    ]}
                    numberOfLines={1}>
                    {/* {dashboardData?.WaitingforSubmissionJobs ?? '0'} */}
                    {dashboardData?.WaitingforSubmissionJobs
                      ? addZeroPrecesion(
                          dashboardData?.WaitingforSubmissionJobs,
                        )
                      : '0'}
                  </Text>
                  <Text style={[styles.cardText, {paddingTop: normalize(10)}]}>
                    {strings('dashboard.Waiting_for_Submission')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.labelText,
                {fontSize: normalize(14)},
                {marginTop: normalize(35)},
                {marginBottom: normalize(5)},
              ]}>
              {strings('dashboard.Part_Requests')}
            </Text>
            <View style={styles.partsContainer}>
              <View
                style={[styles.partCards, {justifyContent: 'space-between'}]}>
                <View style={{flex: 0.8}}>
                  <Text
                    style={[
                      styles.cardText,
                      {
                        fontSize: normalize(15),
                        fontFamily: fontFamily.regular,
                      },
                    ]}>
                    {strings('dashboard.Total_Part')}
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      {
                        fontSize: normalize(15),
                        fontFamily: fontFamily.semiBold,
                      },
                    ]}>
                    {strings('dashboard.Requests')}
                  </Text>
                  <Text style={[styles.cardNumber, {color: Colors.blue}]}>
                    {dashboardData?.TotalPartRequestJobs
                      ? dashboardData?.TotalPartRequestJobs
                      : '0'}
                  </Text>
                </View>
                <View style={styles.iconBackground}>
                  <Cube
                    style={styles.svgIcons}
                    height={normalize(22)}
                    width={normalize(18)}
                  />
                </View>
              </View>
              <View
                style={[styles.partCards, {justifyContent: 'space-between'}]}>
                <View style={{flex: 0.8}}>
                  <Text
                    style={[
                      styles.cardText,
                      {
                        fontSize: normalize(15),
                        fontFamily: fontFamily.semiBold,
                      },
                    ]}>
                    {strings('dashboard.Awaiting')}
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      {
                        fontSize: normalize(15),
                        fontFamily: fontFamily.regular,
                      },
                    ]}>
                    {strings('dashboard.Allocation')}
                  </Text>
                  <Text style={[styles.cardNumber, {color: Colors.blue}]}>
                    {dashboardData?.WaitingAllocationJobs
                      ? dashboardData?.WaitingAllocationJobs
                      : '0'}
                  </Text>
                </View>
                <View style={styles.iconBackground}>
                  <SandClock
                    style={styles.svgIcons}
                    height={normalize(19)}
                    width={normalize(12)}
                  />
                </View>
              </View>
            </View>
            <Text style={[styles.labelText, {marginTop: normalize(5)}]}>
              {strings('dashboard.Payment_Collection')}
            </Text>
            <TouchableOpacity
              style={styles.paymentView}
              onPress={() => togglePaymentCollection()}>
              <View
                style={[
                  styles.paymentCollectionView,
                  {
                    backgroundColor:
                      paymentCollection === false ? Colors.white : '#DFE7FF',
                  },
                ]}>
                <Text
                  style={[
                    styles.cardText,
                    {
                      fontSize: normalize(14),
                      fontFamily: fontFamily.regular,
                      maxWidth: normalize(100),
                      textAlign: 'left',
                    },
                  ]}>
                  {strings('dashboard.Total_Amount_to_be_paid')}
                </Text>
                <Text
                  style={[
                    styles.cardNumber,
                    {
                      color: Colors.blue,
                      fontSize: normalize(28),
                      textAlign: 'left',
                    },
                  ]}>
                  ${' '}
                  {dashboardData?.TotalAmounttobepaidjobs
                    ? dashboardData?.TotalAmounttobepaidjobs
                    : '0'}
                </Text>
              </View>
              <View
                style={[
                  styles.paymentCollectionView,
                  {
                    backgroundColor:
                      paymentCollection === true ? Colors.white : '#DFE7FF',
                    paddingLeft: normalize(30),
                  },
                ]}>
                <Text
                  style={[
                    styles.cardText,
                    {
                      fontSize: normalize(14),
                      fontFamily: fontFamily.regular,
                      width: '80%',
                      textAlign: 'left',
                    },
                  ]}>
                  {strings('dashboard.Amount_Collected')}
                </Text>
                <Text
                  style={[
                    styles.cardNumber,
                    {
                      color: Colors.black,
                      // paddingTop: normalize(3),
                      fontSize: normalize(28),
                      textAlign: 'left',
                    },
                  ]}>
                  ${' '}
                  {dashboardData?.AmountCollectedJob
                    ? dashboardData?.AmountCollectedJob
                    : '0'}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={[styles.graphView, {}]}>
              {graphVisible === true ? (
                <>
                  <View style={styles.jobsTextView}>
                    <View style={styles.blueCalenderContainer}>
                      <BlueCalendar
                        style={[
                          styles.svgIcons,
                          {
                            marginHorizontal: normalize(10),
                          },
                        ]}
                        height={normalize(16)}
                        width={normalize(16)}
                      />
                      <Text
                        style={[
                          styles.cardText,
                          {
                            fontSize: normalize(14),
                            fontFamily: fontFamily.regular,
                            paddingLeft: normalize(5),
                          },
                        ]}>
                        {strings('dashboard.Jobs_for_the_Week')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.grayArrowBox}
                      onPress={() => toggleGraphView()}>
                      <GrayArrowBack
                        style={[
                          styles.svgIcons,
                          {
                            marginHorizontal: normalize(10),
                            transform: [{rotate: '0deg'}],
                          },
                        ]}
                        height={normalize(7)}
                        width={normalize(13)}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.jobsGraphView}>
                    <View style={styles.lengendView}>
                      <Text style={styles.TotalJobDot}>{'●'}</Text>
                      <Text style={styles.TotalJobText}>
                        {strings('dashboard.Total_Jobs')}
                      </Text>
                      <Text style={styles.CompletedJobDot}>{'●'}</Text>
                      <Text style={styles.TotalJobText}>
                        {strings('dashboard.Completed_Jobs')}
                      </Text>
                    </View>
                    <Graph
                      week={weeks}
                      totalJobs={totalJobsInWeek}
                      completedJobs={completedJobsInWeek}
                    />
                    <View style={styles.line} />
                    <View style={styles.monthTxtContainer}>
                      {weeks.map((month, id) => {
                        return (
                          <Text style={styles.weekText} key={id.toString()}>
                            {month}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.jobsTextView}>
                    <View style={styles.blueCalenderView}>
                      <BlueCalendar
                        style={[
                          styles.svgIcons,
                          {
                            marginHorizontal: normalize(10),
                          },
                        ]}
                        height={normalize(16)}
                        width={normalize(16)}
                      />
                      <Text
                        style={[
                          styles.cardText,
                          {
                            fontSize: normalize(14),
                            fontFamily: fontFamily.regular,
                            paddingLeft: normalize(5),
                          },
                        ]}>
                        {strings('dashboard.Jobs_for_the_Week')}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.toggleGraphViewStyle}
                      onPress={() => toggleGraphView()}>
                      <GrayArrowBack
                        style={[
                          styles.svgIcons,
                          {
                            transform: [{rotate: '270deg'}],
                          },
                        ]}
                        height={normalize(7)}
                        width={normalize(13)}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
        {rememberMe ? (
          biometricSupported ? (
            !enableSecurity ? (
              askForManageSecurity ? (
                showModal ? (
                  <BottomSheet
                    handleCancel={handleCancel}
                    value={askForManageSecurity}
                    handleSwitch={toggleSwitch}
                    showModal={showModal}
                    switchValue={switchValue}
                  />
                ) : null
              ) : null
            ) : null
          ) : null
        ) : null}
      </ScrollView>
      <DashboardBottomTab
        newNotification={
          notification_list.length > 0
            ? notification_list.some((e) => e.IsRead == 0)
            : true
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: Colors.white},
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.appGray,
  },
  topViewContainer: {
    width: '100%',
    height: normalize(170),
    borderBottomRightRadius: normalize(20),
    borderBottomLeftRadius: normalize(20),
    padding: normalize(18),
    marginBottom: normalize(18),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.13,
    shadowRadius: 2,
    elevation: 5,
  },
  statusContainer: {flexDirection: 'row'},
  bottomViewContainer: {
    paddingHorizontal: normalize(21),
    backgroundColor: Colors.appGray,
  },
  partsContainer: {
    flexDirection: 'row',
    marginBottom: normalize(20),
    justifyContent: 'space-between',
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.white,
    marginBottom: 0,
    flex: 1,
  },
  headerText1: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.white,
  },
  headerText2: {
    fontFamily: fontFamily.bold,
    fontSize: normalize(19),
    color: Colors.white,
  },
  checkBtnStyle: {
    borderRadius: 60,
    opacity: 1,
    width: '40%',
    height: normalize(40),
    paddingVertical: normalize(5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: '#9c9898',
    borderBottomWidth: Platform.OS == 'ios' ? 0.3 : 0.5,
    borderEndWidth: Platform.OS == 'ios' ? 0.3 : 0.5,
    borderTopWidth: Platform.OS == 'ios' ? 0.3 : 0,
    borderStartWidth: Platform.OS == 'ios' ? 0.3 : 0,
    borderEndColor: '#9c9898',
    borderTopColor: '#404040',

    borderStartColor: '#404040',
    shadowColor: '#1a1a1a',
    shadowOffset: {width: 3, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 22,
  },
  checkinBtnStyle: {
    borderRadius: 60,
    opacity: 1,
    width: '40%',
    height: normalize(40),
    paddingVertical: normalize(5),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: '#404040',
    borderBottomWidth: Platform.OS == 'ios' ? 0.3 : 0,
    borderEndWidth: Platform.OS == 'ios' ? 0.3 : 0,
    borderTopWidth: Platform.OS == 'ios' ? 0.1 : 0.5,
    borderStartWidth: Platform.OS == 'ios' ? 0.3 : 0.5,
    borderEndColor: '#404040',
    borderTopColor: '#9c9898',

    borderStartColor: '#9c9898',
    shadowColor: '#b3b3b3',
    shadowOffset: {width: -5, height: -3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  logOutBtn: {
    marginHorizontal: normalize(12),
    transform: I18nManager.isRTL ? [{rotate: '180deg'}] : [{rotate: '0deg'}],
  },
  svgIcons: {
    marginHorizontal: normalize(0),
    marginVertical: normalize(3),
    marginBottom: normalize(5),
  },
  settingIcon: {
    flex: 0.1,
    padding: normalize(5),
  },
  checkInView: {
    flexDirection: 'row',
    marginVertical: normalize(10),
    justifyContent: 'space-between',
    marginTop: normalize(15),
  },
  appointmentToday: {
    backgroundColor: Colors.white,
    height: normalize(65),
    width: '90%',
    shadowColor: Colors.black,
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: normalize(-50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    marginBottom: normalize(3),
  },
  appoinmentIcons: {
    height: normalize(25),
    width: normalize(25),
    tintColor: Colors.darkOrange,
  },
  appointmentText: {
    fontSize: normalize(16),
    fontFamily: fontFamily.semiBold,
    paddingHorizontal: normalize(20),
  },
  cardsView: {
    height: normalize(140),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginVertical: normalize(10),
  },
  subCards: {
    paddingVertical: normalize(20),
    width: normalize(85),
    borderRadius: normalize(10),
    shadowColor: Colors.black,
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    padding: normalize(8),
    justifyContent: 'space-between',
    height: normalize(150),
  },
  cardNumber: {
    fontSize: normalize(22),
    fontFamily: fontFamily.semiBold,
    textAlign: 'left',
  },
  cardText: {
    fontSize: normalize(11),
    fontFamily: fontFamily.regular,
    maxHeight: normalize(50),
    paddingBottom: normalize(5),
    textAlign: 'left',
  },
  partCards: {
    height: normalize(110),
    width: '48%',
    marginVertical: normalize(10),
    shadowColor: Colors.black,
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: normalize(10),
    backgroundColor: Colors.white,
    paddingHorizontal: normalize(15),
    paddingVertical: normalize(15),
    flexDirection: 'row',
  },
  iconBackground: {
    backgroundColor: Colors.deepLightestBlue,
    height: normalize(44),
    width: normalize(44),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(22),
  },
  labelText: {
    color: Colors.lightestBlack,
    fontSize: normalize(14),
    fontFamily: fontFamily.regular,
    textAlign: 'left',
  },
  paymentView: {
    height: normalize(121),
    width: '100%',
    backgroundColor: '#DFE7FF',
    borderRadius: normalize(9),
    marginVertical: normalize(20),
    flexDirection: 'row',
    margin: normalize(10),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {width: 3, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: 'center',
  },
  paymentCollectionView: {
    height: normalize(101),
    width: '46%',
    backgroundColor: Colors.white,
    borderRadius: normalize(9),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  graphView: {
    marginTop: normalize(10),
    marginBottom: Platform.OS === 'ios' ? normalize(20) : normalize(40),
    height: 'auto',
    width: '100%',
    backgroundColor: Colors.lightBlue,
    borderRadius: normalize(10),
    paddingVertical: normalize(10),
  },
  jobsTextView: {
    flex: 0.2,
    flexDirection: 'row',
    marginHorizontal: normalize(10),
  },
  jobsGraphView: {
    flex: 0.8,
    backgroundColor: Colors.white,
    margin: normalize(15),
    borderRadius: normalize(20),
  },
  weekText: {
    fontSize: normalize(9),
    fontFamily: fontFamily.regular,
    color: Colors.lightBlack,
    paddingBottom: normalize(10),
  },
  line: {
    borderTopWidth: 1,
    borderTopColor: Colors.darkGray,
    width: '90%',
    alignSelf: 'center',
    padding: normalize(2),
    marginTop: normalize(10),
  },
  monthTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: normalize(15),
  },
  lengendView: {
    flexDirection: 'row',
    padding: normalize(10),
    alignSelf: 'flex-end',
    justifyContent: 'space-evenly',
  },
  TotalJobDot: {
    paddingRight: normalize(4),
    paddingTop: normalize(2),
    fontSize: normalize(8),
  },
  TotalJobText: {
    color: Colors.deepLightBlack,
    fontSize: normalize(9),
  },
  CompletedJobDot: {
    color: Colors.darkGray,
    fontSize: normalize(9),
    paddingLeft: normalize(15),
    paddingRight: normalize(5),
  },
  btnWrap: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    flex: 1,
  },
  scrollViewStyle: {
    flexGrow: 1,
  },
  userNameView: {
    flexDirection: 'row',
  },
  checkButtonContainer: {
    flex: 1,
  },
  todayJobsStyle: {
    fontSize: normalize(30),
    color: Colors.deepDarkOrange,
    position: 'absolute',
    right: 0,
  },
  blueCalenderContainer: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayArrowBox: {
    flex: 0.4,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  blueCalenderView: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleGraphViewStyle: {
    flex: 0.4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    right: normalize(7),
  },
});

export default Dashboard;
