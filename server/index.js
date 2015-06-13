#!/usr/bin/env node

var server = require('./server')({
  maxBroadcasts: 100
})

server.listen(9000, function() {
  console.log('signalhub server on port %d', server.address().port)
});