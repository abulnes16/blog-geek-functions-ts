import Email from '../../utilities/EmailHelper';
import HubSpotHelper from '../../utilities/HubSpotHelper';
import { plantillaEmailBienvenida, plantillaEmailDespedida } from '../../utilities/EmailTemplates';
import * as admin from 'firebase-admin';


export class UsuarioAdmin {
  registrarEmailsUsuario(nombres: string, email: string) {
    console.log('se registra email')
    return admin
      .firestore()
      .collection('emailsusuarios')
      .add({
        nombres: nombres,
        email: email,
      })
  }

  enviarEmailBienvenida(nombres: string, email: string) {
    const to = email
    const from = 'info@blogeek.com'

    const textHtml = plantillaEmailBienvenida(nombres)

    const objEmail = new Email()

    return objEmail.sendEmail(
      from,
      to,
      '',
      'Video Blogeek - Bienvenido a la Comunidad de Videos Geek',
      textHtml
    )
  }

  enviarEmailDespedida(nombres: string, email: string) {
    const to = email
    const from = 'info@blogeek.com'

    const textHtml = plantillaEmailDespedida(nombres)

    const objEmail = new Email()

    return objEmail.sendEmail(
      from,
      to,
      '',
      'Video Blogeek - Espera!! no te vayas de la Comunidad de Videos Geek',
      textHtml
    )
  }

  sincronizarCRM(nombres: string, apellidos: string, email: string) {
    const hubSpot = new HubSpotHelper()
    return hubSpot.crearUsuario(nombres, apellidos, email)
  }
}

