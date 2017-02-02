

$(function() { //on READY!


$('.carousel').carousel({
  interval: 5000
})

//global JSON
const myData = JSON.parse(data); //turns data string into a JSON object
let zipArray = [];




//contact stuff//


$("#zip").on('focus', function(){
  $(".errorPrompt").html("");
})

$("#prices").on('focus', function(){
  $(".errorPrompt").html("");
})

$("#miles").on('focus', function(){
  $(".errorPrompt").html("");
})






//~~~~~~~~~~~~~~~~~FIREBASE~~~~~~~~~~~~~~~~~~~~~~//




let vehicleImage;


let config = {
  apiKey: "AIzaSyAh7Te4u5BaeLXYSYp78aH4ml0pZOGHOPI",
  authDomain: "clunkerconnectio-1485387596372.firebaseapp.com",
  databaseURL: "https://clunkerconnectio-1485387596372.firebaseio.com",
  storageBucket: "clunkerconnectio-1485387596372.appspot.com",
  messagingSenderId: "1017250549242"
};


firebase.initializeApp(config);

let dataRef = firebase.database();




$("#searchButton").on("click", function(event) {
  event.preventDefault();



  // Code for storing and retrieving the most recent user.

  let year = $("#yearDataList").val().trim()

  let make = myData[$("#carMakesDataList").val().trim()].title;

  let model = $("#carModelsDataList").val().trim();

  let zip = $("#zip").val().trim();

  let prices = $("#prices").val();

  let mileage = $("#miles").val().trim();

  
if (zip.match(/^\d{5}$/) === null){
   $(".errorPrompt").html("Please enter a 5-digit zipcode");
  
  } else if (prices > 4000 || prices < 0 || prices === ""){
    $(".errorPrompt").html("Please enter a price between $1 and $4000");

}else if (mileage < 0 || mileage > 300000 || mileage === ""){
    $(".errorPrompt").html("Please enter valid mileage");
  } else {





  

  zipArray.push(zip);



        
        $("#carModelsDataList").css('display', 'none'); 
         $("#carMakesDataList").css('display', 'none'); 
         $("#zip").css('display', 'none'); 
        $("#prices").css('display', 'none'); 
         $("#miles").css('display', 'none'); 
          $("#searchButton").css('display', 'none'); 


dataRef.ref("zipArray").set(zipArray);


  // Code for the push
  dataRef.ref("carObject").push({

      year: year,
      make: make,
      model: model,
      zip: zip,
      prices: prices,
      mileage: mileage,
      vehicleImage: vehicleImage
      

  });


}

});



dataRef.ref("carObject").on("child_added", function(childSnapshot) {

      $('#clunkerTable').append(
          "<tr><td class='vehicleData'>" + "<p>" + childSnapshot.val().year + "</p>" +
          "</td><td class='vehicleData'>" + "<p>" + childSnapshot.val().make + "</p>" +
          "</td><td class='vehicleData'>" + "<p>" + childSnapshot.val().model + "</p>" +
          "</td><td class='vehicleData'>" + "<p>" + childSnapshot.val().zip + "</p>" +
          "</td><td class='vehicleData'>" + "<p>$" + parseInt(childSnapshot.val().prices).toLocaleString('en') + 
          "</td><td class='vehicleData'>" + "<p>" + parseInt(childSnapshot.val().mileage).toLocaleString('en') +
     
      "</td><td class='vehicleData'>" + childSnapshot.val().vehicleImage + 
       "</td><td class='vehicleData'><button class='buyButton' data-target='#modal' data-toggle='modal' data-vehicle='" + childSnapshot.val().year + " " + childSnapshot.val().make + " " + childSnapshot.val().model + "'>Contact</button></td></tr>");
      
        
  },


  function(errorObject) {
      console.log("Read failed: " + errorObject.code)
  });

dataRef.ref("zipArray").on("value", function(childSnapshot){
  if (childSnapshot.val().length > 0) {
    zipArray = childSnapshot.val();
    addZipCode();
  }
  

});

$("body").delegate(".buyButton", "click", function(){
  $(".vehicleInfoModal").html(($(this).data("vehicle")));
});





//~~~~~~~~~~~~~~~~~VEHICLE MAKE/MODEL DROP DOWN~~~~~~~~~~~~~~~~~~~//









let vehicle = {
  currentMake: "",
  currentModel: "",
  currentYear: "",
  indexValue: "",
  
}

//Builds Vehicle year dropdown
  for (let i = 1950; i <= 2017; i++) {
      let makeString = "<option value ='" + i + "'>" + i + "</option>";
      $("#yearDataList").append(makeString);

  }

//Builds vehicle Make drop down
  for (let i = 0; i < myData.length; i++) {
      let makeString = "<option value ='" + i + "'>" + myData[i].title + "</option>";
      $("#carMakesDataList").append(makeString);
  }


//Displays vehicle makes when year is selected
  $("#yearDataList").on('change', function() {
      $("#carMakesDataList").css('display', 'block');
      vehicle.currentYear = $(this).val();
  })




//Builds vehicle model drop down based on which vehicle make was selected
  $("#carMakesDataList").on('change', function() { //when make option is selected
      $("#carModelsDataList").empty(); //empty model list 
      $("#carModelsDataList").append("<option value= '' disabled selected>Select Your Model</option>"); //Create placeholder
      $("#searchButton").css('display', 'none'); //hide search in case it's visible
      vehicle.indexValue = $(this).val(); //logs index number in JSON object of vehicle Make 
      vehicle.currentMake = myData[vehicle.indexValue].title;
      for (let i = 0; i < myData[vehicle.indexValue].models.length; i++) { //creates options
          let makeString = "<option value ='" + myData[vehicle.indexValue].models[i].title + "'>" + myData[vehicle.indexValue].models[i].title + "</option>";
          $("#carModelsDataList").append(makeString);
      }

      $("#carModelsDataList").css('display', 'block'); //displays next selector area

  })



  $("#carModelsDataList").on('change', function() { //when model option is selected
      vehicle.currentModel = $(this).val();
       $("#zip").css('display', 'inline'); //displays search button
        $("#prices").css('display', 'inline'); //displays search button
         $("#miles").css('display', 'inline'); //displays search button
          $("#searchButton").css('display', 'block'); //displays search button
     
  });








//~~~~~~~~~~~~~~~~~ BING IMAGE API SEARCH~~~~~~~~~~~~~~~~~//







  let params = {
      // Request parameters
      "q": "",
      "count": "10",
      "offset": "0",
      "mkt": "en-us",
      "safeSearch": "Moderate",
  };



  $("#carModelsDataList").on('change', function() {

      params.q = vehicle.currentYear + " " + vehicle.currentMake + " " + vehicle.currentModel;

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


             
              vehicleImage = "<img src='" + response.value[0].contentUrl + "' height='100px'</img>";
              
          })
          .fail(function() {
              alert("error");
          });
  });





