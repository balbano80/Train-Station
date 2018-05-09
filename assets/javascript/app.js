$(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDsVrku1OCaizArmSzrlmLUgIkuVVpOyCM",
    authDomain: "train-station-3dd55.firebaseapp.com",
    databaseURL: "https://train-station-3dd55.firebaseio.com",
    projectId: "train-station-3dd55",
    storageBucket: "train-station-3dd55.appspot.com",
    messagingSenderId: "626566598695"
  };
  firebase.initializeApp(config);

  var trainArr = [];
  var database = firebase.database();

  var trainObj = {
      name: "",
      destination: "",
      firstArrival: "",
      frequency: "",
      trainNum: 0
  };

  var trainCounter = 0;

  function addTrain(){
      trainObj.name = $("#train-name").val().trim();
      trainObj.destination = $("#destination").val().trim();;
      trainObj.firstArrival = $("#first-arrival").val().trim();;
      trainObj.frequency = $("#frequency").val().trim();;
      trainObj.trainNum = trainCounter;

      console.log(trainObj);
      database.ref().push({
        train: trainObj
      }, function(errorObj){
        console.log("Error: " + errorObj.code);
      });

      trainCounter++;

      $("#train-name").val("");
      $("#destination").val("");
      $("#first-arrival").val("");
      $("#frequency").val("");
  }// will take the user input of train information,store in a train object and add to database

  function displayTrain(){
    database.ref().on("value", function(snapshot){
        var tempBody = $("<tbody>");
        var tempRow = $("<tr>");
        tempRow.append(tempBody);
        var tempName = $("<td>");
        var tempDestination = $("<td>");
        var tempFrequency = $("<td>");
        // tempName.attr("scope", "col");
        tempName.text(snapshot.val().train.name);
        tempBody.append(tempName);
        console.log(tempName);

        tempDestination.text(snapshot.val().train.destination);        
        tempBody.append(tempDestination);
        tempFrequency.text(snapshot.val().train.frequency);
        tempBody.append(tempFrequency);

        $("#train-list").append(tempBody);
        console.log(tempBody);
      }, function(errorObj){
        console.log("Error: " + errorObj.code);
    });
  }// creates table elements, pulls data from firebase, and stores the data in those elements which are appended to
   // appropriate table on page


  $(document).on("click", "#new-train", function(event){
    event.preventDefault();
    addTrain();
    displayTrain();
  });

  displayTrain();

});