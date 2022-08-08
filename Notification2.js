import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

/**--------------------------------------------------------------------------------------------------------------------- */
//este es el manejador de notificaciones aqui establecemos si la notificacion debe ser mostrada o no
//si debe emitir sonido de notificacion cuando llege o no etc..., pero me parece que es solo para cuando la app esta activa
//es decir mientras estamos dentro de la app



// este es el disparador de notificaciones, aqui enviamos la notificacion, aqui describimos la notificacion que queremos enviar 
// y establecemos el momento para enviarla, tambien podemos hacer que se repita cada cierto tiempo  
export default async function schedulePushNotification(arg) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got notification! 📬",
        body: `Esta es la tasa del dolar ${arg}`,
        data: { data: `` },
      },
      trigger: { seconds: 2 },
    });
  }



  /**--------------------------------------------------------------------------------------------------------------------- */