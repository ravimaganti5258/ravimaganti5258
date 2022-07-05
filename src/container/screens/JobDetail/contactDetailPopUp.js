import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import {
  BlackMoreOptionIcon,
  CrossIcon,
  MailIcon,
  SalesIcon,
  PhoneCallIcon,
  MobileCallIcon,
  userIcon1,
  AddressIcon,
} from '../../../assets/img/index.js';
import Loader from '../../../components/Loader/index.js';
import MapViewContainer from '../../../components/MapView';
import {
  fontFamily,
  normalize,
  normalizeHeight,
  timeFormat,
} from '../../../lib/globals.js';
import { Colors } from '../../../assets/styles/colors/colors';
import { Text } from '../../../components/Text/index';
import CommonModal from '../../../components/CommonModal/index';
import { mapViewJobList } from '../../../assets/jsonData';
import MarkerView from '../../../components/MarkerView';
import { strings } from '../../../lib/I18n/index.js';
import { string } from 'prop-types';
import { useColors } from '../../../hooks/useColors.js';
import { useNetInfo } from '../../../hooks/useNetInfo.js';

const contactDeatilPopUp = ({
  visibility,
  navigation,
  handleModalVisibility,
  data,
  callback,
}) => {

  const { isInternetReachable } = useNetInfo();
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [coordinates, setCoordinates] = useState(
    mapViewJobList[0]?.coordinates,
  );
  
  console.log('data===>',data)
  const { colors } = useColors();
  const infoFilled = (IconName, value, label) => {
    return (
      <View key={value} style={styles.bodySectionWrap}>
        <View style={styles.bodyIconStyles}>
          <IconName width={normalize(15)} height={normalize(15)} />
        </View>
        <Text
          // align={'flex-start'}
          color={
            IconName == MobileCallIcon || IconName == PhoneCallIcon
              ? colors?.PRIMARY_BACKGROUND_COLOR
              : Colors.secondryBlack
          }
          style={{
            alignSelf: 'center',
            textAlign: 'left',
            paddingHorizontal: normalize(10),
            flex: 1,
          }}
          fontFamily={label == 'name' ? fontFamily.bold : fontFamily.regular}>
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <CommonModal
        handleModalVisibility={handleModalVisibility}
        visibility={visibility}
        modalContainerStyles={{
          top: Platform.OS === 'ios' ? normalize(30) : normalize(30),
        }}
        headerSection={() => {
          return (
            <View style={styles.modalHeaderStyle}>
              <Text fontFamily={fontFamily.bold} size={normalize(16)}>
                {strings('contact_detail.header_title')}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                {data.isAccept == 1 && data.submittedSource != 2 && (
                  <>
                    <TouchableOpacity
                      style={styles.EditStyle}
                      onPress={() => {
                          navigation.navigate('EditContactDetail', {
                            contactDetail: data,
                          });
                          handleModalVisibility()
                      }}>
                      <Text
                        color={colors?.PRIMARY_BACKGROUND_COLOR}
                        fontFamily={fontFamily.semiBold}>
                        {strings('contact_detail.Edit')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={{ alignSelf: 'center' }}
                  onPress={handleModalVisibility}>
                  <CrossIcon width={normalize(12)} height={normalize(12)} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        bodySection={() => {
          setTitle(
            `${data?.TitleId}` == 47
              ? 'Mr.'
              : `${data?.TitleId}` == 48
                ? 'Mrs.'
                : `${data?.TitleId}` == 49
                  ? 'Ms.'
                  : `${data?.TitleId}` == 50
                    ? 'Mdm.'
                    : `${data?.TitleId}` == 51
                      ? 'Sir'
                      : `${data?.TitleId}` == 52
                        ? 'Dr.'
                        : '',
          );
          setName(`${title ? title : ''} ${data?.FirstName != null ? data?.FirstName : ''} ${data?.LastName != null ? data?.LastName : ''}`);
          return (
            <View style={{ paddingVertical: normalize(15) }}>
              {infoFilled(userIcon1, name, 'name')}
              {infoFilled(SalesIcon, data.CustomerType)}
              {infoFilled(PhoneCallIcon, data.Phone1)}
              {infoFilled(MobileCallIcon, data.Phone2)}
              {infoFilled(MailIcon, data.Email)}
              {infoFilled(AddressIcon, data.AcctualAddress)}

              <View style={{ paddingLeft: normalize(40) }}>
                <View style={{ height: normalize(173) }}>
                <MapViewContainer
                    centerCoordinate={coordinates}
                    zoomLevel={15}
                    scrollEnabled={false}
                    zoomEnabled={false}>
                    <MarkerView
                      coordinate={coordinates}
                      markerColor={colors?.PRIMARY_BACKGROUND_COLOR}
                    />
                  </MapViewContainer>
                </View>

                <TouchableOpacity
                  style={{
                    paddingTop: normalize(10),
                  }}
                  onPress={() => {
                   
                    Linking.openURL(
                      Platform.OS === 'ios'
                        ? `maps://app?daddr=${data.AcctualAddress}`
                        : `google.navigation:q=${data.AcctualAddress}`,
                    );
                    // Linking.openURL(
                    //   Platform.OS === 'ios'
                    //     ? 'googleMaps://app?saddr=6.931970+79.857750&daddr=6.909877+79.848521'
                    //     : 'google.navigation:q=6.909877+79.848521',
                    // );
                  }}>
                  <Text
                    color={colors?.PRIMARY_BACKGROUND_COLOR}
                    align={'flex-start'}>
                    {strings('contact_detail.get_Directions')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        footerSection={() => { }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  EditStyle: {
    paddingHorizontal: normalize(15),
    alignSelf: 'center',
  },
  bodySectionWrap: {
    flexDirection: 'row',
    paddingVertical: normalize(10),
  },
  bodyIconStyles: {
    backgroundColor: Colors.iconBackgroundGrey,
    borderRadius: normalize(20),
    padding: normalize(10),
  },
});

export default contactDeatilPopUp;
