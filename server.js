var watson = require('watson-developer-cloud');

var conversation = watson.conversation({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  version: 'v1',
  version_date: '2016-09-20'
});

// Replace with the context obtained from the initial request
var context = {};

conversation.message({
  workspace_id: 'e36eca52-0b97-4673-b1e8-8468d4b6373a',
  input: {'text': 'Hi'},
  context: context
},  function(err, response) {
  if (err)
    console.log('error:', err);
  else
    console.log(JSON.stringify(response, null, 2));
});