const { admin, db } = require('./admin');

//authentication middleware, verfiy token from firebase
module.exports = (req, res, next) => {
  let idToken;
  if(
    req.headers.authorizaton &&
    req.headers.authorizaton.startsWith('Bearer ')
  ){
    idToken = req.headers.authorizaton.split('Bearer ')[1];
  }else {
    console.error('no token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      return db
        .collection('users')
        .where('userID', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error('cannot verify token');
      return res.status(403).json(err);
    });
}
