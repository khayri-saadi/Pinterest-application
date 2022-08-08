import {View,StyleSheet,Image,Text,Pressable} from 'react-native'
import { AntDesign } from '@expo/vector-icons'; 

import { useNavigation } from '@react-navigation/native';
import RemoteImage from './RemoteImage';

const Pin = ({id,title,image})=> {
    const navigation = useNavigation()
    const gotoOnPinpage = ()=> {
      navigation.navigate('Pin', { id })
      //console.log(title,'title')
      //console.log(id,'id')

    }
 
    const onLike = ()=> {}
    return (
        <Pressable onPress={gotoOnPinpage} style={styles.pin}>
            <View>
          <RemoteImage fileId={image} />
            <Pressable onPress={onLike} style={styles.heart}>
            <AntDesign name="hearto" size={16} color="black" />
            </Pressable>
            </View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
      </Pressable>
    )
}
const styles = StyleSheet.create({
    title: {
    fontSize: 16,
    lineHeight:22,
    fontWeight: '600',
    margin:10,
    color:'#181818'
  },
  image: {
   width:'100%',
   borderRadius:15,
  },
  pin: {
    width:'100%',
    padding:4
  },
  heart : {
    backgroundColor:'#D3CFD4',
    position:'absolute',
    bottom:10,
    right:10,
    padding:5,
    borderRadius:50
  }
})

export default Pin;


