import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  I18nManager,
} from 'react-native';
import { Input } from '../../../../components/Input/index';
import { Colors } from '../../../../assets/styles/colors/colors';
import { fontFamily, normalize } from '../../../../lib/globals';
import { strings } from '../../../../lib/I18n';
import { EditWhiteIcon, EditBlackIcon } from '../../../../assets/img';
import { Text } from '../../../../components/Text';
import { useColors } from '../../../../hooks/useColors';
import api from '../../../../lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../../../lib/buildHeader';
import { FlashMessageComponent } from '../../../../components/FlashMessge';
import AllCustomeFields from '../../../../components/AllCustomFields';

const CustomFields = ({title, editable, CustomFields, callBack}) => {
  const [edit, setEdit] = useState(false);
  const [comment1, setcomment1] = useState('');
  const [comment2, setcomment2] = useState('');
  const { colors } = useColors();
  const [fields, setFields] = useState({});
  const [cusFields, setCusFields] = useState([]);
  const token = useSelector((state) => state?.authReducer?.token);
  const [loading, setLoading] = useState(false);
  const [jobDetailsCutFields, setJobDetailsCutFields] = useState(CustomFields);
  const onSave = () => {
    const handleCallback = {
      success: (data) => {
        // onEndEditing();
        setEdit(false);
        setLoading(false);
        const msgCode = data?.Message?.MessageCode;
        FlashMessageComponent('success', strings(`Response_code.${msgCode}`));
        callBack ? callBack() : null;
      },
      error: (err) => {
        setLoading(false);
        console.log('!!!', err);
      },
    };

    setLoading(true);
    let data = jobDetailsCutFields;
    // let data = {
    //   EntityId: 3,
    //   EntityName: 'Technician Job Details',
    //   JobId: 19157050,
    //   PanelId: 28,
    //   PanelName: 'Job Details Panel',
    //   CustomFields: jobDetailsCutFields?.CustomFields,
    // };
    const header = Header(token);
    api.insertcustomFields(data, handleCallback, header);
  };
  return (
    <View>
      {/* <View style={styles.fieldContainer}>
        <Text>{fields.FieldName}</Text>
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit), onEndEditing();
          } : null}>
          {!edit ? (
            <EditBlackIcon height={normalize(15)} width={normalize(16)} />
          ) : (
            <Text
              color={colors?.PRIMARY_BACKGROUND_COLOR}
              onPress={() => {
                setFields({ ...fields, Value: comment2 }), onSave();
              }}
              fontFamily={fontFamily.semiBold}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <Input
        placeholder={strings('custom_Fields.comments')}
        secureTextEntry={true}
        containerStyle={styles.inputContainer}
        style={styles.textInput}
        openEyeIconStyles={{ color: Colors?.PRIMARY_BACKGROUND_COLOR }}
        multiline={true}
        editable={false}
        value={fields.Value}
      />

      {edit && (
        <Input
          placeholder={strings('custom_Fields.comments')}
          secureTextEntry={true}
          label={strings('custom_Fields.custom_lable2')}
          labelStyles={{
            marginLeft: normalize(3),
            color: Colors.secondryBlack,
          }}
          containerStyle={[styles.inputContainer, { marginTop: normalize(10) }]}
          style={styles.textInput}
          openEyeIconStyles={{ color: Colors?.PRIMARY_BACKGROUND_COLOR }}
          multiline={true}
          value={comment2}
          onChangeText={setcomment2}
        />
      )} */}

      <AllCustomeFields
        CustomFields={CustomFields}
        editable={editable}
        setCustomFiledData={(data) => {
          setJobDetailsCutFields(data);
        }}
      />
      <Text
        color={colors?.PRIMARY_BACKGROUND_COLOR}
        onPress={
          editable == false ? null 
          : () => {
          setFields({...fields, Value: comment2}), onSave();
        }}
        align={'flex-end'}
        fontFamily={fontFamily.semiBold}>
        {strings('job_detail.save')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: normalize(5),
    marginTop: normalize(25),
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: normalize(8),
    borderColor: Colors.borderColor,
    alignItems: 'center',
    backgroundColor: Colors.lightBackground,
    marginTop: normalize(-10),
    paddingVertical: Platform.OS === 'ios' ? normalize(2) : 0,
    height: 'auto',
    
  },
  textInput: {
    fontSize: normalize(13),
    padding: normalize(10),
    paddingLeft: normalize(10),
    height: 'auto',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    
  },
});
export default CustomFields;
