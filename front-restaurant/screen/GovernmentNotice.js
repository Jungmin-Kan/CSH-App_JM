import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, Text, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Paragraph, Card, Divider, Avatar } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { governNoticeList } from '../api';

const menuSeparator = () => { return <View style={{ height: 10 }}></View> }


const Item = ({ title, content, date }) => {
  
  const navigation = useNavigation();
  return (<Card>
    <Card.Content>
      <View style={{ flexDirection: 'row', marginBottom:10 }}>
        <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />

        <View style={{ marginLeft:10,flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{title}</Text>
        </View>
      </View>

      <Paragraph numberOfLines={2}>{content}</Paragraph>
      <Paragraph>{date}</Paragraph>
      <TouchableOpacity
       style={{position:'absolute', bottom:10, right:10}}
        activeOpacity={1}
        onPress={() => {
          navigation.navigate('NoticeDetail',{
            title:title, content:content, date:date
          });
        }}>
        <Text style={{color:'blue', fontWeight:'bold'}}>자세히</Text>
      </TouchableOpacity>
    </Card.Content>
  </Card>)
};

/**
 * 
 * @param {
 * date": string,
						"title": string, 
						"content": string
					}} param0 
 * @returns 
 */
const renderItem = ({ item }) => (<Item 
  title={item.title} 
  content={item.content} 
  date={item.date} 
  />);


const GovernmentNotice = ({ navigation }) => {

  const [data, setData] = useState([]);

  useEffect(()=>{
    _governNoticeList();
  },[]);
  const _governNoticeList = async() =>{
    try {
      let res = await governNoticeList();
      setData(res.data);
      console.log(res);
    } catch (error) {}

  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center', flexDirection:'row', justifyContent:'center' }}>
      <Avatar.Image size={24} style={{backgroundColor:'#ffffff'}} source={{uri:'https://www.msit.go.kr/images/user/img_mi_symbol.png'}} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#ffffff' }}>기관공지</Text>
      </View>
      <View style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <View></View>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={menuSeparator} />
      </View>
    </SafeAreaView>);
}

export default GovernmentNotice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#2ad3e7'

  },
  fieldWrap: {
    fontSize: 15,
    fontWeight: 'bold',
    borderColor: 'rgba(158, 150, 150, .5)',
    borderRightWidth: 1, paddingHorizontal: 10
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  paragraphWrap: {
    padding: 5
  },
  title: {
    fontSize: 32,
  },
});