//~~~~~~~~~~~~~~~~~~~~~~GOOGLE MAPS API~~~~~~~~~~~~~~~~~~~~~~~~~//




let locations = [];
initMap();

 //pulls zipcode and throws lat/long in array
function addZipCode(){


locations = [];

  for (var i = 0; i < zipArray.length; i++) {
    let zipcode = zipArray[i];

    
        $.ajax({
          url: "https://maps.googleapis.com/maps/api/geocode/json?address=%22" + zipcode + "%22",

         success: function(result){


                let zipObject = {
            zipcode: zipcode,
            latLong: result.results[0].geometry.location
          }
            
            locations.push(zipObject);
            
        }

    });
  
  }


}
//when all ajax calls have returned;
 $(document).ajaxStop(function () {

      initMap();
  });



function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function initMap() {


  var charlotte = {lat: 35.2271, lng: -80.8431};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: charlotte,

  scrollwheel: false

  });
  var iconBase = 'https://maps.google.com/mapfiles/kml/pal4/'





//looks at locations array and displays markers
for (let i = 0; i < locations.length; i++) {
console.log(locations[i].latLong);


locations[i].latLong.lat += getRandomArbitrary(-0.01, 0.01);
locations[i].latLong.lng += getRandomArbitrary(-0.01, 0.01);





  var marker = new google.maps.Marker({
    
    position: locations[i].latLong,

    map: map,

    icon: iconBase + 'icon54.png',

    animation: google.maps.Animation.DROP
    
  });



}


}





//~~~~~~~~~~~~~~~~~~~~~~TEXT ROLLER LOGO~~~~~~~~~~~~~~~~~~~~~~~~~//






let elt = document.getElementById("roller");
let texts = ["!!$$$$$$!!", "--clunker-"]
elt.textroller = new TextRoller({
  el: elt,
  values: texts, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 2000, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});

let els = document.getElementById("secRoll");
let textz = ["!!$$$$$$!!", "connection"]
els.textSecRoll = new TextRoller({
  el: els,
  values: textz, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 2000, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});






}) //end

