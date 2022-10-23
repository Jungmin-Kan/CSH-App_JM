import React, { useState, useEffect, memo, useCallback } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View, FlatList, TouchableOpacity } from 'react-native';
import { Card, Avatar, Paragraph, Text, Button, Title, Searchbar, Snackbar } from 'react-native-paper';
import * as Location from 'expo-location';
import { fetchUser, userPush } from '../../api';
import * as Linking from 'expo-linking';
console.disableYellowBox = true;


const menuSeparator = () => { return <View style={{ height: 10, }}></View> }


const Item = memo(({ title, address }) => {
  /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
  const [destination, setDestination] = useState(``);
  useEffect(() => { getScheme(); }, []);
  useEffect(()=>{
    console.log(destination);
  },[destination]);
  const getScheme = async () => {
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    const { latitude, longitude } = location.coords;
    let lat, long;
    fetch("https://address.dawul.co.kr/input_pro.php", {
      "headers": {
        "accept": "*/*",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "pragma": "no-cache",
        "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
      },
      "referrer": "https://address.dawul.co.kr/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": `refine_ty=8&protocol_=${address}`,
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(res => res.text()).then(data => {
      var x = data.split('|');
      long = x[3];
      lat = x[4];
      setDestination(`nmap://route/car?slat=${latitude}&slng=${longitude}&sname=내위치&dlat=${lat}&dlng=${long}&dname=${address}&appname=com.example.myapp`)
    });
  };
  return (
    <Card>
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{address}</Paragraph>
      </Card.Content>
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
      <Card.Actions>
        <Avatar.Image size={24} source={{ uri: 'https://clova-phinf.pstatic.net/MjAxODAzMjlfOTIg/MDAxNTIyMjg3MzM3OTAy.WkiZikYhauL1hnpLWmCUBJvKjr6xnkmzP99rZPFXVwgg.mNH66A47eL0Mf8G34mPlwBFKP0nZBf2ZJn5D4Rvs8Vwg.PNG/image.png' }} />
        <Button color='green' onPress={() => {
          Linking.openURL(destination);
        }}>네이버 지도로 이동하기</Button>
      </Card.Actions>
    </Card>
  );
});

const RestaurantList = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const [message, setMessage] = useState('')

  const [visibles, setVisibles] = useState(false);
  const onDismissSnackBar = () => setVisibles(false);

  useEffect(() => {
    _dsa();
    setLocation();
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     // setFilteredDataSource(responseJson);
    //     // setMasterDataSource(responseJson);
    //     setFilteredDataSource([{
    //       "address": "강원도 원주시 우산동 90-4",
    //       "title": "청솔식당",
    //     }, {
    //       "address": "강원도 원주시 중앙로 46",
    //       "title": "민생회관",
    //     }, {
    //       "address": "강원도 원주시 장미공원길 74 (단계동)",
    //       "title": "영월장칼국수",
    //     }, {
    //       "address": "강원도 원주시 중평길 59 (평원동)",
    //       "title": "무궁화집",
    //     }]);
    //     setMasterDataSource([{
    //       "address": "강원도 원주시 우산동 90-4",
    //       "title": "청솔식당",
    //     }, {
    //       "address": "강원도 원주시 중앙로 46",
    //       "title": "민생회관",
    //     }, {
    //       "address": "강원도 원주시 장미공원길 74 (단계동)",
    //       "title": "영월장칼국수",
    //     }, {
    //       "address": "강원도 원주시 중평길 59 (평원동)",
    //       "title": "무궁화집",
    //     }]);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    return () => { }
  }, []);


  const setLocation = async () => {
    let setLoc = "";
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // let _error = '';
    // if (status !== 'granted') { _error = '위치 권한을 허용해주세요.'; }

    // let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation });
    // const { latitude, longitude } = location;
    // let geocode = await Location.reverseGeocodeAsync({ latitude, longitude })
    // console.log(geocode);
    // geocode[0].region == "서울특별시" ? setLoc = geocode[0].district : setLoc = geocode[0].region
    setLoc = "세종특별자치시 조치원읍";
    fetchUser(setLoc, setFilteredDataSource, setMasterDataSource);
  }



  const _dsa = async () => {
    let res = await userPush();
    console.log(res);
    setMessage(res.message);
    setTimeout(() => {
      setVisibles(true);
    }, 1000);
  }

  const renderItem = ({ index, item }) => (<Item key={index} title={item.title}
    address={item.address}
  />);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter((item) => {
        // Applying filter for the inserted text in search bar
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', flexDirection:'row', justifyContent:'center' }}>
      <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: 'black' }}>모범음식점 찾기</Text>
      </View>
      {/* <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10 }}>모범음식점 찾기</Text>
      </View> */}

      <View style={{ padding: 10 }}>
        <Searchbar
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
      </View>

      <View>
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={menuSeparator}
          renderItem={renderItem} />
      </View>

      <Snackbar
        visible={visibles}
        onDismiss={onDismissSnackBar}
        duration={6000}
        theme={{ colors: { accent: 'white', text: 'red', inversePrimary: 'red' } }}
        style={{
          backgroundColor: 'orange',
          fontSize: 130
        }}
        action={{
          label: '알림',
          color: 'white',
        }}>
        <TouchableOpacity onPress={onDismissSnackBar}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'black', flex: 1 }} >

            {
              ((message).length > 10) ?
                (((message).substring(0, 40)) + '...') :
                message
            }
          </Text></TouchableOpacity>
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#E4E4E409'
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  title: {
    fontSize: 32,
  }
});

export default RestaurantList;

