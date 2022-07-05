import { useNavigation } from '@react-navigation/core';
import React, { memo, useEffect, useState } from 'react';

import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import EventCards from '../../../components/Cards/EventCards';
import MapViewContainer from '../../../components/MapView';
import MarkerView from '../../../components/MarkerView';
import { useDimensions } from '../../../hooks/useDimensions';
import { normalize, percent } from '../../../lib/globals';
import { useColors } from '../../../hooks/useColors';
import { fetchjobDeailsPerId, fetchJobDetailsData } from '../../../database/JobDetails';
import moment from 'moment';

const renderFalgBasedonstatus = (value) => {
  let Status = '';
  switch (value?.JobStatusid) {
    //Awaiting Schedule
    case 1:
      Status = value?.jobstatus;
      break;
    //Scheduled
    case 2:
      Status = value?.AcceptanceStatusId == 1 ? 'Accepted' : value?.jobstatus;
      break;
    //En Route
    case 3:
      Status = value?.jobstatus;
      break;
    // On Site
    case 4:
      Status = value?.jobstatus;
      break;
    //Completed-submitted
    case 5:
      // Status = value?.issubmitted ? 'Submitted' : value?.jobstatus;
      Status = value?.ApprovalSatatusId == 1 || value?.ApprovalSatatusId == 2 ? 'Submitted' : value?.ApprovalSatatusId == 3 ? 'Approval Rejected' : value?.jobstatus
      break;
    //Unresolved
    case 6:
      Status = value?.jobstatus;
      break;

    default:
      break;
  }
  return Status;
};

const RenderItem = memo(({ item, width, navigation }) => {

  const handleNavigation = (item) => {


    try {
      const callback = (obj) => {
        navigation.navigate('JobDetail', {
          jobId: jobDetails?.jobno,
          isCrewMember: jobDetails?.CrewJob,
          jobDetailsData: obj,
        });
      }
      fetchjobDeailsPerId(fetchJobDetailsData, item?.jobno, callback)
    } catch (err) { }
  };
  return (
    <>
      {item?.event?.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.renderItemStyles}
            onPress={() => handleNavigation(item)}>
            <EventCards
              type={'mapViewCards'}
              jobNumber={item?.jobno}
              eventDate={item?.ScheduledDateTime}
              address={item?.AcctualAddress}
              technicianName={item?.customername}
              jobTitle={item?.wocategory}
              CrewJob={item?.CrewJob}
              eventJobTime={
                item?.Days > 0 ? item?.Days > 1 ? `${item.Days} Days` : `${item.Days} Day` : '' + `${item?.Hours > 0 ? ' ' + item?.Hours + 'h': ''}`+ `${item?.Minutes > 0 ? ' ' +item?.Minutes + 'm': ''}`
              }
              eventStatus={renderFalgBasedonstatus(item)}
            />
          </TouchableOpacity>
        );
      })}
    </>
    
  );
});

const MapView = ({ mapViewData, flatListRef, scrollIndex }) => {
  const { width } = useDimensions();
  const [coordinates, setCoordinates] = useState([-122.406417, 37.785834]);
  const { colors } = useColors();

  const navigation = useNavigation();

  const onViewRef = React.useRef(({ viewableItems }) => {
    try {
      const longitude = viewableItems[0]?.item?.event[0]?.Longitude;
      const latitude = viewableItems[0]?.item?.event[0]?.Latitude;
      const Lon = parseFloat(longitude);
      const Lat = parseFloat(latitude);
      longitude || latitude != null ? setCoordinates([Lon, Lat]) : null;
    } catch (error) { }
  });

  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item, index }) => {
    return <RenderItem item={item} 
    width={width} 
    navigation={navigation} />;
  };

  return (
    <>
      <MapViewContainer
        centerCoordinate={
          coordinates?.length > 0 ? coordinates : [-122.406417, 37.785834]
        }
        zoomLevel={coordinates?.length > 0 ? 7 : 1}
        scrollEnabled={true}
        zoomEnabled={true}>
        {coordinates?.length > 0 ? (
          <MarkerView
            coordinate={coordinates}
            markerColor={colors?.PRIMARY_BACKGROUND_COLOR}
          />
        ) : null}
      </MapViewContainer>
      <View style={styles.flatListStyles}>
        <FlatList
          data={mapViewData}
          keyExtractor={(item, index) => `ID-${index}`}
          renderItem={renderItem}
          horizontal={true}
          pagingEnabled={true}
          scrollEventThrottle={1}
          snapToAlignment={'center'}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          maxToRenderPerBatch={70}
          initialNumToRender={70}
          ref={flatListRef}
          initialScrollIndex={scrollIndex}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          
          style={{width: Dimensions.get('window').width}}
        />
      </View>
    </>
  );
};

export default MapView;

const styles = StyleSheet.create({
  flatListStyles: {
    position: 'absolute',
    bottom: normalize(4),
    paddingVertical: normalize(40),
  },
  renderItemStyles: {
    width:Dimensions.get('window').width,
 alignItems:'center'
  },
  cardStyles: {
    marginBottom: normalize(8),

  },
});
