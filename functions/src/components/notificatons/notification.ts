import { messaging } from 'firebase-admin';

class Notificaciones {
  registrarTokenAlTopico(token: string) {
    const registrationTokens = [token]

    return messaging()
      .subscribeToTopic(registrationTokens, 'NuevosPosts')
      .then(() => {
        return console.log(`Se adiciona correctamente al topico el token`)
      })
      .catch((error: Error) => {
        console.error(`Error registrando al topico el token => ${error}`)
      })
  }

  enviarNotificacion(titulo: string, descripcion: string, tipo: string, topico: string | null = '') {
    const topicoEnviar: string = topico === null ? 'NuevosPosts' : topico

    const mensaje = {
      data: {
        titulo: titulo,
        descripcion: descripcion,
        tipo: tipo,
      },
      topic: topicoEnviar,
    }

    return messaging()
      .send(mensaje)
      .then(() => {
        return console.log(
          `Mensaje enviado correctamente al topico NuevosPosts`
        )
      })
      .catch((error: Error) => {
        console.error(
          `Error enviando mensaje al topico NuevosPosts => ${error}`
        )
      })
  }

  enviarNotificacionAToken(titulo: string, descripcion: string, tipo: string, token: string) {
    console.log("token")
    console.log(token)
    const mensaje = {
      data: {
        titulo: titulo,
        descripcion: descripcion,
        tipo: tipo,
      },
      token: token,
    }

    return messaging()
      .send(mensaje)
      .then(() => {
        return console.log(`Mensaje enviado correctamente al token`)
      })
      .catch((error: Error) => {
        console.error(`Error enviando mensaje al token => ${error}`)
      })
  }
}

export default Notificaciones;