import { post } from 'request';
import request = require('request');
import * as functions from 'firebase-functions';

const claveapihubspot = functions.config().configuration.claveapihubspot

class HubSpotHelper {
  crearUsuario(nombres: string, apellidos: string, email: string) {
    return post(
      {
        headers: {
          'content-type': 'application/json',
        },
        url: `https://api.hubapi.com/contacts/v1/contact/?hapikey=${claveapihubspot}`,
        body: JSON.stringify({
          properties: [
            {
              property: 'email',
              value: email,
            },
            {
              property: 'firstname',
              value: nombres,
            },
            {
              property: 'lastname',
              value: apellidos,
            },
          ],
        }),
      },
      (error: Error, response: request.Response, body: string) => {
        if (error) {
          return console.error(error)
        }
        return console.log(JSON.parse(body))
      }
    )
  }
}

export default HubSpotHelper;