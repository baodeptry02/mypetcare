const admin = require('firebase-admin');
const serviceAccount = require('../controllers/veterinaryclinic-422805-d3b76a631e25.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://veterinaryclinic-422805-default-rtdb.firebaseio.com"
});

module.exports = admin;
