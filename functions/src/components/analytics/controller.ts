/* Analytics Controller */

import { AnalyticsEvent } from "firebase-functions/lib/providers/analytics";
import * as functions from 'firebase-functions';
import { SMSHelper } from "../../utilities/SMSHelper";

function sendShareCoupon(event: AnalyticsEvent) {
  const socialNetwork = event.params.method;
  console.log(socialNetwork);
  const phoneNumber = functions.config().configuration.numcelularerror;

  return SMSHelper(
    `Gracias por compartir en ${socialNetwork}, te has ganado un premio`,
    phoneNumber
  )
    .catch((error: Error) => console.error(`${error}`));
}


export default {
  sendShareCoupon,
}