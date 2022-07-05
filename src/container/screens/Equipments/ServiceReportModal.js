import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  TouchableNativeFeedbackBase,
  TouchableWithoutFeedback,
  ScrollView,
  I18nManager,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../../assets/styles/colors/colors';
import {ModalContainer} from '../../../components/Modal';
import {Text} from '../../../components/Text';
import {useDimensions} from '../../../hooks/useDimensions';
import {fontFamily, normalize, textSizes} from '../../../lib/globals';
import Button from '../../../components/Button';
import {Input} from '../../../components/Input';
import {strings} from '../../../lib/I18n/index.js';
import api from '../../../lib/api';
import Loader from '../../../components/Loader/index.js';
import {FlashMessageComponent} from '../../../components/FlashMessge/index.js';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {serviceReportdisable} from '../../../redux/serviceReport/action';
import {EMAIL_REGX} from '../../../lib/validations/regex';
import LabelComponent from '../../../components/LableComponent/index';
import {useNavigation} from '@react-navigation/core';
import {useValidation} from '../../../hooks/useValidation';
import {JobDetails} from '../../../database/JobDetails/schemas';

const ServiceReportDetailsModal = ({
  visibility,
  title,
  handleModalVisibility,
  showTimeLine = false,
  handleJobTimeLine,
  themeColor='#17338d'
}) => {
  const {height, width} = useDimensions();
  const insets = useSafeAreaInsets();

  const [loader, setLoader] = useState(false);
  const token = useSelector((state) => state?.authReducer?.token);
  const userInfo = useSelector((state) => state?.authReducer?.userInfo);
  const jobDetails = useSelector(
    (state) => state?.jobDetailReducers?.TechnicianJobInformation,
  );
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('Lorem ipsum dolor sit amet,consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore');
  const [attachment, setAttachment] = useState({});
  const [errVisible, setErrVisible] = useState(false);
  const [send, setSend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const base64PdfData = useSelector(
    (state) => state?.ServiceReportReducer?.getPdfBase64,
  );
  
  // const [email, emailErrMsg, handleValidation, setEmail] =
  // useValidation('email');
  const htmlData = useSelector(
    (state) => state?.ServiceReportReducer?.htmlData,
  );
  
console.log('htmldata==>',htmlData)

  const dispatch = useDispatch();

  const navigation = useNavigation();

  // useEffect(()=>{
  //   getCustomerAndTechDetails()
  // },[])

  const getCustomerAndTechDetails = () => {
    setLoader(true);
    try {
      const handleCallback = {
        success: (data) => {

          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            FlashMessageComponent(
              'success',
              strings(`Response_code.${msgCode}`),
            );
          }
          setLoader(false);
          handleModalVisibility();
        },
        error: (error) => {
          console.log('Error: ', error);
          setLoader(false);
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      //CompanyID/WorkOrderId/WoJobId/techID
      let endpoint = `/${userInfo?.CompanyId}/${jobDetails?.WorkOrderId}/${jobDetails?.WoJobId}/${userInfo?.sub}`;
      api.getCustomerAndTechDetails(
        '',
        handleCallback,
        {
          Authorization: `Bearer ${token}`,
          // endpoint,
        },
        endpoint,
      );
    } catch (er) {
      console.log('Catch part: ', er);
    }
  };

  const serviceReportEmail = () => {
    setLoader(true);
    try {
      const userData = {
        CustomerName: jobDetails?.CustomerName,
        To: email,
        Subject: subject,
        AttachementContent: htmlData,
        Body: message,
        IsInvoice: false,
        InvoiceId: '',
        SourceId: null,
        LoginId: userInfo?.sub,
        CompanyId: userInfo?.CompanyId,
        WoJobId: jobDetails?.WoJobId,
        WorkOrderId: jobDetails?.WorkOrderId,
      };
      const handleCallback = {
        success: (data) => {
          if (data?.Message?.MessageCode) {
            const msgCode = data?.Message?.MessageCode;
            if (msgCode?.length > 5) {
              FlashMessageComponent(
                'success',
                strings('Response_code.EMAILSENDSUCCESS'),
                handleModalVisibility(false),
              );
            } else if (msgCode.charAt(0) === '1') {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            } else {
              FlashMessageComponent(
                'success',
                strings(`Response_code.${msgCode}`),
                handleModalVisibility(false),
              );
            }
          }
          setLoader(false);
          handleModalVisibility();
          dispatch(serviceReportdisable(false));
        },
        error: (error) => {
          console.log('Error: ', error);
          setLoader(false);
          FlashMessageComponent(
            'reject',
            error?.error_description
              ? error?.error_description
              : strings('rejectMsg.went_wrong'),
          );
        },
      };
      setLoader(false);
      api.serviceReportEmail(userData, handleCallback, {
        Authorization: `Bearer ${token}`,
      });
    } catch (er) {
      console.log('Catch part: ', er);
    }
  };
  const checkInputValidation = () => {
    const emailLength = email?.length;
    const subjectLength = subject?.length;
    const messageLength = message?.length;
    if (emailLength == 0) {
      setErrVisible(true);
      setErrorMsg(strings('Response_code.EMAILISREQUIRED'));
    } else if (!EMAIL_REGX.test(email)) {
      setErrVisible(true);
      setErrorMsg(strings('Response_code.INVALIDEMAILADD'));
    } else {
      setErrVisible(false);
      serviceReportEmail();
      return errVisible;
    }

    // if (emailLength == 0 && subjectLength == 0 && messageLength == 0) {

    //   setErrVisible(true);
    //   setErrorMsg(strings('Response_code.PLEASEFILLALLTHEFIELDS'));
    // } else if (emailLength == 0) {
    //   setErrVisible(true);
    //   setErrorMsg(strings('Response_code.EMAILISREQUIRED'));
    // } else if (!EMAIL_REGX.test(email)) {
    //   setErrVisible(true);
    //   setErrorMsg(strings('Response_code.INVALIDEMAILADD'));
    // } else if (subjectLength === 0) {
    //   setErrVisible(true);
    //   setErrorMsg(strings('Response_code.SUBJECTISREQUIRED'));
    // } else if (messageLength === 0) {
    //   setErrVisible(true);
    //   setErrorMsg(strings('Response_code.MESSAGEISREQUIRED'));
    // }
    // if (
    //   EMAIL_REGX.test(email) &&
    //   emailLength > 0 &&
    //   subjectLength > 0 &&
    //   messageLength > 0
    // ) {
    //   setErrVisible(false);
    //   serviceReportEmail();
    //   return errVisible;
    // }
  };

  const viewPDF = async () => {
    handleModalVisibility(false);
    dispatch(serviceReportdisable(false));
    navigation.navigate('PdfViewer', {htmlData});
    // let fPath = Platform.select({
    //   ios: RNFetchBlob.fs.dirs.CacheDir,
    //   android: RNFetchBlob.fs.dirs.DownloadDir,
    // });
    // fPath = `${fPath}/pdfFileName.pdf`;
    // console.log('APath: ', fPath);
    // if (Platform.OS === 'ios') {
    //   await RNFetchBlob.fs.exists(fPath).then((res) => {
    //     if (res === true) {
    //       //RNFetchBlob.ios.previewDocument(fPath);
    //       FileViewer.open(fPath);
    //     } else {
    //       RNFetchBlob.fs
    //         .createFile(fPath, base64PdfData?.byteData, 'base64')
    //         .then(() => {
    //           //RNFetchBlob.ios.previewDocument(fPath);
    //           FileViewer.open(fPath);
    //         });
    //     }
    //   });
    // } else {
    //   await RNFetchBlob.fs.exists(fPath).then((res) => {
    //     if (res === true) {
    //       //RNFetchBlob.android.actionViewIntent(fPath, 'application/pdf');
    //       FileViewer.open(fPath);
    //     } else {
    //       RNFetchBlob.fs
    //         .writeFile(fPath, base64PdfData?.byteData, 'base64')
    //         .then(() => {
    //           //RNFetchBlob.android.actionViewIntent(fPath, 'application/pdf');
    //           FileViewer.open(fPath);
    //         });
    //     }
    //   });
    // }
  };

  return (
    <>
      <Loader visibility={loader} />
      <ModalContainer
        visibility={visibility}
        handleModalVisibility={handleModalVisibility}
        containerStyles={{
          top:"10%"
          // ...(styles.modalContainer
          //   ? Platform.OS === 'ios'
          //     ? normalize(10) + insets.top
          //     : normalize(16 + 70)
          //   : normalize(50) + insets.top),
        }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={[styles.container, {maxHeight: height / 1.4}]}>
            <ScrollView keyboardShouldPersistTaps={'handled'}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: normalize(20),
                  paddingHorizontal: normalize(7),
                }}>
                <View>
                  <Text style={styles.optTxtStyles1}>
                    {' '}
                    {strings('Equipment_modal.service_report')}
                  </Text>

                  <LabelComponent
                    label={strings('Equipment_modal.email')}
                    labelStyle={{fontSize: normalize(13)}}
                    style={{marginVertical: normalize(2)}}
                    required={true}
                  />
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setEmail(text)}
                  />

                  <LabelComponent
                    label={strings('Equipment_modal.subject')}
                    labelStyle={{fontSize: normalize(13),}}
                    style={{marginTop: normalize(30),paddingLeft:normalize(5)}}
                    required={false}
                  />
                  <View style={{...styles.textInput, flexDirection: 'row'}}>
                    <Text>{I18nManager.isRTL?  `: ${jobDetails?.WoJobId}`: `${jobDetails?.WoJobId} :`}</Text>
                    <TextInput
                      style={{width: '80%',
                       paddingLeft: normalize(10),
                       textAlign:I18nManager.isRTL?'right':'left'}}
                      value={subject}
                      onChangeText={(text) => setSubject(text)}
                    />
                  </View>
                  <LabelComponent
                    label={strings('Equipment_modal.message')}
                    labelStyle={{fontSize: normalize(13)}}
                    style={{marginTop: normalize(30),paddingLeft:normalize(5)}}
                    required={false}
                  />
                  <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.textInput, {height: normalize(84)}]}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                  />

                  {/* <Text style={styles.optTxtStyles}>
                    {strings('Add_Incident.Attachment')}
                  </Text> */}
                  <Text
                    style={[
                      styles.optTxtStyles,
                      {textDecorationLine: 'underline'},
                    ]}
                    onPress={viewPDF}>
                    {base64PdfData?.fileName !== null
                      ? base64PdfData?.fileName
                      : `Service Report.pdf`}
                  </Text>

                  {errVisible ? (
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  ) : (
                    <Text>{''}</Text>
                  )}

                  <View style={{marginTop: normalize(5)}}>
                    <Button
                      backgroundColor={themeColor}
                      title={strings('Equipment_modal.Send')}
                      txtColor={'#FFFFFF'}
                      fontSize={normalize(14)}
                      width={width / 1.27}
                      onClick={() => checkInputValidation()}
                    />
                  </View>
                </View>

                {/* <Logout width={normalize(18)} height={normalize(18)} /> */}
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </ModalContainer>
    </>
  );
};

