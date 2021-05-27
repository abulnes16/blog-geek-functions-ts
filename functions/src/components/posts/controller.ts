/* Post controller module */

import { Change, EventContext } from "firebase-functions";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import Notificaciones from "../notificatons/notification";
import Posts from './post';
import { Post } from "./types";

/**
 * Trigger que envia una notificación al momento 
 * de actualizar un post.
 * @param dataSnapshot Post que ha cambiado
 * @param context Contexto de Firebase Functions
 */
function updatePost(dataSnapshot: Change<DocumentSnapshot>, context: EventContext) {

  const notifications = new Notificaciones();
  const { publicado: prevPublish } = dataSnapshot.before.data()!;
  const { publicado: postPublish, titulo, descripcion } = dataSnapshot.after.data()!;

  if (prevPublish === false && postPublish === true) {
    return notifications.enviarNotificacion(titulo, descripcion, '', null);
  }

  return;
}
/**
 * Trigger que guarda una auditoria del cambio en un post
 * @param dataSnapshot Documento a cambiar
 * @param context Contexto de Firebase
 */
function auditPost(dataSnapshot: Change<DocumentSnapshot>, context: EventContext) {
  const posts = new Posts();
  const id = dataSnapshot.before.id;
  const oldPost = dataSnapshot.before.data() as Post;
  const newPost = dataSnapshot.after.data() as Post;
  return posts.registrarAuditoria(id, newPost, oldPost);
}

/**
 * Trigger que valida una imagen de los posts
 * @param image Imagen a validar
 */
function validateImage(image: ObjectMetadata) {
  if (!image.name?.match(/imgsPosts/)) {
    return null;
  }

  if (!image.contentType?.startsWith('image/')) {
    console.error('El archivo no es una imagen');
    return null;
  }

  const posts = new Posts();
  return posts.validarImagenPost(image)
        .catch((error: Error) => console.error(`Error al validar imagen =>${error}`));
}

export default {
  updatePost,
  auditPost,
  validateImage,
}