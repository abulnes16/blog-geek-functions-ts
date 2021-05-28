/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-empty-function */
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore"

import { firestore, storage } from 'firebase-admin';

import Notificaciones from '../notificatons/notification';
import { imageAnalysis, Post } from "./types";
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { join, basename } from 'path';
import { tmpdir } from 'os';
import { plantillaVideosLaSemana } from "../../utilities/EmailTemplates";
import Email from "../../utilities/EmailHelper";

class Posts {
  registrarAuditoria(idPost: string, nuevoPost: Post, viejoPost: Post) {
    return firestore().collection('postAuditory').doc(idPost).set({
      newPost: nuevoPost,
      oldPost: viejoPost,
    }).then(() => console.log('Auditoria exitosa'));
  }

  validarImagenPost(archivo: ObjectMetadata): Promise<any> {
    const route = archivo.name!;
    const filename = basename(route);
    const idPost = basename(route).split('.')[0];

    const bucket = storage().bucket();
    const tmpRouteFile = join(tmpdir(), filename);

    const visionClient = new ImageAnnotatorClient();

    return bucket.file(route).download({ destination: tmpRouteFile })
      .then(() => {
        return visionClient.safeSearchDetection(tmpRouteFile);
      }).then((result) => {
        const adult = result[0].safeSearchAnnotation?.adult;
        const violence = result[0].safeSearchAnnotation?.violence;
        const medical = result[0].safeSearchAnnotation?.medical;

        return this.esAdecuada(adult) && this.esAdecuada(violence) && this.esAdecuada(medical);
      })
      .then((response) => {
        if (response) {
          this.actualizarEstadoPost(idPost, true);
          return;
        }
        return this.enviarNotRespImagenInapropiada(idPost);
      });

  }

  esAdecuada(resultado: imageAnalysis) {
    return (
      resultado !== 'POSSIBLE' &&
      resultado !== 'LIKELY' &&
      resultado !== 'VERY_LIKELY'
    )
  }

  actualizarEstadoPost(idPost: string, estado: boolean) {
    const refAuditoria = firestore()
      .collection('posts')
      .doc(idPost)

    return refAuditoria.update({
      publicado: estado,
    })
  }

  enviarNotRespImagenInapropiada(idPost: string) {
    console.log(`Consultar Token idPost => ${idPost}`)

    return firestore()
      .collection('posts')
      .doc(idPost)
      .get()
      .then(async (post: DocumentSnapshot) => {
        const { token } = post.data()!;
        if (token !== null && token !== undefined) {
          console.log(`idPost token => ${token}`)
          const notificaciones = new Notificaciones()
          await notificaciones.enviarNotificacionAToken(
            'Posts con imagen no permitida',
            'Tu post no se puede mostrar ya que la imagen no es permitida',
            'notvalidacionimagen',
            token
          )
        }

        return post
      });
  }

  enviarPostSemana(topicoNotificacion: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 5);
    let userEmails = "";
    return firestore()
      .collection('emailsusuarios')
      .get().then((emails) => {
        emails.forEach((email) => {
          userEmails += `${email.data().email}`
        });
        return userEmails;
      }).then(() => {
        return firestore().collection('posts')
          .where('date', '>=', startDate)
          .where('date', '<=', endDate)
          .where('publish', '==', true)
          .get();
      }).then((posts) => {
        if (!posts.empty) {
          const textHTML = plantillaVideosLaSemana(posts);
          const objEmail = new Email();
          return objEmail.sendEmail(
            'info@blogeek.co',
            userEmails, '',
            'Video Blogeek- Los videos blogeek de la seman',
            textHTML
          );
        }
        return null;
      });
  };
}

export default Posts;