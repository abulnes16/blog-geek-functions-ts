/* Notifications controller module */

import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import Notificaciones from "./notification";

/**
 * Trigger que registra un token a un topico
 * en FCM 
 * @param dataSnapshot Instantanea del documento
 */
function createToken(dataSnapshot: DocumentSnapshot) {
  const notifications = new Notificaciones();
  return notifications.registrarTokenAlTopico(dataSnapshot.data()!.token);
}



export default {
  createToken,
}