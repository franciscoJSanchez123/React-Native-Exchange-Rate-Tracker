import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

/**--------------------------------------------------------------------------------------------------------------------- */
//este es el manejador de notificaciones aqui establecemos si la notificacion debe ser mostrada o no
//si debe emitir sonido de notificacion cuando llege o no etc..., pero me parece que es solo para cuando la app esta activa
//es decir mientras estamos dentro de la app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**--------------------------------------------------------------------------------------------------------------------- */
export default  function Notification(){
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  /**--------------------------------------------------------------------------------------------------------------------- */

    //aqui en el hook al iniciar la aplicacion llamamos a registerForPushNotificationsAsync() y nos quedamos esperando el token
    //tambien con addNotificationReceivedListener nos quedamos atentos para recibir notificaciones solo si la apicacion esta corriendo
    // y con addNotificationResponseReceivedListener nos quedamos atentos para recibir la respuesta a nuestar notificacion
    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);

  /**--------------------------------------------------------------------------------------------------------------------- */
      //esto es lo que se mostrara en la pantalla de nuestra aplicacion 
      // aqui esta el boton que ejecuta la funcion schedulePushNotification() que es la que eniva las notificaciones
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <Text>Your expo push token: {expoPushToken}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>Title: {notification && notification.request.content.title} </Text>
            <Text>Body: {notification && notification.request.content.body}</Text>
            <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
          </View>
          <Button
            title="Press to schedule a notification"
            onPress={async () => {
              await schedulePushNotification();
            }}
          />
        </View>
      );

      

}
/**--------------------------------------------------------------------------------------------------------------------- */
// este es el disparador de notificaciones, aqui enviamos la notificacion, aqui describimos la notificacion que queremos enviar 
// y establecemos el momento para enviarla, tambien podemos hacer que se repita cada cierto tiempo  
async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }


/**--------------------------------------------------------------------------------------------------------------------- */
    //aqui en esta funcion se chequea si es un dispositivo o un simulador, si es un simulador entonces no se pueden mostrar
    //notificaciones pero si es un dispositivo se chekea si hay permisos para mostrar notificaciones, si si hay permiso
    //entonces se solicita el token que permite enviar notificaciones a este dispositivo y luego si el dispositivo es android 
    //se configura el canal de notificaciones
  async function registerForPushNotificationsAsync() {
    let token;
    //aqui se pregunta si es un dispositivo ya que si es un simulador entonces expo no puede
    //mostrar notificaciones
    if (Constants.isDevice) {

      //aqui  getPermissionsAsync() retorna si estan autorizadas o no las notificaciones
      //retorna si la aplicacion actualmente esta autorizada a mostrar notificaciones
      //No hay ningún efecto de cara al usuario al llamar a esto.
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {

        //aqui  requestPermissionsAsync() Solicita al usuario permisos de notificación de acuerdo con la solicitud
        //Los valores predeterminados de la solicitud son pedirle al usuario que permita mostrar alertas, 
        //configurar el recuento de insignias y reproducir sonidos.
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      //si no hay permisos otorgados entonces se muestra el siguiente mensaje
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      //si si hay permisos otorgados entonces se solicita el token, en este ejemplo no lo utilizamos pero este sirve para 
      //enviar notificaciones a este dispositivo
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }
  /**--------------------------------------------------------------------------------------------------------------------- */