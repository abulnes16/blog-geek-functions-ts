/* User controller */
import { UsuarioAdmin } from './admin';
import { auth } from 'firebase-functions';

/**
 * Trigger que al momento de ingresar un usuario 
 * se le envia un correo de bienvenida.
 * @param user Usuario a autenticar
 */
async function userCreate(user: auth.UserRecord) {
  const { displayName, email } = user;

  const userAdmin = new UsuarioAdmin()

  return userAdmin.enviarEmailBienvenida(displayName!, email!)
    .then(() => {
      return userAdmin.registrarEmailsUsuario(displayName!, email!);
    })
    .catch((error: Error) => console.error(`Error al crear un usuario => ${error}`));
}

/**
 * Trigger que al momento de eliminar un usuario
 * se le envia un correo de despedida.
 * @param user Usuario autenticado
 */
async function userDelete(user: auth.UserRecord) {
  const { displayName, email } = user;

  const userAdmin = new UsuarioAdmin()

  return userAdmin.enviarEmailDespedida(displayName!, email!)
    .catch((error: Error) => console.error(`Error al crear un usuario => ${error}`));
}


/**
 * Trigger que registra un usuario en el CRM al 
 * momento de crear una cuenta en el blog. 
 * @param user 
 * @returns 
 */
function createUserInCRM(user: auth.UserRecord) {
  const { displayName, email } = user;
  const [firstName, lastName] = displayName!.split(' ');
  const userAdmin = new UsuarioAdmin();

  return userAdmin.sincronizarCRM(firstName, lastName, email!);
}




export default {
  userCreate,
  userDelete,
  createUserInCRM,
}