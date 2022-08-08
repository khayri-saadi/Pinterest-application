import { useState } from 'react';
import { StyleSheet, Image,View,ScrollView ,Text, useWindowDimensions,RefreshControl} from 'react-native';


import Pin from '../components/pin';
interface PinsList  {
  pins: {
    id: string;
    image: string;
    title: string;
  }[];
  refreshing?: boolean;
  onRefresh?: () => void;
}

const PinsList = ({Pins,refreshing=false,onRefresh=(()=> {})})=> {

    const width = useWindowDimensions().width
    const numColumns = width < 500 ? 2 : 3
    //console.log(width,'widthhh')
    return(
        <ScrollView    contentContainerStyle={{ width: "100%" }}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View style={styles.container}>
                  
                {Array.from(Array(numColumns)).map((col,colIndex) =>(
                <View style={styles.column} key={`column${colIndex}`}>
                {Pins.filter((item,index)=> index % numColumns === colIndex).map((pin)=> (
                    <Pin title={pin.title} image={pin.image} id={pin.id}/>
                ))}
                </View>
                )) }
                </View>
        </ScrollView>
    )
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
export default PinsList;