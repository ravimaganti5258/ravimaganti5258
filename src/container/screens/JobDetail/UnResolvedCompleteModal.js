import React, { useEffect, useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useSelector } from 'react-redux';

import { Colors } from '../../../assets/styles/colors/colors';
import CheckBox from '../../../components/CheckBox';
import { Dropdown } from '../../../components/Dropdown';
import { MultiselectDropdown } from '../../../components/Dropdown/multiSelectDropdown';
import { Input } from '../../../components/Input';
import { ModalContainer } from '../../../components/Modal';
import MultiButton from '../../../components/MultiButton';
import { Text } from '../../../components/Text/index';
import { queryAllRealmObject } from '../../../database';
import { MASTER_DATA } from '../../../database/webSetting/masterSchema';
import { useColors } from '../../../hooks/useColors';
import { useDimensions } from '../../../hooks/useDimensions';
import { fontFamily, normalize, textSizes } from '../../../lib/globals';
import { strings } from '../../../lib/I18n';
import { emptyDropDown } from '../../../util/helper';

const UnResolvedCompleteModal = ({
  handleModalVisibility,
  visibility,
  status,
  title,
  reasonList,
  workRequests,
  workOrderDetails,
  onActualTravelTextChange,
  actualTravelValue,
  technicianRemarkTextChange,
  technicianRemark,
  onUpdateStatus,
  handleReasonSelection,
  selectedReason,
  handleActualHrSelection,
  selectedActualHr,
  handleActualMinSelection,
  selectedActualMin,
  isSubmitted = false,
  hrList,
  minList,
  callback
}) => {
  const { height } = useDimensions();
  const { colors } = useColors();
  const [showInfo, setShowInfo] = useState(false);
  const [actualVal, setActualVal] = useState(0);
  const [reason, setReason] = useState({});
  const [value, setvalue] = useState(false);
  const [open, setOpen] = useState(false)

  const jobStatusTimeline = useSelector(
    (state) => state?.jobDetailReducers?.data?.GetJobStatusTimeLine,
  );

  useEffect(() => {
    actualTravelValue != null
      ? setActualVal(actualTravelValue.toString())
      : setActualVal(actualVal);
  }, [actualTravelValue]);

  useEffect(() => {
    actualTravelValue != null ?
      setActualVal(actualTravelValue.toString()) :
      setActualVal(actualVal);
    setReason(selectedReason);
  }, [])
  // useEffect(() => {
  //   if (reasonList?.length > 0) {
  //     const rsn = reasonList?.filter(function (item) {
  //       if (item.id == selectedReason) {
  //         return item;
  //       }
  //     });
  //     setReason(rsn)
  //   }
  // }, [selectedReason])
  const toggleToolTip = () => {
    setShowInfo(!showInfo);
    setTimeout(() => {
      setShowInfo(false);
    }, 5000);
  };
  const buttons = [
    {
      btnName: strings('status_update.Cancel'),
      onPress: () => handlCancel(),
      btnStyles: styles.cancelBtnStyles,
      btnTxtStyles: styles.cancelTextStyle,
    },
    {
      btnName: strings('status_update.Update Status'),
      onPress: () => handleUpdata(),
      btnStyles: {
        ...styles.confirmBtnStyles,
        backgroundColor: colors?.PRIMARY_BACKGROUND_COLOR,
      },
      btnTxtStyles: styles.confirmTextStyles,
    },
  ];

  const cnclButtons = [
    {
      btnName: strings('status_update.Cancel'),
      onPress: () => handlCancel(),
      btnStyles: styles.cancelBtnStyles,
      btnTxtStyles: styles.cancelTextStyle,
    }
  ];

  const handlCancel = () => {
    try {
      handleModalVisibility();
      callback()
    } catch (error) {
      console.log({ error });
    }
  };
  const handleUpdata = () => {
    try {
      onUpdateStatus ? onUpdateStatus() : null;
      handleModalVisibility();
      callback()
    } catch (error) { }
  };


  return (
    <ModalContainer
      visibility={visibility}
      containerStyles={styles.modalContainerStyles}>
      <View
        style={[
          styles.container,
          // {
            // maxHeight: height/1.2
          // },
        ]}>
        <Text style={styles.title}>{title}</Text>
        <KeyboardAvoidingView
          behavior={'height'}
          enabled
          keyboardVerticalOffset={normalize(50)}>
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: normalize(10) }}>
            <Text style={[styles.reasonTxt, styles.reasonTxtMargin]}>
              {strings('status_update.reason')}
            </Text>
            <View style={{ zIndex: Platform.OS === 'ios' ? 10 : undefined }}>
              {/* <Dropdown
                list={reasonList?.length > 0 ? reasonList : emptyDropDown}
                dropDownBodyContainer={styles.borderStyle}
                dropDownContainer={styles.borderStyles}
                handleSelection={handleReasonSelection}
                label={reason?.label || 'Select Reason'}

                selectedItem={reason}
                zIndexVal={1}
              /> */}
              {/* <Dropdown
                list={reasonList}
                dropDownBodyContainer={styles.borderStyle}
                dropDownContainer={styles.borderStyles}
                handleSelection={handleReasonSelection}
                label={reason?.label || 'Select Reason'}
                selectedItem={reason}
                zIndexVal={1}
              /> */}

              <MultiselectDropdown
                list={reasonList}
                dropDownBodyContainer={styles.borderStyles}
                dropDownContainer={styles.borderStyles}
                handleSelection={handleReasonSelection}
                selectedItem={selectedReason}
                zIndexVal={1}
                dropped={setOpen}
                selectAll={value}
                deselect={setvalue}
              />
              {open &&
                <View style={{
                  paddingTop: normalize(2), paddingLeft: Platform.OS === 'ios' ? normalize(16): normalize(8), marginTop: normalize(2),
                  borderLeftWidth: normalize(1), borderRightWidth: normalize(1), borderColor: Colors.borderGrey,
                  marginBottom: open ? Platform.OS === 'ios' ? normalize(120) : normalize(130) : 0,backgroundColor:Colors.white,
                }}>
                  <CheckBox
                    containerStyles={{
                      alignSelf: 'flex-start',
                    }}
                    value={value}
                    ckBoxStyle={styles.ckboxStyle2}
                    // onFillColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    // onTintColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    tintColor={Colors?.secondryBlack}
                    label={strings('status_update.select_all')}
                    handleValueChange={(value) => {
                      setvalue(value);
                    }}
                  />
                </View>}
            </View>

            {status == 'On Site' || status == 'Completed' || jobStatusTimeline[0].OnSite != '' ? (
              <>
                <Text style={[styles.reasonTxt, styles.plannedTxtMargin]}>
                  {strings('status_update.planned_work')}
                </Text>
                <Text style={[styles.reasonTxt, styles.hrsMarginTop]}>
                  {workOrderDetails?.ActualWorkedHours > 1
                    ? `${workOrderDetails.ActualWorkedHours} Hrs`
                    : workOrderDetails?.ActualWorkedHours == 1
                      ? `${workOrderDetails.ActualWorkedHours} Hr`
                      : '0 Hr'}{' '}
                  {workOrderDetails?.ActualWorkedMinutes > 1
                    ? `${workOrderDetails.ActualWorkedMinutes} Mins`
                    : workOrderDetails?.ActualWorkedMinutes == 1
                      ? `${workOrderDetails.ActualWorkedMinutes} Min`
                      : '0 Min'}
                </Text>
                <View style={{ position: 'relative' }}>
                  <Text style={[styles.reasonTxt, styles.acctualWorkMargin]}>
                    {strings('status_update.actual_hrs')}
                  </Text>
                  {workRequests?.length > 1 ? (
                    <Text style={styles.toolTip} onPress={toggleToolTip}>
                      i
                    </Text>
                  ) : null}
                </View>

                <View
                  style={[
                    styles.acctualWorkDropDownContainer,
                    {
                      zIndex: Platform.OS === 'ios' ? 9 : undefined,
                      marginTop: workRequests?.length > 1 ? normalize(-9) : 0,
                    },
                  ]}>
                  <View style={{ flex: 0.48 }}>
                    <Dropdown
                      list={hrList}
                      dropDownBodyContainer={{
                        ...styles.borderStyle,
                        maxHeight: normalize(100),
                      }}
                      dropDownContainer={styles.borderStyles}
                      handleSelection={handleActualHrSelection}
                      // label={selectedActualHr?.label || `${selectedActualHr ? selectedActualHr : '0'} Hrs`}
                      label={
                        selectedActualHr?.label ||
                        `${selectedActualHr > 1
                          ? `${selectedActualHr} Hrs`
                          : selectedActualHr == 1
                            ? `${selectedActualHr} Hr`
                            : '0 Hr'
                        }`
                      }
                      selectedItem={selectedActualHr}
                      zIndexVal={1}
                      disable={workRequests?.length > 1 ? true : false}
                    />
                  </View>
                  <View style={{ flex: 0.48 }}>
                    <Dropdown
                      list={minList}
                      dropDownBodyContainer={{
                        ...styles.borderStyle,
                        maxHeight: normalize(100),
                      }}
                      dropDownContainer={styles.borderStyles}
                      handleSelection={handleActualMinSelection}
                      label={
                        selectedActualMin?.label ||
                        `${selectedActualMin > 1 ?
                          `${selectedActualMin} Mins`
                          : selectedActualMin == 1 ?
                            `${selectedActualMin} Min`
                            : '0 Min'
                        }`
                      }
                      selectedItem={selectedActualMin}
                      zIndexVal={1}
                      disable={workRequests?.length > 1 ? true : false}
                    />
                  </View>
                </View>
                <Input
                  style={styles.actualTravelInputStyles}
                  containerStyle={styles.actualTravelInputContainer}
                  onChangeText={onActualTravelTextChange}
                  value={actualVal?.toString()}
                  editable={true}
                  label={'Actual Travel'}
                  labelStyles={styles.reasonTxt}
                  inputRightText={actualVal?.toString() > 1 ? 'Miles' : 'Mile'}
                  inputRightTextStyles={styles.inputRightText}
                  keyboardType={'numeric'}
                />
              </>
            ) : null}
            <Text style={[styles.reasonTxt, styles.plannedTxtMargin]}>
              {strings('status_update.technician_remark')}
            </Text>
            <TextInput
              value={technicianRemark}
              style={styles.remarkTextInput}
              multiline={true}
              onChangeText={technicianRemarkTextChange}
              numberOfLines={4}
              textAlignVertical={'top'}
            />
            <MultiButton
              buttons={isSubmitted ?
                cnclButtons : buttons}
              constinerStyles={styles.multiBtnContainer}
            />
        </ScrollView>
        </KeyboardAvoidingView>
    </View>
      {showInfo ? (
        <View style={[styles.toolTipStyle]}>
          <Text>{strings('job_detail.tool_tip')}</Text>
          {/* <ModalContainer
            visibility={showInfo}
            handleModalVisibility={toggleToolTip}
            containerStyles={styles.toolTipModal}>
            <Text>{strings('job_detail.tool_tip')}</Text>
          </ModalContainer> */}
        </View>
      ) : null}
    </ModalContainer>
  );
};

