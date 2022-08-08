import { StyleSheet ,Image,ScrollView, Pressable, Alert, ActivityIndicator} from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import PinsList from '../components/listProfile';
import Pins from '../assets/data/pins';
import { Feather} from '@expo/vector-icons';
import {Entypo} from '@expo/vector-icons'; 
import { useNhostClient, useUserId } from '@nhost/react';
import { useEffect, useState } from 'react';


const GET_USER_QWERY = `query MyQuery($id: uuid!) {
  user(id: $id) {
    avatarUrl
    id
    displayName
    Pins {
      id
      image
      title
      created_at
      user_id
    }
  }
}`;
export default function ProfileScreen() {
  const nhost = useNhostClient()
  const userId = useUserId()
  const [user, setUser] = useState('')
  const SignOut = ()=> {
    nhost.auth.signOut()
  }

  const fetchuserData = async()=> {
    const result = await nhost.graphql.request(GET_USER_QWERY, {id : userId})
    if(result.error) {
      Alert.alert('error occured while fetching user data')
    }
    else {
      setUser(result.data.user)
    }
  }
  useEffect(()=> {
    fetchuserData()
  }, [])

  if(!user) {
    <ActivityIndicator/>
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={SignOut}>
          <Feather name='share' size={24} color='black' style={styles.icon}/>
          </Pressable>
          <Entypo name='dots-three-horizontal' size={24} color='black' style={styles.icon}/>
        </View>
        <Image source={{uri: user.avatarUrl}}  style={styles.image}/>
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>100 followers | 550 Followings</Text>
      </View>
      <PinsList Pins={user.Pins} onRefresh={fetchuserData} refreshing={true}/>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin:10
  },
  subtitle : {
    fontWeight:'600',
    color:'#181818',
    margin:10
  },
  image :  {
    borderRadius : 200,
    width : 200,
    aspectRatio : 1,
    marginVertical:10
  },
  header : {
    alignItems:'center'
  },
  icons : {
    flexDirection:'row',
    alignSelf:'flex-end',
    padding:10
  },
  icon : {
    padding : 10
  }
});
