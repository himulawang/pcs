global.db = require('redis').createClient();

db.hmset('test', [1,0], function(err, data) {
    console.log(err);
    console.log(data);
});
