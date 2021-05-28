import * as functions from 'firebase-functions';
import userController from './components/users/controller';
import tokenController from './components/notificatons/controller';
import postController from './components/posts/controller';
import { initializeApp } from 'firebase-admin';
import API from './api';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

initializeApp();

// Auth functions
export const createUser = functions.auth.user().onCreate(userController.userCreate);
export const createUserInCRM = functions.auth.user().onCreate(userController.createUserInCRM);
export const deleteUser = functions.auth.user().onDelete(userController.userDelete);

// Firestore functions
export const registerTopic = functions.firestore
  .document('/tokens/{id}')
  .onCreate(tokenController.createToken);

export const sendNotification = functions.firestore
  .document('/posts/{idPost}')
  .onUpdate(postController.updatePost);

export const auditoryPosts = functions.firestore
  .document('/posts/{idPost}')
  .onUpdate(postController.auditPost);

// Storage functions
export const validateImage = functions.storage
  .object()
  .onFinalize(postController.validateImage);

// HTTPS functions
export const sendDailyPosts = functions.https.onRequest(API);