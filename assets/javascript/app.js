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


  var name = "";
  var destination = "";
  var frequency = "";
  var firstArrival = "";

  function addTrain(){
      // trainArr.push(trainObj);
      // console.log(trainObj);
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
  }// will take the user input of train information,store in a train object and add to database

  function displayTrain(){
    for (var i = 0; i < trainArr.length; i++){
      var firstTime = moment(trainArr[i].firstArrival, "HH:mm").subtract(1, "years");
      console.log(trainArr[i]);
      var currentTime = moment();
      var timeDiffrence = moment().diff(moment(firstTime), "minutes");
      var remainder = timeDiffrence % parseInt(trainArr[i].frequency);
      var minAway = parseInt(trainArr[i].frequency) - remainder;
      var nextArrival = (moment().add(minAway, "minutes")).format("hh:mm");
      console.log(moment());

      $("#train-list > tbody").append("<tr><td>" + trainArr[i].name + "</td><td>" + trainArr[i].destination +
      "</td><td>" + trainArr[i].frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
    }
  }// creates table elements, pulls data from firebase, and stores the data in those elements which are appended to
   // appropriate table on page

  database.ref().on("child_added", function(childSnapshot){
    // console.log("Child: " + childSnapshot.val().name);
    trainArr.push(childSnapshot.val());
    $("#train-list > tbody").empty();
    displayTrain();
  })

  $(document).on("click", "#new-train", function(event){
    event.preventDefault();
    addTrain();
  });
  // setInterval(displayTrain(), 60000);

})