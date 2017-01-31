
$(function() { //on READY!




//global JSON
const myData = JSON.parse(data); //turns data string into a JSON object
let zipArray = [];







//~~~~~~~~~~~~~~~~~FIREBASE~~~~~~~~~~~~~~~~~~~~~~//







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


  let car = {
      year: year,
      make: make,
      model: model,
      zip: zip,
      prices: prices,
      mileage: mileage
  }

  zipArray.push(zip);

addZipCode(zipArray);

dataRef.ref("zipArray").set(zipArray);


  // Code for the push
  dataRef.ref("carObject").push({

      year: year,
      make: make,
      model: model,
      zip: zip,
      prices: prices,
      mileage: mileage
      

  });
});

dataRef.ref("carObject").on("child_added", function(childSnapshot) {

      $('#clunkerTable').append(
          "<tr><td id='yearDisplay'>" + childSnapshot.val().year +
          "</td><td id='makeDisplay'>" + childSnapshot.val().make +
          "</td><td id='modelDisplay'>" + childSnapshot.val().model +
          "</td><td id='nextDisplay'>" + childSnapshot.val().zip +
          "</td><td id='awayDisplay'>" + childSnapshot.val().prices + 
          "</td><td id='milesDisplay'>" + childSnapshot.val().mileage + "</td></tr>");
    
      
  },

  function(errorObject) {
      console.log("Read failed: " + errorObject.code)
  });

dataRef.ref("zipArray").on("value", function(childSnapshot){
  if (childSnapshot.val().length > 0) {
    zipArray = childSnapshot.val();  
  }
  

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



  $("#searchButton").on('click', function() {

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


              let newDiv = $("<div>");
              newDiv.html("<img src='" + response.value[0].contentUrl + "' height='200px'</img>");
              $("#images").html(newDiv);
          })
          .fail(function() {
              alert("error");
          });
  });





//~~~~~~~~~~~~~~~~~~~~~~GOOGLE MAPS API~~~~~~~~~~~~~~~~~~~~~~~~~//






let locations = [];
 //pulls zipcode and throws lat/long in array
function addZipCode(zipArray){
  var zipArray = zipArray;
  for (var i = 0; i < zipArray.length; i++) {
    let zipcode = zipArray[i];
  
        $.ajax({
          url: "http://maps.googleapis.com/maps/api/geocode/json?address=%22" + zipcode + "%22",

         success: function(result){

          var zipObject = {
            zipcode: "",
            latLong: ""
          }
          zipObject.zipcode = zipcode;
          zipObject.latLong = result.results[0].geometry.location;
          console.log(zipObject.latLong);
          

          
            //map function????
          
            locations.push(zipObject);
           

            
            
            initMap();
       

            


        }
    });

}

}



function initMap() {

  
  var charlotte = {lat: 35.2271, lng: -80.8431};

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: charlotte,

  scrollwheel: false,
  disableDoubleClickZoom: true
  });
  var iconBase = 'https://maps.google.com/mapfiles/kml/pal4/'
  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '<h1> 1998 Ford Mustang </h1>' +
      '<p> Mileage: 205000 </p>' +
      '<p> Price: $4,500 </p>'
      '</div>'+
      '</div>';



//looks at locations array and displays markers
for (var i = 0; i < locations.length; i++) {



  var marker = new google.maps.Marker({
    
    position: locations[i].latLong,

    map: map,

    icon: iconBase + 'icon54.png',

    animation: google.maps.Animation.DROP
    
  });

    var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

}


}
initMap();



//~~~~~~~~~~~~~~~~~~~~~~TEXT ROLLER LOGO~~~~~~~~~~~~~~~~~~~~~~~~~//






let elt = document.getElementById("roller");
let texts = ["!!$$$$$$!!", "--clunker-"]
elt.textroller = new TextRoller({
  el: elt,
  values: texts, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 2500, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});

let els = document.getElementById("secRoll");
let textz = ["!!$$$$$$!!", "connection"]
els.textSecRoll = new TextRoller({
  el: els,
  values: textz, // an array of texts.     default : [el.innerHtml]
  align: "middle", // right, left or middle. default : middle
  delay: 2500, // in milliseconds,       default : 5000
  loop: false // at the end, restart.   default : true
});






}) //end

