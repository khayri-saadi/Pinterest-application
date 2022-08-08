import {Text,View,Image,StyleSheet,Pressable} from 'react-native';
import { useEffect,useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation ,useRoute} from '@react-navigation/native';
import {Alert} from 'react-native';
import { useNhostClient } from '@nhost/react';
import RemoteImage from '../components/RemoteImage';


const qwery_PIN = `
query MyQuery ($id: uuid!) {
  pins_by_pk(id: $id) {
    created_at
    id
    image
    title
    user_id
    user {
      avatarUrl
      displayName
    }
  }
}
`;
const Pinpage = ()=> {
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()
    const route = useRoute()
    const [pin,setPin] = useState()
    const nhost = useNhostClient()
    const pinId = route.params?.id


    const fetchPins = async (pinId)=> {
    const response = await nhost.graphql.request(qwery_PIN,{id:pinId})
    if(response.error) {
    Alert.alert('error occured when fetching pins !!! ')
   console.log(response.error,'this errorrrrrrrrrrrrrrrrrrrrrrr')
    } else {
    setPin(response.data.pins_by_pk)
    console.log(response.data.pins_by_pk,'1111111111111')
    }
    }
 
    useEffect(()=> {
    fetchPins(pinId)
    },[pinId])
       const goToHome = ()=> {
        navigation.goBack()
    }
    if(!pin) {
        return (<Text>Pin not found</Text>)
    }
    return(
        <SafeAreaView style={{backgroundColor:'black'}}>
            <StatusBar style='light' />
            <View style={styles.root}>
                <RemoteImage fileId={pin.image} />
                <Text style={styles.title}>{pin.title}</Text>
            </View>
            <Pressable onPress={goToHome} style={[styles.goback,{top:insets.top +20}]}>
            <Ionicons name='chevron-back' size={35} color='white' />
            </Pressable>
        </SafeAreaView>   
    )
}

export default Pinpage;

const styles = StyleSheet.create({
    image:{
        width:'100%',
        borderTopLeftRadius : 50,
        borderTopRightRadius : 50 
    },
    title : {
        fontSize: 16,
        lineHeight:22,
        fontWeight: '600',
        margin:15,
        color:'#181818',
        textAlign:'center',
        LineHeight : 35
    },
    root : {
        height:'100%',
        backgroundColor:'white',
        borderTopLeftRadius : 50,
        borderTopRightRadius : 50
    },
    goback : {
        position : 'absolute',
        left : 10
    }
})