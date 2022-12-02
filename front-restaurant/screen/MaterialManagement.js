import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, FlatList, StatusBar, Text, ScrollView, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Snackbar, Avatar, Divider, Paragraph, Dialog, Portal, Button } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogState, setInventory } from '../store/mainStore';
import { getInventory, restPush } from '../api';

async function schedulePushNotification(body) {
  let str = `${body.product_name}의 유통기한이 ${body.resultDate} 남았습니다.`
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "유통기한 경고",
      body: str,
      data: { data: body },
    },
    trigger: { seconds: 2 },
  });
}

const SortFiel = ({ text, data, setData }) => {
  const [toogle, setToogle] = useState(false);

  const toggelChange = async () => {
    setToogle(!toogle);
    fiel()
  }
  const fiel = () => {
    let type = '';
    if (text == '바코드번호') { type = 'barcode_number' }
    else if (text == '제품이름') { type = 'product_name' }
    else if (text == '종류') { type = 'kindof' }
    else if (text == '유통기한') { type = 'expiry_date' }
    else if (text == '개수') { type = 'count' }
    console.log('.>>>', text)
    sort(type);
  }
  //Ascending, 날짜는 가장 최신이 큼
  const sort = (_text) => {
    let temp = [...data];
    //Ascending
    console.log(data[0][_text])
    if (toogle) {
      temp.sort(function (a, b) {
        if (a[_text] > b[_text]) {
          return -1;
        }
        if (a[_text] < b[_text]) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
    } else {
      temp.sort(function (a, b) {
        if (a[_text] > b[_text]) {
          return 1;
        }
        if (a[_text] < b[_text]) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }
    setData(temp);
  }
  return (
    <TouchableOpacity onPress={toggelChange} style={{
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderColor: '#008bff',
      backgroundColor: '#008bff',
      borderWidth: 1,
      borderRadius: 10,
      textAlign: 'center',
      marginHorizontal: 5,
      flexDirection: 'row',
      width: 100, padding: 10
    }}>
      <Text style={{ color: '#ffffff', fontWeight: 'bold' }} numberOfLines={1}>{text}</Text>
      <AntDesign name={toogle ? 'caretdown' : 'caretup'} size={15} color="white" />
    </TouchableOpacity>
  )
}


const Item = ({
  barcode_number,
  product_name,
  kindof,
  expiry_date,
  count
}) => {
  useEffect(() => {
    _NotificationExpiry();
  }, [])
  const _NotificationExpiry = async () => {
    console.log(`-------*------`)
    let resultDate = subDays();
    if (resultDate > 0) {
      if (resultDate < 15) {
        console.log(product_name,resultDate)
        await schedulePushNotification({product_name,resultDate});
      }
    }
  }
  const subDays = () => {
    const today = new Date();
    const expirySplit = expiry_date.split('.');
    const now = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const expirtDate = new Date(
      expirySplit[0],
      expirySplit[1],
      expirySplit[2]
    )
    const elapsedMSec = expirtDate.getTime() - now.getTime(); // 172800000
    const elapsedDay = elapsedMSec / 1000 / 60 / 60 / 24; // 2
   
    return elapsedDay;

  }
  return (
    /* 인가번호 상호 주소 메인메뉴 지정일자 인허가연도 */
    <TouchableOpacity onPress={async () => {
    }} style={{
      flex: 1,
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'space-between',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      backgroundColor: '#ffffff',
      borderRadius: 3,
      elevation: 5,
      alignItems: 'center'
    }}>

      <View style={{
        flex: 1.3,
        // width:100,
        // height:100,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Image style={{ width: '100%', height: '100%' }} source={{ uri: "https://static.coupangcdn.com/image/vendor_inventory/07be/0f6935d829c90505121bdf67d37ce66dccc4e75fe1f725ec8bcd764ab2ac.png" }} />
      </View>

      <View style={{ flex: 2.5, flexDirection: 'column', backgroundColor: '#ffffff', justifyContent: 'center' }}>

        <Text style={{ width: '100%', textAlign: 'left', fontSize: 18, fontWeight: 'bold' }}>{product_name}</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ width: 70, textAlign: 'left' }}>바코드번호 </Text>
          <Text style={{ width: 130, textAlign: 'left' }}>{barcode_number}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ width: 70, textAlign: 'left' }}>종류</Text>
          <Text style={{ width: 130, textAlign: 'left' }}>{kindof}</Text>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <Text style={{ width: 70, textAlign: 'left' }}>유통기한</Text>
          <Text style={{ width: 130, textAlign: 'left' }}>{expiry_date}</Text>
        </View>

      </View>
      <View style={{ flex: 0.5, flexDirection: 'column', padding: 5, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{}}>수량</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{count}</Text>
      </View>
    </TouchableOpacity>
  );
};
const menuSeparator = () => { return <View style={{ height: 10 }}></View> }

const renderItem = ({ item }) => (<Item
  barcode_number={item.barcode_number}
  product_name={item.product_name}
  kindof={item.kindof}
  expiry_date={item.expiry_date}
  count={item.count}
/>);

const MaterialManagement = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);

  const [message, setMessage] = useState('')
  const [visibles, setVisibles] = useState(false);
  const onToggleSnackBar = () => setVisibles(!visibles);
  const onDismissSnackBar = () => setVisibles(false);

  const hideDialog = () => {
    dispatch(setDialogState({
      isVisible: false,
      content: ''
    }))
  };

  const dispatch = useDispatch();
  const { inventory, dialog } = useSelector((state) => state.mainStore)

  useEffect(() => {
    _getInventory();
    // _restPush();
  }, [])

  useEffect(() => {
    setVisible(dialog.isVisible);
  }, [dialog]);

  useEffect(() => {
    setData(inventory);
  }, [inventory]);

  const _restPush = async () => {
    let res = await restPush();
    console.log(`------------------`)
    console.log(res);
    setMessage(res.message);
    setTimeout(() => {
      setVisibles(true);
    }, 1000);
  }
  const _getInventory = async () => {
    try {
      let res = await getInventory();
      // console.log(res.inventory_list);
      if (res.inventory_list) {
        dispatch(setInventory(res.inventory_list));
      }
    } catch (error) { }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button onPress={onToggleSnackBar}>{visibles ? 'Hide' : 'Show'}</Button> */}
      <Snackbar
        visible={visibles}
        onDismiss={onDismissSnackBar}
        duration={6000}
        theme={{ colors: { accent: 'white', text: 'red', inversePrimary: 'red' } }}
        style={{ backgroundColor: 'orange', fontSize: 130 }}
        action={{ label: '알림', color: 'white' }}>
        <TouchableOpacity onPress={onDismissSnackBar}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'black', flex: 1 }} >{message}</Text>
        </TouchableOpacity>
      </Snackbar>


      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>알림</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{dialog.content}</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>

      <View style={{ alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <Avatar.Image size={24} style={{ backgroundColor: '#ffffff' }} source={{ uri: 'https://www.msit.go.kr/images/user/img_mi_symbol.png' }} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#ffffff' }}>재고관리</Text>
        <View style={{ position: 'absolute', top: 10, right: 20 }}>
          <TouchableOpacity style={{ elevation: 5, padding: 5, borderRadius: 80, backgroundColor: '#ffffff' }} onPress={() => { navigation.navigate('ScannerComponent') }}>
            <Text>재고입력</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <ScrollView horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <SortFiel text={'바코드번호'} data={data} setData={setData} />
          <SortFiel text={'제품이름'} data={data} setData={setData} />
          <SortFiel text={'종류'} data={data} setData={setData} />
          <SortFiel text={'유통기한'} data={data} setData={setData} />
          <SortFiel text={'개수'} data={data} setData={setData} />
        </ScrollView>
      </View>

      <View style={{ flex: 10, padding: 10 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.barcode_number}
          ItemSeparatorComponent={menuSeparator} />
      </View>
    </SafeAreaView>);
}

export default MaterialManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#2ad3e7'
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});