export default ServiceReportDetailsModal;

const styles = StyleSheet.create({
  container: {
    padding: normalize(15),
    paddingVertical: normalize(20),
    flex: 1,
  },
  modalContainer: {
    borderRadius: normalize(8),
    width: 'auto',
  },

  ckBoxLabelStyles: {
    marginLeft: normalize(10),
  },
  dividerStyles: {
    borderWidth: 0.7,
    borderColor: Colors?.greyBorder,
    marginVertical: normalize(16),
  },
  optTxtStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.regular,
    alignSelf: 'flex-start',
    marginTop: normalize(10),
    marginLeft: normalize(4),
  },
  optTxtStyles1: {
    fontSize: textSizes.h10,
    fontFamily: fontFamily.bold,
    alignSelf: 'flex-start',
    marginBottom: normalize(15),
  },
  optBtnStyles: {
    paddingRight: normalize(70),
  },
  textInput: {
    height: normalize(54),
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: Colors.appGray,
    borderColor: '#D9D9D9',
    width: normalize(325),
    paddingHorizontal: normalize(10),
    textAlignVertical: 'top',
    textAlign:I18nManager.isRTL?'right': 'left'
  },
  errorText: {
    color: Colors?.red,
    fontFamily: fontFamily.regular,
    fontSize: normalize(14),
    alignSelf: 'flex-start',
    marginBottom: normalize(10),
    marginTop : normalize(-10),
    paddingLeft: normalize(4)
  },
});
