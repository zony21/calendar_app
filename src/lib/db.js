import admin from 'firebase-admin'
 
let adminApp
 
if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })
}
 
export const db = admin.firestore(adminApp)