import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  StatusBar,
  Animated,
  // ActivityIndicator
} from 'react-native';

import { Snackbar } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { restSignup, SUCCESS } from '../api';
import { Avatar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

import __app from '../firebase';
import { async } from '@firebase/util';

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(__app);
console.log(auth);

export default class SignUpScreen extends Component {

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.recaptchaVerifier = React.createRef();
    this.state = {
      name: '',
      password: '',
      bnum: '',
      auth: false,
      visibles: false,
      checkBm: false,
      phoneNum: '',
      messageCode: '',
      verificationId: '',
      doPhoneAuth : false,
      idToken:''
    }
  }
  componentDidMount() { }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.bnum !== prevState.bnum) {
      console.log(this.state.bnum)
    }
    if (this.state.visibles) {
      console.log('로그인 화면으로 이동');
      setTimeout(() => {
        this.props.navigation.navigate('LoginScreen');
      }, 1000);
    }
  }

  componentWillUnmount() { }

  _restSignup = async () => {
    try {
      let res = await restSignup({
        name: this.state.name,
        bz_num: this.state.bnum,
        password: this.state.password,
      });
      console.log(res);
      console.log(this.state.name, this.state.password, this.state.bnum)
      if (res.result == SUCCESS && this.state.auth) {
        console.log('내부 진입')
        this.setState({ visibles: true });
        this.setState({ bnum: '', password: '', name: '' })
      } else {
        alert('회원가입 실패. 정보가 올바르게 입력, 인증되었는지 확인해주세요.');
      }
    } catch (e){ }
  }

  /**
   * @description 인증코드, auth코드 받는 함수
   */
  phoneAuth = async () => {
    if(this.state.phoneNum!=''){
      try {
        const phoneProvider = new PhoneAuthProvider(auth);
        console.log(this.state.phoneNum)
        console.log(phoneProvider);
        let subPhone = this.state.phoneNum.substring(3, this.state.phoneNum.length);
        let subPhoneFirst = subPhone.substring(0, 4);
        let subPhoneSecond = subPhone.substring(4, 8);
        const verificationId = await phoneProvider.verifyPhoneNumber(`+82-10-${subPhoneFirst}-${subPhoneSecond}`, this.recaptchaVerifier.current);
        console.log(verificationId);
        if (verificationId) {
          this.setState({ doPhoneAuth : true})
          this.setState({ verificationId: verificationId});
          this.setState({ phoneNum: ''});
        }

      } catch { }    
    }
  }

  authCode = async () => {
    console.log(this.state.verificationId, this.state.messageCode)
    try {
      const credential = PhoneAuthProvider.credential(this.state.verificationId, this.state.messageCode);
      console.log(credential);
      let res = await signInWithCredential(auth, credential);
      console.log(`인증여부 >>>>>>>>`);
      console.log(res);
      console.log(`인증여부 타깃 >>>>>>>>`);
      if (res._tokenResponse.idToken) {
        this.setState({
          phoneNum:'',
          messageCode : '',
          idToken: res._tokenResponse.idToken
        });
      }
    } catch { }
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <AntDesign name="loading2" size={24} color="blue" /> */}
        {this.state.checkBm && <View style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#dcdcdc', zIndex: 1 }}>
          <><ActivityIndicator size={100} hidesWhenStopped={true} animating={true} color={'#00b5ec'} style={{ marginBottom: 10 }} />
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>사업자번호 조회 중...</Text></>
        </View>}

        <Snackbar
          visible={this.state.visibles}
          duration={6000}
          theme={{ colors: { accent: 'white', text: 'white', inversePrimary: 'white' } }}
          style={{ backgroundColor: 'green', fontSize: 130 }}
          action={{ label: '알림', color: 'white' }}>
          <TouchableOpacity onPress={() => { this.setState({ visibles: false }) }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', flex: 1 }}>{'회원가입을 완료했습니다.'}</Text>
          </TouchableOpacity>
        </Snackbar>
        <StatusBar animated={true} backgroundColor="#61dafb" barStyle='dark-content' hidden={false} />
        <View style={{ marginBottom: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Avatar.Image size={24} style={{ backgroundColor: '#ffffff' }} source={{ uri: 'https://www.msit.go.kr/images/user/img_mi_symbol.png' }} />
          <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: 'bold' }}>청신한 식당등록</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="이름"
            value={this.state.name}
            underlineColorAndroid='transparent'
            onChangeText={(name) => this.setState({ name })} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="비밀번호"
            value={this.state.password}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(password) => this.setState({ password })} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="사업자번호"
            value={this.state.bnum}
            underlineColorAndroid='transparent'
            onChangeText={(bnum) => this.setState({ bnum })} />

          <TouchableOpacity style={{
            height: 30,
            marginRight: 5,
            justifyContent: 'center',
            backgroundColor: this.state.auth ? '#22C55E' : '#dcdcdc',
            borderRadius: 8,
            paddingHorizontal: 10
          }} onPress={() => {
            this.setState({ checkBm: true });
            setTimeout(() => { this.setState({ auth: true, checkBm: false }) }, 2000);
          }}>
            {this.state.auth ? <Text style={{ color: '#ffffff', fontSize: 10 }}>인증완료</Text> : <Text style={{ color: '#ffffff', fontSize: 10 }}>인증하기</Text> }
          </TouchableOpacity>
        </View>



        {this.state.doPhoneAuth && <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="인증코드"
            value={this.state.messageCode}
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(messageCode) => this.setState({ messageCode })} />

          <TouchableOpacity style={{
            height: 30,
            marginRight: 5,
            justifyContent: 'center',
            backgroundColor: '#00b5ec',
            borderRadius: 8,
            paddingHorizontal: 10
          }} onPress={() => this.authCode()}>
            <Text style={{ color: '#ffffff', fontSize: 10 }}>인증하기</Text>
          </TouchableOpacity>
        </View>}


        {/* 전화번호 입력하는 영역 */}
        {!this.state.doPhoneAuth && <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            editable={!this.state.idToken ? true : false}
            selectTextOnFocus={!this.state.idToken ? true : false} 
            placeholder="01063980790"
            value={this.state.phoneNum}
            underlineColorAndroid='transparent'
            onChangeText={(phoneNum) => this.setState({ phoneNum })} />

          <TouchableOpacity style={{
            height: 30,
            marginRight: 5,
            justifyContent: 'center',
            backgroundColor: '#00b5ec',
            borderRadius: 8,
            paddingHorizontal: 10
          }} onPress={() => this.phoneAuth()}>
            <Text style={{ color: '#ffffff', fontSize: 10 }}>전화인증 코드받기</Text>
          </TouchableOpacity>
        </View>}
        {(this.state.idToken ? true : false) && <Text>핸드폰인증 완료</Text> }

        <FirebaseRecaptchaVerifierModal
          ref={this.recaptchaVerifier}
          firebaseConfig={__app.options} />

        <TouchableHighlight style={[styles.buttonContainer, styles.signupButton]} onPress={() => this._restSignup()}>
          <Text style={styles.signUpText}>회원가입</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  signupButton: {
    backgroundColor: "#00b5ec",
  },
  signUpText: {
    color: 'white',
  }
});
