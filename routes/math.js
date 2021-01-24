var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('../html/helloworld.html');
});

router.get("/multiply", (req, res) => {
    console.log(req.query);
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(`<h1>${req.query.num_1 * req.query.num_2}</h1>`));
    
})

module.exports = router;
  