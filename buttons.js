import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
const Tecla=(props)=>{

    return(
        <TouchableOpacity 
           style={props.estilo}
           onPress={()=>props.metodo(props.arg)}>
           <Text style={{textAlign:'center',fontSize:25,color:'#ffffff'}} >{props.digito}</Text>
        </TouchableOpacity>)
}
export default Tecla;
