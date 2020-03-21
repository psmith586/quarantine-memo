const admin = require('firebase-admin');

var serviceAccount = require('../roomatematch-7fa9f-firebase-adminsdk-vtjgw-2338ccf4a3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://roomatematch-7fa9f.firebaseio.com"
})

const db = admin.firestore();

module.exports = { admin, db };
