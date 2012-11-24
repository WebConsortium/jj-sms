var mongoose, should, models;

mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/nodesms_test');

should = require("should");
models = require("../core/models")(mongoose);

var createConversation = function(conversationModel, callback) {

  var conversation = new models.conversation.model({
    owner: conversationModel.ownerId,
    conversationWith: conversationModel.withNumber,
    messages: [{
      to: conversationModel.to,
      from: conversationModel.from,
      body: conversationModel.body
    }]
  });

  conversation.save(function(e){
    callback(conversation._id);
  });
};

describe("Message handler tests", function(){

  var defaultUserId;

  beforeEach(function(done){
    var defaultUser = new models.user.model({
      name: "default user",
      phone_number: "555-555-5555"    
    });

    defaultUser.save(function(e) { 
      defaultUserId = defaultUser._id; 
      done();
    });
  });

  // INBOUND MESSAGE TESTS
  // ---------------------
  describe("inbound message handler", function(){

    var sut = require("../api/message/inbound-message-handler")(models);
    
    var inboundRequest = { 
      from : "111-111-1111", 
      body : "this is a test message",
      to   : "555-555-5555"
    };

    // default site user
    describe("when a message from a new user is received", function() {

      it("creates a new conversation", function(done) {
        sut.execute(inboundRequest, function(data){

          models.conversation.findConversation(data.owner._id, inboundRequest.from, function(result){
            should.exist(result);
            result.messages.length.should.equal(1);
            done();
          });
        });
      });

      afterEach(function(done){
        models.conversation.model.remove({}, done);  
      });
    });

    describe("when a message is received for an existing conversation", function() {
      var testConversationId;

      beforeEach(function(done){
        createConversation({ 
          ownerId : defaultUserId, 
          withNumber : inboundRequest.from, 
          to: inboundRequest.from, 
          from: inboundRequest.to,
          body: "initial message from owner to conversation with number"}, function(id){
            testConversationId = id;
            done();
        });
      });

      it("should append the message", function(done){
        sut.execute(inboundRequest, function(data){
          models.conversation.model.findById(testConversationId, function(err, result){
            
            result.messages.length.should.equal(2);
            result.messages[1].to.should.equal(inboundRequest.to);
            result.messages[1].from.should.equal(inboundRequest.from);
            result.messages[1].body.should.equal(inboundRequest.body);

            done();
          });
        });
      });

      afterEach(function(done){
        models.conversation.model.remove({}, done);  
      });
    });
  });

  // OUTBOUND MESSAGE TESTS
  // ----------------------
  describe("outbound message handler", function(){

    var testConversationId;
    var sut = require("../api/message/outbound-message-handler")(models);
    var outboundRequest = {
      from: "555-555-5555",
      to: "111-111-1111",
      body: "some sample message"
    };

    beforeEach(function(done){

      outboundRequest.ownerId = defaultUserId;
    
      createConversation({ 
        ownerId : defaultUserId, 
        withNumber : outboundRequest.to, 
        from: outboundRequest.to, 
        to: outboundRequest.from,
        body: "initial message from outside user to owner"}, function(id) {
          testConversationId = id;
          done();
      });
    });

    describe("when a message is sent", function(){
      it("should add the message to the conversation", function(done){

        sut.execute(outboundRequest, function(data){
          models.conversation.model.findById(testConversationId, function(err, conversation){
            conversation.messages.length.should.equal(2);
            conversation.messages[1].from.should.equal(outboundRequest.from);
            conversation.messages[1].to.should.equal(outboundRequest.to);
            conversation.messages[1].body.should.equal(outboundRequest.body);
            done();
          });
        });
      });
    });

    describe("when a sent message fails", function(){
      it("should mark the message as failed")
    });

    describe("when a sent message succeeds", function(){
      it("should mark the message as sucess")
    });
  });

  afterEach(function(done){
    models.user.model.remove({},done);
  });
});
