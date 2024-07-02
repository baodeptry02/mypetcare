const admin = require('firebase-admin');
const serviceAccount = require('../controllers/veterinaryclinic-422805-firebase-adminsdk-h1sdm-0e29bae65d.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veterinaryclinic-422805-default-rtdb.firebaseio.com"
});

module.exports = admin;
