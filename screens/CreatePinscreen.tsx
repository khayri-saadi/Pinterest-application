import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TextInput,StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNhostClient } from '@nhost/react';
import { useNavigation } from '@react-navigation/native';


const Create_Pin_Mutation = `mutation MyMutation ($image : String!, $title:String) {
  insert_pins(objects: {image:$image, title: $title}) {
    returning {
      created_at
      id
      image
      title
      user_id
    }
  }
}`

export default function CreatePinscreen() {
  const [image, setImage] = useState<null | String>(null);
  const [title,setTitle] = useState('')

  const nhost = useNhostClient()
  const navigation = useNavigation()

  const UploadFile = async()=> {
    if(!image) {
      return {
        error : 'No image selected',
      }
    }
    const parts = image.split('/');
    const name = parts[parts.length - 1]
    const nameParts = name.split('.');
    const extension = nameParts[nameParts.length - 1]

    const uri = Platform.OS === "ios" ? image.replace("file://", "") : image;
    const result  = await nhost.storage.upload({
      file : {
        name,
        type: `image/${extension}`,
        uri,
      }
    })
    return result;
  }
  const OnsubmitPin = async()=> {
  const result  = await  UploadFile()
  if(result.error) {
    Alert.alert('Error uploading the image',result.error.message);
    return
  }
  const response =  await nhost.graphql.request(Create_Pin_Mutation, {
    title,
    image: result.fileMetadata.id
   })
   //console.log(response.error)
   if(response.error) {
    Alert.alert('an error occured while adding pin',response.error.message)
   }
   else {
    navigation.goBack()
   }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

   // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={styles.root}>
      <Button title="Upload your Pin" onPress={pickImage} style={styles.btn} />
      {image && (
      <>
      <Image source={{ uri: image }} 
        style={styles.image} />
        <TextInput value={title}
         onChangeText={setTitle} 
         style={styles.input}/> 
         <Button title="Submit your pin" onPress={OnsubmitPin} />
      </> 
      
      ) }
    </View>
  );
}

const styles = StyleSheet.create({
    root : {
        flex: 1, 
        alignItems: 'center',
         justifyContent: 'center',
         padding : 10
    },
    input : {
        borderWidth : 1 ,
        borderColor : "gainsboro",
        padding : 5,
        width : '100%',
        borderRadius : 7
    },
    image : {
         width: '100%',
          height: 400 ,
          marginVertical : 10
    },
})