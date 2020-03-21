const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./utils/fbAuth');
const cors = require('cors');
app.use(cors());

const { db } = require('./utils/admin');

const{
  getAllMemos,
  postOneMemo
} = require('./handlers/memos');

const{
  signup,
  login
} = require('./handlers/users');

//memo routes
app.get('/memos', getAllMemos);
app.post('/memos', FBAuth, postOneMemo);

//user routes
app.post('/signup', signup);
app.post('login', login);


exports.api = functions.https.onRequest(app);
