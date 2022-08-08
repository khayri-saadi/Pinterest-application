import { StyleSheet, Image,View,ScrollView ,FlatList,Text} from 'react-native';
import { useEffect, useState } from 'react';
import PinsList from '../components/listProfile'
import { useNhostClient } from '@nhost/react';
import {Alert} from 'react-native';
export default function HomeScreen() {
  const nhost = useNhostClient()
  const [Pins,setPins] = useState([])
  const [loading , setLoading] = useState(false)

  const fetchPins = async ()=> {
    setLoading(true)
    const response = await nhost.graphql.request(`query {
  pins {
    user_id
    title
    image
    id
    created_at
  }
}`)
  console.log(response) // the url of our nhost backend
if(response.error) {
  Alert.alert('error occured when fetching Pins')
} else {
  setPins(response.data.pins)
}
setLoading(false)

  }
  useEffect(()=> {
    fetchPins()
  }, [])
  return (
   <PinsList Pins={Pins} onRefresh={fetchPins} refreshing={loading} />
  );
}
const styles = StyleSheet.create({
  container: {
  flexDirection:'row',
    padding:15
  },
  column : {
    flex:1

  }
  
});
