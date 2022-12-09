import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import { Paragraph, Card, Divider, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerToken, restLogin, SUCCESS } from '../api';
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * @description 랜덤 문자열 반환
 * @param {*} num 문자열 범위
 * @returns {string}
 */
const generateRandomString = (num = 20) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


/**
 * @description token 생성 및 서버에 토큰 등록
 * @returns {string}
 */
const registerForPushNotificationsAsync = async (id) => {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    try {
      // let res = await registerToken(token, id);
      let res = await registerToken(token, generateRandomString());
    } catch (error) { }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bnum: '',
      password: '',
      forgot: false,
      status: {},
      setExpoPushToken: ''
    }

  }
  video = React.createRef(null);

  componentDidMount() {
    this.getMyStringValue();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.bnum !== prevState.bnum) {
      console.log(this.state.bnum)
    }
  }

  componentWillUnmount() { }

  onClickListener = (viewId) => { Alert.alert("Alert", "아직 준비중입니다" + viewId) }

  _resLogin = async () => {
    // this.props.navigation.navigate('RestaurantMainScreen');
    // registerForPushNotificationsAsync(this.state.bnum).then(token => this.setState({ setExpoPushToken: token }));
    console.log('_resLogin');
    console.log(this.state.bnum, this.state.password);
    try {
      let res = await restLogin({
        bz_num: this.state.bnum,
        password: this.state.password
      });
      console.log(res);
      if (res.result == SUCCESS) {
        registerForPushNotificationsAsync(this.state.bnum).then(token => this.setState({ setExpoPushToken: token }));
        this.props.navigation.navigate('RestaurantMainScreen');
        this.setPushStatus(this.state.bnum, this.state.password);
        return;
      }
      this.setState({ bnum: '', password: '' })
    } catch { }
  }

  setPushStatus = async (businessNumber, passWord) => {
    try {
      await AsyncStorage.setItem('USERSET', JSON.stringify({
        doNotify: false,
        businessNumber: businessNumber,
        passWord: passWord,
      }));
      console.log(value);
    } catch (error) { }
  }

  getMyStringValue = async () => {
    try {
      let res =  await AsyncStorage.getItem('USERSET')
      console.log(JSON.parse(res));
      let {businessNumber, passWord } = JSON.parse(res);
      this.setState({
        bnum : businessNumber,
        password : passWord
      })
    } catch { }
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          ref={this.video}
          style={[styles.video, { width: '100%', height: '100%', position: 'absolute' }]}
          source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-cracking-eggs-in-a-bowl-43011-large.mp4', }}
          shouldPlay={true}
          useNativeControls={false}
          resizeMode='stretch'
          isLooping
          onPlaybackStatusUpdate={() => {
            this.setState({ status: this.state.status })
          }}
        />

        <View style={{ alignItems: 'center', padding: 30 }}>
          <Avatar.Image size={100} style={{ backgroundColor: '#ffffff' }} source={{ uri: 'https://www.msit.go.kr/images/user/img_mi_symbol.png' }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#ffffff' }}>청신한 업주용</Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons style={styles.inputIcon} name="archive-eye" size={24} color="black" />
          <TextInput style={styles.inputs}
            value={this.state.bnum}
            placeholder="사업자등록번호"
            keyboardType="number-pad"
            underlineColorAndroid='transparent'
            onChangeText={(bnum) => this.setState({ bnum })} />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons style={styles.inputIcon} name="account-lock" size={24} color="black" />
          <TextInput style={styles.inputs}
            value={this.state.password}
            placeholder="비밀번호"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password) => this.setState({ password })} />
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this._resLogin()}>
          <Text style={styles.loginText}>로그인</Text>
        </TouchableHighlight>

        {/* <TouchableOpacity style={[styles.buttonContainer]} onPress={() => this.onClickListener('restore_password')}>
          <Text style={{ color: '#ffffff' }}>비밀번호 찾기</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={[styles.buttonContainer]} onPress={async () => { this.props.navigation.navigate('SignUpScreen') }}>
          <Text style={{ color: '#ffffff' }}>회원가입</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginView;

const styles = StyleSheet.create({
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  }
});
