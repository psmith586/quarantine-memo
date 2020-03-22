const { db } = require('../utils/admin');

//return memos list
exports.getAllMemos = (req, res) => {
  db
    .collection('memos')
    .orderBy('createAt', 'desc')
    .get()
    .then((data) => {
      let memos = [];
      data.forEach(doc =>{
        memos.push({
          memoID: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createAt: doc.data().createAt
        });
      });
      return res.json(memos);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//post a memo
exports.postOneMemo = (req, res) => {
  if(req.body.body.trim() === '') {
    return res.status(400).json({ body: 'memo must not be empty' });
  }

  const newMemo = {
    body: req.body.body,
    userHandle: req.user.handle,
    createAt: new Date().toISOString()
  };

  db
    .collection('memos')
    .add(newMemo)
    .then(doc => {
      res.json({ message:`document ${doc.id} created` });
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};
