jj-sms
======

Testing Node, Express.js and Mongo...


curl -H "Content-type: application/json" -X POST -d '{"name":"John Doe", "phone_number":"555-555-5555"}' http://localhost:3000/user

curl -H "Content-type: application/json" -X POST -d '{"name":"Jane Doe", "phone_number":"111-111-1111"}' http://localhost:3000/user


curl -H "Content-type: application/json" -X POST -d '{"creatorId" : "{user id}", "recipientId" : "{user id}", "to":"555-555-5555", "from":"111-111-1111", "message " : "this is a test"}' http://localhost:3000/conversation