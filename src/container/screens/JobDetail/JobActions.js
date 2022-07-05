import React, { useState, useEffect, useRef } from 'react';
import { Button, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../assets/styles/colors/colors';
import CheckBox from '../../../components/CheckBox';
import { Dropdown } from '../../../components/Dropdown';
import { Input } from '../../../components/Input';
import MultiButton from '../../../components/MultiButton';
import { Text } from '../../../components/Text';
import { useColors } from '../../../hooks/useColors';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { emptyDropDown } from '../../../util/helper';
import OtpInput from './OtpInput';
import TimerFile from './TimerFile';

const WrapperComponent = ({ backgroundColor, children }) => {
  return (
    <View style={[styles.wrapperStyles, { backgroundColor: backgroundColor }]}>
      {children}
    </View>
  );
};

const DropdownContainer = ({ reasonList, handleSelection, selectedItem }) => {
  return (
    <View>
      <Text style={styles.reasonTxt}>{strings('Location_Violation.Reason')}</Text>
      <Dropdown
        list={reasonList}
        dropDownBodyContainer={styles.borderStyles}
        dropDownContainer={styles.borderStyles}
        handleSelection={handleSelection}
        selectedItem={selectedItem}
        label={selectedItem?.label}
      />
    </View>
  );
};

const AlertButtonContainer = ({
  title,
  setExpandView,
  expandView,
  textStyles,
  btnStyles,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={expandView ? 1 : 0.8}
      onPress={setExpandView}
      style={[styles?.viewContainer, btnStyles]}>
      <Text style={[styles.actionText, textStyles]}>{title}</Text>
    </TouchableOpacity>
  );
};

const JobActions = ({
  type,
  expandView,
  setExpandView,
  distance = '6839.49',
  units = 'Mile',
  handleResumeJob,
  handleReasonSelection,
  selectedReason,
  onSave,
  firstInput,
  secondInput,
  thirdInput,
  fourthInput,
  setFirstInput,
  setSecondInput,
  setThirdInput,
  setFourthInput,
  reasonList,
  onResendOTP,
  rejectedReason,
  onCancle,
}) => {
  const [otpTimer, setotpTimer] = useState(180);
  const [Timer, setTimer] = useState(0);
  const [Second, setSecond] = useState(5);
  const [value, setvalue] = useState();
  const [ck, setCk] = useState(0);
  const { colors } = useColors();

  const [otpText, setOtpText] = useState('');

  const handleExpandView = () => {
    setExpandView(true);
  };

  const MultiBtnContainer = ({
    setExpandView,
    onSave,
    cancelBtnBgColor,
    saveBtnBgColor,
    type
  }) => {
    const buttons = [
      {
        btnName: strings('pair_button.cancel'),
        onPress: () => setExpandView(false),
        btnTxtStyles: { ...styles.actionBtnTxtStyles },
        btnStyles: { ...styles.cancelBtnStyles },
      },
      {
        btnName: strings('pair_button.save'),
        onPress: () => onSave(),
        btnTxtStyles: { ...styles.actionBtnTxtStyles },
        btnStyles: { ...styles.saveBtnStyles },
      },
    ];
    const cancelButton = [
      {
        btnName: strings('pair_button.cancel'),
        onPress: () => { setExpandView(false), onCancle(), setCk(0), setvalue(false) },
        btnTxtStyles: { ...styles.actionBtnTxtStyles },
        btnStyles: { ...styles.cancelBtnStyles },
      },
    ];
    return (
      <MultiButton
        buttons={Object.keys(selectedReason).length > 0 || otpText?.length == 4 ? buttons : cancelButton}
        constinerStyles={styles.btnContainerStyles}
      />
    );
  };

  useEffect(() => {
    if (expandView) {
      let id = setInterval(() => {
        setotpTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [expandView]);

  switch (type) {
    case 'location_violation':
      return (
        <WrapperComponent backgroundColor={Colors?.violationColor}>
          <AlertButtonContainer
            title={strings('Location_Violation.title')}
            setExpandView={handleExpandView}
            expandView={expandView}
          />
          {expandView ? (
            <View style={styles?.expandedViewContainer}>
              <Text style={styles.violationInfoTxt}>
                {distance ? `${strings('Location_Violation.You_are')} ${distance} ${units} ${strings('Location_Violation.away_from_customer_location')}` : ''}
              </Text>
              <Text style={styles.violationInfoTxt}>
                {strings('Location_Violation.reason_to_continue')}
              </Text>
              <DropdownContainer
                reasonList={reasonList}
                handleSelection={handleReasonSelection}
                selectedItem={selectedReason}
              />
              <MultiBtnContainer
                onSave={onSave}
                setExpandView={setExpandView}
              />
            </View>
          ) : null}
        </WrapperComponent>
      );
    case 'enter_otp':
      return (
        <WrapperComponent backgroundColor={Colors?.successGreen}>
          <AlertButtonContainer
            title={strings('Location_Violation.Enter_OTP')}
            setExpandView={handleExpandView}
            expandView={expandView}
            textStyles={{ fontFamily: fontFamily.bold, fontSize: normalize(20) }}
            btnStyles={{ paddingBottom: expandView ? 0 : normalize(15) }}
          />
          {expandView ? (
            <View style={styles?.expandedViewContainer}>
              {ck == 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '60%',
                      alignSelf: 'center',
                     
                    }}>

                    <OtpInput
                      saveOtp={(val) => {
                        const obj = Object.values(val);
                        setOtpText(obj.join('')),
                          console.log('checking', obj.join(''), val);
                      }}
                      setfirst={setFirstInput}
                      setSecond={setSecondInput}
                      setThird={setThirdInput}
                      setFour={setFourthInput}
                      style={{
                        alignSelf: 'center',
                        backgroundColor:'balck'
                      }}
                    />
                  </View>
                  <View style={styles.resendOTPContainer}>
                    <Text
                      style={[
                        styles.reasonTxt,
                        { alignSelf: 'center', marginRight: normalize(8), marginTop: normalize(20), fontSize: normalize(13) },
                      ]}
                      onPress={onResendOTP}>
                      {strings('Location_Violation.Resend_OTP')}
                    </Text>
                    {/* <Text
                      style={[styles.reasonTxt, {fontFamily: fontFamily.bold}]}>
                      {otpTimer}
                    </Text> */}
                    <TimerFile />
                  </View>
                </>
              ) : null}

              <View style={styles.checkBoxContainer}>
                {/* <CheckBox
                  ckBoxStyle={[styles.ckboxStyle2]}
                  value={value}
                  onFillColor={Colors?.white}
                  onTintColor={Colors?.white}
                  onCheckColor={Colors?.successGreen}
                  handleValueChange={(value) => {
                    setvalue(value);
                    if (value == true) {
                      setCk(1);
                    } else if (value == false) {
                      setCk(0);
                    }
                  }}
                /> */}
                <CheckBox
                  containerStyles={Platform.OS === 'ios' ? {alignSelf:'center'}:{alignSelf: 'center',backgroundColor: value == true ? Colors.lightGreen:Colors.white, height: normalize(16),width: normalize(16),marginRight:normalize(2),}}
                  value={value}
                  ckBoxStyle={[styles.ckboxStyle2, { margin: value == true ? normalize(10) : normalize(15) },{marginLeft:  Platform.OS === 'ios' ? normalize(10) : normalize(10)} ]}
                  onTintColor={Platform.OS === 'ios' ? Colors?.white : Colors?.white }
                  onFillColor={Colors?.white}
                  handleValueChange={(value) => {
                    setvalue(value);
                    if (value == true) {
                      setCk(1);
                      setOtpText("")
                    } else if (value == false) {
                      setCk(0);
                      handleReasonSelection({})
                      setOtpText("")
                    }
                  }}
                 onCheckColor={colors?.PRIMARY_BACKGROUND_COLOR}
                 tintColor={Colors?.white}
                />
                <Text style={[styles.otpText, { marginRight: normalize(10) }]}>{strings('Location_Violation.OTP_Not_Required')}</Text>
              </View>
              {ck == 1 ? (
                <DropdownContainer
                  reasonList={reasonList?.length > 0 ? reasonList : emptyDropDown}
                  handleSelection={handleReasonSelection}
                  selectedItem={selectedReason}
                />
              ) : null}
              <MultiBtnContainer
                onSave={onSave}
                setExpandView={setExpandView}
                type={'otp'}
              />
            </View>
          ) : null}
        </WrapperComponent>
      );

    case 'approval_rejected':
      return (
        <WrapperComponent backgroundColor={Colors?.violationColor}>
          <AlertButtonContainer
            title={'Approval Rejected'}
            setExpandView={handleExpandView}
            expandView={expandView}
          />
          {expandView ? (
            <View style={styles.expandedViewContainer}>
              <Text style={styles?.reasonTxt}>{strings('Location_Violation.Reason')}</Text>
              <Text
                align={'flex-start'}
                color={Colors?.white}
                fontFamily={fontFamily?.semiBold}
                size={normalize(13)}>
                {rejectedReason}
              </Text>
              <Text
                style={{
                  ...styles.approvalRejectByText,
                  fontFamily: fontFamily.semiBold,
                  marginTop: normalize(15),
                }}>
                - John,{' '}
                <Text style={styles.approvalRejectByText}>
                  {' '}
                  12 Jan 2010, 12:25 pm{' '}
                </Text>
              </Text>
            </View>
          ) : null}
        </WrapperComponent>
      );
    case 'resume_job':
      return (
        <WrapperComponent backgroundColor={Colors?.resumeJobColor}>
          <AlertButtonContainer
            title={'Resume Job'}
            setExpandView={handleResumeJob}
          />
        </WrapperComponent>
      );
  }
};

export default JobActions;

const styles = StyleSheet.create({
  wrapperStyles: {
  },
  viewContainer: {
    paddingVertical: normalize(15),
  },
  actionText: {
    fontSize: textSizes.h8,
    fontFamily: fontFamily.semiBold,
    color: Colors?.white,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    marginTop: normalize(10),
    //paddingRight:90,
    //backgroundColor:'red',


  },
  otpText: {
    color: Colors?.white,
    marginHorizontal: normalize(10),
    fontSize:Platform.OS === 'ios' ? normalize(13) : normalize(14),
  },
  // ckboxStyle2: {
  //   height: 'auto',
  //   width: 'auto',
  //   paddingVertical: normalize(10),
  //   paddingHorizontal: normalize(10),
  //   borderWidth: normalize(1),
  //   borderRadius: normalize(4),
  //   backgroundColor: Colors?.white,
  //   borderColor: Colors?.white,
  //   margin: normalize(5),
  // },
  ckboxStyle2: {
    height: Platform.OS === 'ios' ? normalize(18) : normalize(30),
    width: Platform.OS === 'ios' ? normalize(18) : normalize(30),
    margin: normalize(5),
    backgroundColor: Platform.OS === 'ios' ? Colors?.white : Colors?.none,
    borderColor: Colors?.white,
    
  },
  
  violationInfoTxt: {
    fontSize: normalize(13),
    fontFamily: fontFamily.semiBold,
    color: Colors?.white,
    alignSelf: 'flex-start',
    marginBottom: normalize(6),
  },
  expandedViewContainer: {
    paddingHorizontal: normalize(23),
    paddingBottom: normalize(26),
  },
  borderStyles: {
    borderColor: 'transparent',
  
  },
  reasonTxt: {
    alignSelf: 'flex-start',
    marginTop: normalize(4),
    fontSize: normalize(12),
    color: Colors?.white,
    fontSize: normalize(13)
  },
  actionBtnTxtStyles: {
    fontSize: textSizes.h11,
    color: Colors?.white,
  },
  cancelBtnStyles: {
    borderWidth: 1,
    borderColor: Colors?.white,
    backgroundColor: 'transparent',
  },
  saveBtnStyles: {
    backgroundColor: '#00000065',
  },
  btnContainerStyles: {
    marginTop: normalize(24),
    width: '80%',
    alignSelf: 'center',
  },
  otpInputStyles: {
    textAlign: 'center',
    color: Colors?.white,
    fontSize: normalize(28),
    height: normalize(70),
  },
  otpInputContainer: {
    borderColor: Colors.white,
  },
  otpViewContainer: {
    flex: 1,
    marginHorizontal: normalize(10),
  },
  resendOTPContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  approvalRejectByText: {
    alignSelf: 'flex-start',
    fontSize: normalize(12),
    color: Colors?.white,
  },
});
