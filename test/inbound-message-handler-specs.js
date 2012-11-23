var mongoose = require("mongoose"),
    conversation = require("../models/conversation"),
    user = require("../models/user"),
    should = require("should")

mongoose.connect('mongodb://localhost/nodesms_test');

describe("inbound-message-handler", function(){

  var sut = require("../api/conversation/inbound-message-handler");
  
  var inboundRequestStub = { 
      from : "111-111-1111", 
      body : "this is a test message",
      to   : "555-555-5555"
  };

  var defaultUserId;

  beforeEach(function(done){

    var defaultUser = new user.model({
      name: "default user",
      phone_number: "555-555-5555"    
    });

    defaultUser.save(function(e){
      defaultUserId = defaultUser._id;
      done();
    });
  });

  // default site user
  describe("when a message from a new user is received", function() {

    it("creates a new conversation", function(done) {
      sut.execute(inboundRequestStub, function(data){

        conversation.findConversation(data.owner._id, inboundRequestStub.from, function(result){
            should.exist(result);
            result.messages.length.should.equal(1);
            done();
        });
      });
    });

    afterEach(function(done){
      conversation.model.remove({}, done);  
    });
  });

  describe("when a message is received for an existing conversation", function(){
    beforeEach(function(done){
      
      var _conversation = new conversation.model({
        owner: defaultUserId,
        conversationWith: inboundRequestStub.from,
        messages: [{
          to: inboundRequestStub.from,
          from: inboundRequestStub.to,
          body: "initial message from owner"
        }]
      });

      _conversation.save(done);
    });

    it("should append the message", function(done){
      sut.execute(inboundRequestStub, function(data){
        conversation.findConversation(defaultUserId, inboundRequestStub.from, function(result){
          
          result.messages.length.should.equal(2);
          result.messages[1].to.should.equal(inboundRequestStub.to);
          result.messages[1].from.should.equal(inboundRequestStub.from);
          result.messages[1].body.should.equal(inboundRequestStub.body);

          done();
        });
      });
    });
  });

  afterEach(function(done){
   user.model.remove({},done);
  });
});
