import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,DeviceEventEmitter } from 'react-native';
import PriceInstagram from './service';
import { io } from "socket.io-client";
import schedulePushNotification from './Notification2';
const socket = io("https://firstprojectdolar.herokuapp.com/");
import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Tecla from './buttons';
import FiladeTeclado from './filaTeclado';


/**----------------------------------------------------------------------------- -----------------------------------------------------*/
socket.on('tasa',async (arg)=>{     //escucho mensajes desde el servidor con el evento tasa
  console.log(arg)
  console.log(arg.tasa)
  schedulePushNotification(arg.tasa);
  DeviceEventEmitter.emit('eventoTasa',arg);
  /*setPrice(arg.tasa)
  setResultado(arg.tasa)
  setFecha(arg.fecha)
  setHora(arg.hora)
  await AsyncStorage.setItem('tasa',`${arg.tasa}`)
  await AsyncStorage.setItem('fecha',`${arg.fecha}`)
  await AsyncStorage.setItem('hora',`${arg.hora}`)*/
})


socket.on('ultimaTasa',async(arg)=>{     //escucho mensajes desde el servidor con el evento ultimaTasa
  console.log(arg)
  console.log(arg.tasa)
  schedulePushNotification(arg.tasa);
  DeviceEventEmitter.emit('eventoTasa',arg);
  /*setPrice(arg.tasa)
  setResultado(arg.tasa)
  setFecha(arg.fecha)
  setHora(arg.hora)
  
  await AsyncStorage.setItem('tasa',`${arg.tasa}`)
  await AsyncStorage.setItem('fecha',`${arg.fecha}`)
  await AsyncStorage.setItem('hora',`${arg.hora}`)*/
})

socket.on('hello',(arg)=>{     //escucho mensajes desde el servidor con el evento hello
  console.log(arg)
  
})



