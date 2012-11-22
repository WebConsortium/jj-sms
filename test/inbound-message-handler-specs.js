var mongoose = require("mongoose"),
    conversation = require("../models/conversation"),
    user = require("../models/user"),
    should = require("should")

mongoose.connect('mongodb://localhost/nodesms_test');

describe("inbound-message-handler", function(){

  var sut = require("../api/conversation/inbound-message-handler");

  // default site user
  describe("when a message from a new user is received", function() {

    var request = { 
      from : "111-111-1111", 
      body : "this is a test message",
      to   : "555-555-5555"
    };

    beforeEach(function(done){

      var defaultUser = new user.model({
        name: "default user",
        phone_number: "555-555-5555"    
      });

      defaultUser.save(done);
    });

    it("creates a new user", function(done) {
      sut.execute(request, function() {
        user.findByPhoneNumber(request.from, function(user) {
          should.exist(user);
          done();
        });
      });
    });

    it("creates a new conversation", function(done) {
      sut.execute(request, function(data){

        conversation.findConversation(data.owner._id, data.conversationWith._id, function(conversation){
            should.exist(conversation);
            conversation.messages.length.should.equal(1);
            done();
        });
      });
    });

    afterEach(function(done){
      var removeConversations = function(){
        conversation.model.remove({}, removeUsers);  
      };

      var removeUsers = function(){
        user.model.remove({},done);
      };
      removeConversations();
    });
  });
});
