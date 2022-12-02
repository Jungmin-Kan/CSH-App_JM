import { StyleSheet, Text, View, Button, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';
import { sendVideo } from '../api';

const question = ['후라이펜을 촬영해주세요!', '식기를 촬영해주세요!', '바닥을 촬영해주세요!'];
const RealTimeInspection = () => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [count, setCount] = useState(0);
  const [video, setVideo] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    permissionSet();
    navigation.addListener('blur', (e) => {
      console.log('종료');
      return () => { }
    });
    return () => { }
  }, []);

  useEffect(() => {
    if (count > 2) {
      Alert.alert(
        "알림",
        `촬영이 완료되었습니다.`,
        [
          {
            text: "OK", onPress: () => { }
          }
        ]
      );
      setCount(0);
    }
  }, [count])
  const permissionSet = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(cameraPermission.status === "granted");
    setHasMicrophonePermission(microphonePermission.status === "granted");
    setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
  };

  if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) {
    return <><Text>Requestion permissions...</Text></>
  } else if (!hasCameraPermission) {
    return <><Text>Permission for camera not granted.</Text></>
  }

  let recordVideo = () => {
    setIsRecording(true);
    let options = {
      quality: "1080p",
      maxDuration: 60,
      mute: true
    };

    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
    });

    setTimeout(() => {
      stopRecording();
    }, 3000);
  };

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if (video) {
    let saveVideo = async () => {
      try {
        let res = await sendVideo(video);
        console.log(res);
        if (res.result == 'success') {
          setCount(prev => prev + 1);
          setVideo(undefined);
        }else{
          setVideo(undefined)
        }
      } catch {}
      // MediaLibrary.saveToLibraryAsync(video.uri).then(() => { setVideo(undefined);});
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
          isLooping
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', position: 'absolute', width: '100%' }}>
          {/* <Button title="Share" onPress={shareVideo} /> */}
          {hasMediaLibraryPermission ?
            <TouchableOpacity style={{ backgroundColor: '#2ad3e7', borderRadius: 8, padding: 10 }} onPress={saveVideo} ><Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>전송하기</Text></TouchableOpacity> : undefined}
          {/* <Button title="다시 촬영하기" onPress={() => setVideo(undefined)} /> */}
          <TouchableOpacity style={{ backgroundColor: '#2ad3e7', borderRadius: 8, padding: 10 }} onPress={() => {
            setVideo(undefined);
          }} ><Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>다시 촬영하기</Text></TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {!isRecording && <View style={{ position: 'absolute', top: '10%', zIndex: 1, width: '100%', alignItems: 'center', backgroundColor: '#ffffff80' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 30 }}>{question[count]}</Text>
      </View>}
      <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* <Button title={isRecording ? "촬영종료" : "촬영시작"} onPress={isRecording ? stopRecording : recordVideo} /> */}
          {!isRecording && <TouchableOpacity style={{ backgroundColor: '#2ad3e7', borderRadius: 8, padding: 10 }} onPress={recordVideo} ><Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 20 }}>촬영시작</Text></TouchableOpacity>}
        </View>
      </Camera>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: "#fff",
    borderRadius: 8
    // alignSelf: "flex-end"
  },
  video: {
    flex: 1,
    alignSelf: "stretch"
  }
});


export default RealTimeInspection;