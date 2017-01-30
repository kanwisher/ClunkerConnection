
const myData = JSON.parse(data); //turns data into a JSON object

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAh7Te4u5BaeLXYSYp78aH4ml0pZOGHOPI",
  authDomain: "clunkerconnectio-1485387596372.firebaseapp.com",
  databaseURL: "https://clunkerconnectio-1485387596372.firebaseio.com",
  storageBucket: "clunkerconnectio-1485387596372.appspot.com",
  messagingSenderId: "1017250549242"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

// main functions --------------------------------->

// Capture Button Click
$("#searchButton").on("click", function(event) {
  event.preventDefault();

  // YOUR TASK!!!
  // Code in the logic for storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  var year = $("#yearDataList").val().trim()
  console.log(year)
  var make = myData[$("#carMakesDataList").val().trim()].title;
  console.log(make)
  var model = $("#carModelsDataList").val().trim();
  console.log(model)
  var zip = $("#zip").val().trim();
  console.log(zip)
  var prices = $("#prices").val();
  console.log(prices)

  // Code for the push
  dataRef.ref().push({

      year: year,
      make: make,
      model: model,
      zip: zip,
      prices: prices,
      // dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});

dataRef.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().year);
      console.log(childSnapshot.val().make);
      console.log(childSnapshot.val().model);
      console.log(childSnapshot.val().zip);
      console.log(childSnapshot.val().prices);


      $('#clunkerTable').append(
          "<tr><td id='yearDisplay'>" + childSnapshot.val().year +
          "</td><td id='makeDisplay'>" + childSnapshot.val().make +
          "</td><td id='modelDisplay'>" + childSnapshot.val().model +
          "</td><td id='nextDisplay'>" + childSnapshot.val().zip +
          "</td><td id='awayDisplay'>" + childSnapshot.val().prices + "</td></tr>");
  },

  function(errorObject) {
      console.log("Read failed: " + errorObject.code)
  });






var elt = document.getElementById("roller");
var texts = ["!!$$$$$$!!", "--clunker-"]
elt.textroller = new TextRoller({
  el: elt,
  values: texts, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 3000, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});

var els = document.getElementById("secRoll");
var textz = ["!!$$$$$$!!", "connection"]
els.textSecRoll = new TextRoller({
  el: els,
  values: textz, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 3000, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});




$(function() { //document onready function






  let currentMake = "";
  let currentModel = "";
  let currentYear = "";



  for (var i = 1950; i <= 2017; i++) {
      let makeString = "<option value ='" + i + "'>" + i + "</option>";
      $("#yearDataList").append(makeString);

  }

  for (var i = 0; i < myData.length; i++) {
      let makeString = "<option value ='" + i + "'>" + myData[i].title + "</option>";
      $("#carMakesDataList").append(makeString);
  }


  $("#yearDataList").on('change', function() {
      $("#carMakesDataList").css('display', 'block');
      currentYear = $(this).val();
  })





  $("#carMakesDataList").on('change', function() { //when make option is selected
      $("#carModelsDataList").empty(); //empty model list everytime Make is selected
      $("#carModelsDataList").append("<option value= '' disabled selected>Select Your Model</option>");
      $("#searchButton").css('display', 'none'); //hide search in case it's visible
      indexValue = $(this).val(); //logs index number of object locatio
      currentMake = myData[indexValue].title;
      for (var i = 0; i < myData[indexValue].models.length; i++) { //creates options
          let makeString = "<option value ='" + myData[indexValue].models[i].title + "'>" + myData[indexValue].models[i].title + "</option>";
          $("#carModelsDataList").append(makeString);

      }

      $("#carModelsDataList").css('display', 'block'); //displays next selector area

  })



  $("#carModelsDataList").on('change', function() { //when model option is selected
      currentModel = $(this).val();
      $("#searchButton").css('display', 'block'); //displays search button
  });




  var params = {
      // Request parameters
      "q": "",
      "count": "10",
      "offset": "0",
      "mkt": "en-us",
      "safeSearch": "Moderate",
  };





  $("#searchButton").on('click', function() {

      params.q = currentYear + " " + currentMake + " " + currentModel;
      $.ajax({


              url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
              beforeSend: function(xhrObj) {
                  // Request headers
                  xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "981fa9e92c554da89c418b3cf40e7598");
              },
              type: "GET",
              // Request body
              data: "{body}",
          })
          .done(function(response) {


              let newDiv = $("<div>");
              newDiv.html("<img src='" + response.value[0].contentUrl + "' height='200px'</img>");
              $("#images").html(newDiv);
          })
          .fail(function() {
              alert("error");
          });
  });

})