export default UnResolvedCompleteModal;

const styles = StyleSheet.create({
  container: {
    paddingBottom: normalize(10),
    paddingHorizontal: normalize(22),
    paddingTop: normalize(20),
  },
  title: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.bold,
    fontSize: textSizes.h10,
  },
  reasonTxt: {
    alignSelf: 'flex-start',
    fontSize: normalize(13),
    color: Colors?.secondryBlack,
  },
  reasonTxtMargin: {
    marginTop: normalize(15),
  },
  plannedTxtMargin: {
    marginTop: normalize(25),
  },
  modalContainerStyles: {
    top: Platform.OS === 'ios' ? normalize(33) : normalize(20),
    flex:1,
  },
  hrsMarginTop: {
    marginTop: normalize(9),
  },
  acctualWorkMargin: {
    marginTop: normalize(21),
  },
  acctualWorkDropDownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actualTravelInputContainer: {
    borderWidth: 1,
    borderRadius: normalize(8),
    height: normalize(40),
    marginTop: normalize(8),
    borderColor: Colors?.borderGrey,
    paddingLeft: normalize(10),
  },
  actualTravelInputStyles: {
    fontSize: textSizes.h11,
    fontFamily: fontFamily.semiBold,
    marginTop: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  remarkTextInput: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    marginTop: normalize(8),
    borderRadius: normalize(8),
    fontSize: normalize(14),
    minHeight: normalize(80),
    paddingHorizontal: Platform.OS === 'ios' ? normalize(5) : 0,
    paddingLeft: normalize(10),
  },
  cancelBtnStyles: {
    backgroundColor: Colors?.silver,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnStyles: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  multiBtnContainer: {
    width: '85%',
    alignSelf: 'center',
    paddingVertical: normalize(7),
    // backgroundColor: 'red',
    // paddingBottom: Platform.OS === 'ios' ? normalize(10) : normalize(20),
  },
  cancelTextStyle: {
    fontSize: normalize(14),
  },
  confirmTextStyles: {
    fontSize: normalize(14),
    color: Colors.white,
  },
  borderStyles: {
    borderColor: Colors?.borderGrey,
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
  },
  borderStyle: {
    borderColor: Colors?.borderGrey,
  },
  inputRightText: {
    color: Colors?.borderGrey,
  },
  toolTipModal: {
    top: '32%',
    padding: normalize(16),
    position: 'absolute',
  },
  toolTip: {
    fontFamily: fontFamily.bold,
    borderWidth: normalize(1),
    color: 'black',
    borderRadius: normalize(4),
    backgroundColor: 'lightgrey',
    width: normalize(15),
    height: normalize(15),
    right: normalize(25),
    bottom: normalize(17),
    textAlign: 'center',
    marginLeft: Platform.OS === 'ios' ? 0 : normalize(15),
  },
  toolTipStyle: {
    padding: normalize(5),
    borderWidth: 1,
    marginBottom: normalize(10),
    borderRadius: normalize(7),
    position: 'absolute',
    top: '40%',
    backgroundColor: Colors?.lightGray,
    borderColor: Colors?.greyBtnBorder,
    marginHorizontal: normalize(5),
  },
  ckboxStyle2: {
    // height: normalize(20),
    // width: normalize(20),
    width: Platform.OS === 'ios' ?normalize(21):normalize(18),
    height: Platform.OS === 'ios' ?normalize(21):normalize(18),
    borderRadius: Platform.OS === 'ios' ?normalize(0):normalize(5),
    marginRight:Platform.OS === 'ios' ? normalize(0):normalize(8),
    // paddingVertical: normalize(10),
    // paddingHorizontal: normalize(10),
    // borderColor: Colors?.borderGrey,
    // height: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    // width: Platform.OS === 'ios' ? normalize(18) : normalize(25),
    marginLeft: normalize(4.8),
    marginTop: normalize(5),
  },
});