/**----------------------------------------------------------------------------- -----------------------------------------------------*/
export default function App() {
  
  
  const [variable,setVariable]=React.useState('1');
  const [almacenar,setAlmacenar]=React.useState('');
  const [resultado,setResultado]=React.useState(0)
  const [isFirst,setIsfirst]=React.useState(true)
  const [isComa,setIsComa]=React.useState(false)
  const [Price,setPrice]=React.useState(0);
  const [fecha,setFecha]=React.useState('');
  const [hora,setHora]=React.useState('')

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('USD');
  const [items, setItems] = React.useState([
    {label: 'USD', value: 'USD'},
    {label: 'Bs', value: 'Bs'}
  ]);
/**----------------------------------------------------------------------------- */
  React.useEffect(()=>{
    
    DeviceEventEmitter.addListener('eventoTasa',async(tasa)=>{
      setPrice(tasa.tasa)
      setResultado(tasa.tasa)
      setFecha(tasa.fecha)
      setHora(tasa.hora)
      await AsyncStorage.setItem('tasa',`${tasa.tasa}`)
      await AsyncStorage.setItem('fecha',`${tasa.fecha}`)
      await AsyncStorage.setItem('hora',`${tasa.hora}`)
      console.log('eventoTasa',tasa)
    });

    const solicitar =async()=>{
      const tasa=await AsyncStorage.getItem('tasa')
      const ultimaHora=await AsyncStorage.getItem('hora')
      const ultimaFecha=await AsyncStorage.getItem('fecha')

      if (tasa==null){
        socket.emit('solicitarTasa','tasa del dia')
        
      }else{
        setResultado(tasa)
        setPrice(tasa)
        setFecha(ultimaFecha)
        setHora(ultimaHora)
      }
      
    }
    solicitar()
    
  },[])
 
  
/*-------------------------------------------------------------------------------------------------------------------------------
  socket.on("connect", () => { //emito un evento al conectarme y muestro por consola del cliente mi id
    //console.log(socket.id); // x8WIv7-mJelg7on_ALbx
  });
  */
  //socket.emit('saludo','what sapp');//emito mensajes hacia el servidor con el evento saludos
  

  

  
  
/**------------------------------------------------------------------------------------------------------------------------------- */

  
  const parametro=(n)=>{

    if( isFirst){
      setIsfirst(false)

        if (n==='.'){

          if(!isComa){
            setIsComa(true)
            setAlmacenar(n)
            setVariable(n)
          }else{
            //no se hace nada
          }

        }else if(n==='c'){
          
          //no se hace nada

        }else{
            setAlmacenar(n)
            setVariable(n)
            const res=Number((n*Price).toFixed(4))
            setResultado(res)
            

        }


    }else{
        if (n==='.'){

            if(!isComa){
              const mostrar=almacenar+n
              setAlmacenar(mostrar)
              setVariable(mostrar)
              setIsComa(true)
              const number=parseFloat(mostrar)
              const res=Number((number*Price).toFixed(4))
              setResultado(res)
            }else{
              //no se hace nada
            }

        }else if(n==='c'){
          
            if(almacenar.length===1 || almacenar.length===0 ){
              const mostrar='1'
              setAlmacenar('')
              setVariable(mostrar)
              setIsComa(false)
              const number=parseFloat(mostrar)
              const res=Number((number*Price).toFixed(4))
              setResultado(res)

            }else{
              if(almacenar[almacenar.length-1]==='.'){
                setIsComa(false)
              }
              const mostrar=almacenar.substring(0,almacenar.length-1)
              setAlmacenar(mostrar)
              setVariable(mostrar)
              const number=parseFloat(mostrar)
              const res=Number((number*Price).toFixed(4))
              setResultado(res)
            }
          

        }else{
            const mostrar=almacenar+n
            setAlmacenar(mostrar)
            setVariable(mostrar)
            
            const number=parseFloat(mostrar)
            const res=Number((number*Price).toFixed(4))
            setResultado(res)
          

        }

    }



    
  }
/**---------------------------------------------------------------------------------------------------------------------------------- */
  const clear=()=>{
    setIsfirst(true);
    setVariable(1);
    setResultado(Price)
    setIsComa(false)
    
  }
/**---------------------------------------------------------------------------------------------------------------------------------- */
  const price= async()=>{
    console.log('aqui price')
    socket.emit('solicitarTasa','tasa del dia')
    const tasa=await AsyncStorage.getItem('tasa')
    const ultimaHora=await AsyncStorage.getItem('hora')
    const ultimaFecha=await AsyncStorage.getItem('fecha')
    setPrice(tasa)
    setResultado(tasa)
    setFecha(ultimaFecha)
    setHora(ultimaHora)
  }

 /**---------------------------------------------------------------------------------------------------------------------------------- */

 // estas funciones son para cambiar los textos y los simbolos cuando se cambia el tipo de moneda
  const text=()=>{

    if (value==='USD'){
      return 'Dolares Estadounidenses'
    }else{
      return 'Bolivares Venezolanos'
    }
  }


  const text2=()=>{

    if (value==='USD'){
      return 'Bolivares Venezolanos'
    }else{
      return 'Dolares Estadounidenses'
    }
  }

  const denominacion=()=>{
    if (value==='USD'){
      return 'Bs'
    }else{
      return 'USD'
    }
  }

  const simbolo=()=>{
    if (value==='USD'){
      return 'Bs'
    }else{
      return '$'
    }
  }

  const simbolo2=()=>{
    if (value==='USD'){
      return '$'
    }else{
      return 'Bs'
    }
  }


 /**---------------------------------------------------------------------------------------------------------------------------------- */
  //dropdown o menu desplegable
 const drop=()=>{
    return(<DropDownPicker
      open={open}
      value={value}
      items={items}
      style={{borderWidth:0}}
      textStyle={{fontSize: 22}}
      placeholder="Select a "

      onChangeValue={async (value) => {
        if(value==='USD'){
            const tasa=await AsyncStorage.getItem('tasa')
            setAlmacenar('')
            setResultado(tasa)
            setPrice(tasa)
            setVariable('1')
        }else{

          const number=Number((1/Price).toFixed(4))
          setAlmacenar('')
          setResultado(number)
          setPrice(number)
          setVariable('1')
        }
        
      }}

      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
  />)
  }

 /**-------------------------------------------------------------------------------------*/




  return (
    <View style={styles.container}>
     
     <StatusBar style="auto" />
      <View style={styles.header}>
          <View style={{alignItems:'center', position:'absolute', bottom:0}}>
            <Text style={{ fontSize:25,color:'#ffffff'}}> 1{simbolo2()} = {Price} {simbolo()}</Text>
            <Text style={{ fontSize:10,color:'#ffffff'}}> Tasa promedio de enparaleloVzla del {fecha} {hora}</Text>
          </View>
      </View>

      <View style={styles.pantalla}>

        <View style={styles.fila}>

          <View style={{width:'25%',  display:'flex',justifyContent:'center',alignItems:'center'}}>
          {drop()}
          </View>
          <View style={{width:'75%', display:'flex',justifyContent:'center',alignItems:'flex-end',paddingRight:15}}>
            <Text style={{fontSize:30, color:'#4cd137'}}>{variable}</Text>
            <Text style={{fontSize:10}}>{text()}</Text>
          </View>
          
        </View>
        <View style={styles.fila}>

          <View style={{width:'20%',  display:'flex',justifyContent:'center', flexDirection:'column-reverse',paddingLeft:10}}>
           <Text style={{fontSize:25}}>{denominacion()}</Text>
          </View>

          <View style={{width:'80%', display:'flex',justifyContent:'center',alignItems:'flex-end',paddingRight:15}}>
            <Text style={{fontSize:30}}>{resultado}</Text>
            <Text style={{fontSize:10}}>{text2()}</Text>
          </View>
          
        </View>
      </View>

      <View style={styles.teclado}>
        
        <View style={{width:'75%',height:'100%'}} >
          
              <View style={styles.fila}>
               
               <Tecla metodo={parametro}  arg={'1'} digito={1} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'2'} digito={2} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'3'} digito={3} estilo={styles.boton}/>
               
             
             </View>
   
             <View style={styles.fila}>
             
               <Tecla metodo={parametro}  arg={'4'} digito={4} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'5'} digito={5} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'6'} digito={6} estilo={styles.boton}/>
   
             
   
             </View>
   
             <View style={styles.fila}>
               
               <Tecla metodo={parametro}  arg={'7'} digito={7} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'8'} digito={8} estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'9'} digito={9} estilo={styles.boton}/>
   
   
             </View>
   
             <View style={styles.fila}>
               
               
               <Tecla metodo={price}      digito={'act'}      estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'0'} digito={0}   estilo={styles.boton}/>
               <Tecla metodo={parametro}  arg={'.'} digito={'.'} estilo={styles.boton}/>
   
               
               
             </View>
        </View>
        <View style={{width:'25%',height:'100%'}}>

          
          <View style={styles.botonClear}>  
            <Tecla metodo={clear}      digito={'ac'}   estilo={styles.btnClear}/>
          </View>

           <View style={styles.botonClear}> 
            <Tecla metodo={parametro}  arg={'c'} digito={'c'} estilo={styles.btnClear}/>
          </View>
        
        </View>

      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    display:'flex',
    backgroundColor: '#293939',
    position:'relative',
    height:'100%',
    flexDirection:'column'
    
    
  },
  header:{
    display:'flex',
    width:'100%',
    backgroundColor:'#01579b',
    height:'10%',
    justifyContent:'center',
    alignItems:'center',
    position:'relative'
  },
  pantalla:{
    display:'flex',
    width:'100%',
    height:'40%',
    backgroundColor:'#FFFFFF',
    justifyContent:'center',
    alignItems:'center'

  },

  teclado:{
    display:'flex',
    width:'100%',
    height:'50%',
    backgroundColor:'#01579b',
    flexDirection:'row'
    
    
    
    
  },
  fila:{
    flexDirection:'row',
    width:'100%',
    height:'25%'
    
  },
  boton:{
    display:'flex',
   
    width:'33.33%',
    fontSize:25,
    justifyContent:'center',
    alignItems:'center'
    
  },
  btnClear:{
    backgroundColor:'#002f6c',
    height:'80%',
    width:'70%',
    borderRadius:40,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
    
  },
  botonClear:{
    width:'100%',
    height:'50%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  }

  
});

