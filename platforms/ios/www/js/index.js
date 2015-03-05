//foreground location tracking
var apiPostLocation = 'http://127.0.0.1:8000/postlocation';

function setlocation(){
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError,{enableHighAccuracy:true, timeout: 90000, maximumAge:0});
};


function watchLocation(){
    navigator.geolocation.watchPosition(geolocationSuccess,
                                        geolocationError,
                                        {enableHighAccuracy:true, timeout: 90000, maximumAge:0});

};



function geolocationSuccess(position) {
    var user = JSON.parse(localStorage.getItem("user"));
    var date = new Date()
    //add uuid for smartphones 
    var currentLocation = {
        //'uuid' : user.uuid,
        'latitude' : position.coords.latitude,
        'longitude' : position.coords.longitude,
        'accuracy' : position.coords.accuracy,
        'timestamp' : date.getTime()
    };
    postRequest(apiPostLocation, currentLocation, geolocationCallback);     
};


function geolocationError(error) {
    //on error call setlocation function again later, e.g. 10 minutes later 3 times and then give up
    //var message="geolocationError"
    console.log('geolocationError code: '    + error.code    + '\n' +
                'geolocationError message: ' + error.message + '\n');
    //return message;
};

function geolocationCallback(jqXHR, data){
    if(jqXHR===201){

    }else{
        console.log("jqXHR: "+ jqXHR);
        console.log("data: "+ data);
    };
};

function postRequest(apiUrl, passData, callbackF){
    $.ajax({
        type: "POST",
        url: apiUrl,
        contentType: "text/plain", //"application/json; charset=utf-8",
        //xhrFields: {
        //  withCredentials: false
        //  },
        //headers: {
        //  },
        data: JSON.stringify(passData),
        //dataType: "json",
        success: function(_data, _textstatus, _jqXHR){
            callbackF(_jqXHR.status,passData);
            console.log("POST_data: " + _data.message);
            console.log("POST_textstatus: " + _textstatus);
            console.log("POST_jqXHR: " + _jqXHR.status);
        },
        error: function(_jqXHR, _textstatus, _err){
            callbackF(_jqXHR.status,passData);
            console.log("POST_jqXHR: " + _jqXHR.status);
            console.log("POST_textstatus: " + _textstatus);
            console.log("POST_error_err: " + _err);
            //handle connection errors here
        }
    });
}

/*
//local notifications
function localNotify(){
    var d = new Date().getTime();
    var targetTime = d + 30000;
    window.plugin.notification.local.add({
        id:         "1",  // A unique id of the notification
        date:       targetTime,    // This expects a date object
        message:    "Yaaay it works!",  // The message that is displayed
        title:      "TestNotification"  // The title of the message
        //repeat:     String,  // Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
        //badge:      1,  // Displays number badge to notification
        //sound:      String,  // A sound to be played
        //json:       String,  // Data to be passed through the notification
        //autoCancel: Boolean, // Setting this flag and the notification is automatically cancelled when the user clicks it
        //ongoing:    Boolean, // Prevent clearing of notification (Android only)
    })//, callback, scope);
};
*/


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("deviceready", onDeviceReady(), false);

function onDeviceReady(){

    
    window.setInterval( function() {
        setlocation();
    }, 5000);
    //localNotify();

    //watchLocation();
    
};
