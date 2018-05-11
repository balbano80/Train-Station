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

  var database = firebase.database();

  var trainArr = [];
  var name = "";
  var destination = "";
  var frequency = "";
  var firstArrival = "";

  var currentTime = "";
  var timeDiffrence = "";
  var remainder = "";
  var minAway = "";
  var nextArrival = "";
  var baseMinAway = "";

  function addTrain(){
      name = $("#train-name").val().trim(),
      destination = $("#destination").val().trim(),
      firstArrival = $("#first-arrival").val().trim(),
      frequency = $("#frequency").val().trim()

      database.ref().push({
        name: name,
        destination: destination,
        firstArrival: firstArrival,
        frequency: frequency
      }, function(errorObj){
        console.log("Error: " + errorObj.code);
      });

      $("#train-name").val("");
      $("#destination").val("");
      $("#first-arrival").val("");
      $("#frequency").val("");
  }// takes the user input of train information, and push to database.  Also clears out input fields.

  function displayTrain(){
    $("#train-list > tbody").empty();
    for (var i = 0; i < trainArr.length; i++){
      var firstTime = moment(trainArr[i].firstArrival, "HH:mm A").subtract(1, "years");
      // console.log(trainArr[i]);
      currentTime = moment();
      timeDiffrence = moment().diff(moment(firstTime), "minutes");
      remainder = timeDiffrence % parseInt(trainArr[i].frequency);
      minAway = parseInt(trainArr[i].frequency) - remainder;
      nextArrival = (moment().add(minAway, "minutes")).format("hh:mm A");
      if (i === 0){
        baseMinAway = minAway;
        // console.log("baseMinAway" + baseMinAway);
      }

      $("#train-list > tbody").append("<tr><td>" + trainArr[i].name + "</td><td>" + trainArr[i].destination +
      "</td><td>" + trainArr[i].frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
    }
  }// loops through the array of train objects, calculates times using moment.js, formats them and displays all

  database.ref().on("child_added", function(childSnapshot){
    // console.log("Child: " + childSnapshot.val().name);
    trainArr.push(childSnapshot.val());
    displayTrain();
    },  function(errorObj){
    console.log("Error: " + errorObj.code);
  });

  $(document).on("click", "#new-train", function(event){
    event.preventDefault();
    addTrain();
  });
  setInterval(function(){
    if (trainArr.length > 0){
      var checkFirstTime = moment(trainArr[0].firstArrival, "HH:mm A").subtract(1, "years");
      var checkCurrentTime = moment();
      var checkTimeDiffrence = moment().diff(moment(checkFirstTime), "minutes");
      var checkRemainder = checkTimeDiffrence % parseInt(trainArr[0].frequency);
      var checkMinAway = parseInt(trainArr[0].frequency) - checkRemainder;
      // console.log("CheckMinAway: " + checkMinAway)
      if (checkMinAway !== 0 || checkMinAway < baseMinAway){
        displayTrain();
      }
    }
  }, 1000);// First checks if there are any trains in the array.  Then, every second, it re-calculates 
           //and compares the current minutes away to the stored minutes away from last displayTrain 
           //function call. If current is less than, then call displayTrain function again.
});