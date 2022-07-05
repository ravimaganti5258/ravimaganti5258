import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
// import PDFView from 'react-native-view-pdf';
import { useNavigation } from '@react-navigation/core';
import Header from '../../../components/header/index.js';
import { strings } from '../../../lib/I18n/index.js';
import { fontFamily, normalize } from '../../../lib/globals';
import { Colors } from '../../../assets/styles/colors/colors.js';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WebView } from 'react-native-webview';
import PairButton from '../../../components/Button/pairBtn';



import RNPrint from 'react-native-print';


const PdfViewer = (props) => {

  const navigation = useNavigation();
  const resourceType = props?.route?.params?.htmlData;
  console.log('resourceType==>',resourceType)

 

  const downloadPDF = async()=>{
    try {
      await RNPrint.print({
        html: resourceType
      })
    }catch(error){
        console.log({error})
    }
    //navigation.goBack(); 
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={strings('Response_code.PDF')}
        leftIcon={'Arrow-back'}
        navigation={navigation}
        headerTextStyle={styles.headerStyles}
      />
      {/* <PDFView
        fadeInDuration={250.0}
        style={styles.pdf}
        resource={resourceType}
        resourceType={'base64'}
        onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
        onError={(error) => console.log('Cannot render PDF', error)}
      /> */}
       <View style={styles.pdfContainer}>
       <WebView
       style={styles.pdf}
        originWhitelist={['*']}
        source={{ html: resourceType }}
      />
       </View>
      <View style={styles.PairButton}>
      <PairButton  
            title1={strings('pair_button.cancel')}
            title2={strings('pair_button.print')}
            onPressBtn2={() => {
               downloadPDF();
            }}
            onPressBtn1={() => {
              navigation.goBack();
            }}
          />
      </View>
    </SafeAreaView>
  )
}

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width-10,
    height: Dimensions.get('window').height,
    
    
  },
  headerStyles: {
    fontFamily: fontFamily.semiBold,
    fontSize: normalize(19),
    color: Colors.secondryBlack,
    marginBottom: 0,
    flex: 1,
  },
  pdfContainer :{
    flex: 1,
    borderColor:"black",
    borderWidth:1  ,
    margin:normalize(5),
    // alignItems:'center',
    // alignSelf:'center',
    // justifyContent:'center'
    // paddingHorizontal:normalize(5)
  },
  PairButton :{
      padding:3
  }
})