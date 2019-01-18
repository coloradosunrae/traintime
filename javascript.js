
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCIdk3vzR9AGD3U13xmXsiKeGov_2hU67o",
    authDomain: "train-train-d7e17.firebaseapp.com",
    databaseURL: "https://train-train-d7e17.firebaseio.com",
    projectId: "train-train-d7e17",
    storageBucket: "train-train-d7e17.appspot.com",
    messagingSenderId: "227594528804"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  // 2. Button for adding train times
$("#traintimes").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstInput = moment($("#first-train").val().trim(), "HH:mm").subtract(1, "years").format("X");
    var frequency = $("#frequency").val().trim();
  
    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstInput: firstInput,
        frequency: frequency
      };
  
    // Uploads employee data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstInput);
    console.log(newTrain.frequency);
  
  
    // Clears all of the text-boxes
    $("#train-name").val("");
  $("#destination").val("");
  $("#first-train").val("");
  $("#frequency").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstInput = childSnapshot.val().firstInput;
    var frequency = childSnapshot.val().frequency;
  
    console.log(frequency);
    console.log(firstInput);


    // Difference between the times
    var diffTime = moment().diff(moment.unix(firstInput), "minutes");

    var tRemainder = moment().diff(moment.unix(firstInput), "minutes") % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency), 
      $("<td>").text((nextTrain).format("hh:mm a")),
      $("<td>").text(tMinutesTillTrain),
 
    );
  
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
  });
  