/**
 * 
 * 
 * 
 * <FiladeTeclado colQuantity={3} metodo={[parametro,parametro,parametro]} arg={['1','2','3']} digito={[1,2,3]} estiloTecla={styles.boton} estiloFila={styles.fila}/>

  <FiladeTeclado colQuantity={3} metodo={[parametro,parametro,parametro]} arg={['4','5','6']} digito={[4,5,6]} estiloTecla={styles.boton} estiloFila={styles.fila}/>
  
  <FiladeTeclado colQuantity={3} metodo={[parametro,parametro,parametro]} arg={['7','8','9']} digito={[7,8,9]} estiloTecla={styles.boton} estiloFila={styles.fila}/>

  <FiladeTeclado colQuantity={3} metodo={[price,parametro,parametro]} arg={[,'0','.']} digito={['change',0,'.']} estiloTecla={styles.boton} estiloFila={styles.fila}/>


 * 
 * 
 *        
          View style={styles.botonClear}>  
            <Tecla metodo={parametro}  arg={'c'}    digito={'ac'}   estilo={styles.btnClear}/>
          </View>

           <View style={styles.botonClear}> 
            <Tecla metodo={clear}   digito={'clear'} estilo={styles.btnClear}/>
          </View>

            <TouchableOpacity 
              style={styles.boton}
              onPress={()=>price()}>
                <Text style={{textAlign:'center',fontSize:25,color:'#ffffff'}} >change</Text>
            </TouchableOpacity>





<View style={styles.teclado}>
        <View style={styles.fila}>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('c')}>
              <Text style={{textAlign:'center',fontSize:25}} >c</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>clear()}>
              <Text style={{textAlign:'center',fontSize:25}} >clear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('%')}>
              <Text style={{textAlign:'center',fontSize:25}} >%</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('/')}>
              <Text style={{textAlign:'center',fontSize:25}} >/</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.fila}>
          
          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('1')}>
              <Text style={{textAlign:'center',fontSize:25}} >1</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('2')}>
              <Text style={{textAlign:'center',fontSize:25}} >2</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('3')}>
              <Text style={{textAlign:'center',fontSize:25}} >3</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('x')}>
              <Text style={{textAlign:'center',fontSize:25}} >x</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.fila}>
          
          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('4')}>
              <Text style={{textAlign:'center',fontSize:25}} >4</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('5')}>
              <Text style={{textAlign:'center',fontSize:25}} >5</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('6')}>
              <Text style={{textAlign:'center',fontSize:25}} >6</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('-')}>
              <Text style={{textAlign:'center',fontSize:25}} >-</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.fila}>
          
          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('7')}>
              <Text style={{textAlign:'center',fontSize:25}} >7</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('8')}>
              <Text style={{textAlign:'center',fontSize:25}} >8</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('9')}>
              <Text style={{textAlign:'center',fontSize:25}} >9</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('+')}>
              <Text style={{textAlign:'center',fontSize:25}} >+</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.fila}>
          
          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>price()}>
              <Text style={{textAlign:'center',fontSize:25}} >change</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro(0)}>
              <Text style={{textAlign:'center',fontSize:25}} >0</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('.')}>
              <Text style={{textAlign:'center',fontSize:25}} >.</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.boton}
            onPress={()=>parametro('=')}>
              <Text style={{textAlign:'center',fontSize:25}} >=</Text>
          </TouchableOpacity>
          
        </View>
      </View>





 */
