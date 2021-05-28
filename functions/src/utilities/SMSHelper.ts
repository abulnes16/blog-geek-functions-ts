/* SMS Helper */
import { Twilio } from 'twilio';

const functions = require('firebase-functions')

function SMSHelper(mensaje: string, numeroCelular: string) {
  const SID: string = functions.config().configuration.accountsidtwilio
  const authToken: string = functions.config().configuration.authtokentwilio

  const twilioCliente = new Twilio(SID, authToken)

  return twilioCliente.messages.create({
    to: numeroCelular,
    from: '+18707824011',
    body: mensaje,
  })
}

export {
  SMSHelper,
}