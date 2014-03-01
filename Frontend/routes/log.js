/*
 * GET loglist page.
 */

exports.logs = function(db) {
  return function(req, res) {
    db.collection('logs').find().toArray(function (err, items) {
      res.json(items);
    })
  }
};


/*
 * DELETE to deletelog.
 */

exports.deletelog = function(db) {
  return function(req, res) {
    var logToDelete = req.params.id;
    console.log(logToDelete);
    db.collection('logs').removeById(logToDelete, function(err, result) {
      res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
  }
};