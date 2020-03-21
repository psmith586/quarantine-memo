const { db } = require('../utils/admin');
const config = require('../utils/config');
const firebase = require('firebase');

firebase.initializeApp(config);

const {
  validateSignUp,
  validateLogin
} = require('../utils/validators');

//register users
exports.signup = (req, res) => {

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const { valid, errors } = validateSignUp(newUser);

  if(!valid){
    return res
      .status(400)
      .json(errors);
  }

  let token, userID;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if(doc.exists) {
        return res.status(400).json({ handle: 'username is taken' });
      }else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userID = data.user.uid;
      return data.user.getIdToken();

    })
    .then(idtoken => {
      token = idtoken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createAt: new Date().toISOString(),
        userID
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if(err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'email already in use' });
      }else {
        return res
          .status(201)
          .json({ general: 'Oops something went wrong' });
      }
    });
};

//login users
exports.login = (req, res) => {

  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const{ valid, errors } = validateLogin(user);

  if(!valid){
    return res
      .status(400)
      .json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      return res
        .status(403)
        .json({ general: 'invalid credentials' });
    });
};
