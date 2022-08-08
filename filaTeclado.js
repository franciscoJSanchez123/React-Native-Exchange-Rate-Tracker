import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Tecla from './buttons';
const FiladeTeclado=(props)=>{

    if(props.colQuantity===3){
        return (
        
            <View style={props.estiloFila}>
                
                <Tecla metodo={props.metodo[0]}  arg={props.arg[0]} digito={props.digito[0]} estilo={props.estiloTecla}/>
                <Tecla metodo={props.metodo[1]}  arg={props.arg[1]} digito={props.digito[1]} estilo={props.estiloTecla}/>
                <Tecla metodo={props.metodo[2]}  arg={props.arg[2]} digito={props.digito[2]} estilo={props.estiloTecla}/>
            
            </View>)

    }else{
        return(
            <View style={props.estiloFila}>
                
                <Tecla metodo={props.metodo[0]}  arg={props.arg[0]} digito={props.digito[0]} estilo={props.estiloTecla}/>
               
            </View>
        )
    }
}
export default FiladeTeclado;