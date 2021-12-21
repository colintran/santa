const express = require('express');
const app = express();
const router = express.Router();
const random = require('random');
uuid = random.int((min = 0), (max = 1000));
console.log(uuid);
const path = require('path');
app.set('view engine','ejs');
router.get('/',(req,res,next) => {
    res.render(path.join(__dirname,'/reply'),{id: uuid});
})
app.use('/',router);
app.listen(3000);