
/* Application Settings Amazon Portal */

//IMAGE_UPLOAD_PATH = "Mastec/ProjectPhotos/";
SERVICE_PROTOCOL = "http://";
SERVICES_PATH = "111.93.8.198/mendvd/api/DVD/";

//url:http://111.93.8.198/mendvd/token
//url:http://111.93.8.198/mendvd/api/dvd/Registration
//http://111.93.8.198/mendvd/api/dvd/registration

/* Application Settings Amazon Portal Ends */


/*

$(document).ready(function() {
	$.mobile.buttonMarkup.hoverDelay = 60;
	$.mobile.defaultPageTransition = 'none';
                  
	if (window.screen.height==568) { // iPhone 4"
		document.querySelector("meta[name=viewport]").content="width=320.1";
	}
                  
	$.ajaxSetup({
		type: 'GET',
		timeout: 20000,
		headers: { "cache-control": "no-cache" }
	});
});

*/

// [Bool]
// Checks if LocalStorage is supported by browser
function localStorageSupported() {
	return window.localStorage != undefined;
}

function storage_saveObject(key, object) {
	//console.log("Key: " + key + " Object: " + JSON.stringify(object));
	if (localStorageSupported()) {
		window.localStorage.setItem(key, JSON.stringify(object));
	}
	//console.log(storage_ContainsKey(key) + " Contains Form");
}

// [Object] (String)
// This method will get JSON-serialized object from localStorage and
// deserialize it
function storage_loadObject(key) {
	if (localStorageSupported()) {
		var object = window.localStorage.getItem(key);
		if (object != null) {
			return JSON.parse(object);
		}
	}
	return null;
}

// [Void] (String)
// Removes entry from localStorage
function storage_removeItem(key) {
	if (localStorageSupported() && storage_ContainsKey(key)) {
		window.localStorage.removeItem(key);
	}
}

// [Bool] (String)
// Returns True if the key is stored in localStorage, false otherwise
function storage_ContainsKey(key) {
	if (localStorageSupported()) {
		return window.localStorage.getItem(key) != null;
	}
	return false;
}


function showWaitAnimation(param) {
    //	$(".ui-loader").show();
    //    console.log("Show Wait Animation");
    $.mobile.loading( 'show', {
                     text: param,
                     textVisible: true,
                     theme: 'b',
                     html: ""
                     });
}

function hideWaitAnimation() {
    //	$(".ui-loader").hide();
    $.mobile.loading( 'hide', {
                     text: "",
                     textVisible: true,
                     theme: 'b',
                     html: ""
                     });
}

function alertUser(msg, title) {
    navigator.notification.alert("" + msg, function() {
                                 }, "" + title);
}

function checkConnection()
{
    return new Promise(function (resolve, reject)
    {
                       
        console.log("Device Platform: " + device.platform);
        var networkState = navigator.network.connection.type;
        if(networkState == null || networkState == '')
        {
            reject(false);
        }
        if(device.platform == null || device.platform === "browser")
        {
            resolve(true);
        }
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'None';
                       
        console.log('Network: ' + states[networkState]);
                       
        switch(states[networkState]){
            case 'Ethernet connection':
            case 'WiFi connection':
            case 'Cell 2G connection':
            case 'Cell 3G connection':
            case 'Cell 4G connection':
            case 'Cell generic connection':
                    resolve(true);
            case 'None':
                    reject(false);
            case 'Unknown connection':
                    reject(false);
            default:
                    reject(false);
        }
    });
    
    
}

		/* KonnectCo Date Conversion Functions */

function getCurrentDateInSqlFormat()
{
     var date = new Date();
     var day = date.getDate();
     var monthIndex = date.getMonth();
     var year = date.getFullYear();
     var hours = date.getHours();
     var mins = date.getMinutes();
     var sec = date.getSeconds();
     
     
     return day + "-" + (monthIndex + 1) + "-" + year + " " + hours + ":" + mins + ":" + sec;

}

function convertDateTime(_date)
{
    return _date.replace("T", " ");
}

function convertJsonToDate(jDate)
{
    jDate = jDate.substring(6, 16);
    
    if (jDate)
    {
        var myDate = new Date( jDate * 1000);
        var one = myDate.toLocaleString();
        var test = convertToJSONDate(one);
    }
    return one;
}

function convertJsonToDate2(jDate)
{
    if (jDate)
    {
        var myDate = new Date( jDate * 1000);
        var one = myDate.toLocaleString();
        var test = convertToJSONDate(one);
    }
    return one;
}

function convertToJSONDate(strDate)
{
    var myDate = new Date(strDate); // Your timezone!
    var myEpoch = myDate.getTime();
    return '\\/Date(' + myEpoch + ')\\/';
}


/* GUID */

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

/* KonnectCo app URL's */

function getApplicationURL()
{
    return SERVICE_PROTOCOL  + SERVICES_PATH;
}

function getRegistrationURL()
{
    return getApplicationURL() + '/Registration';
}

function getTokenURL()
{
    return 'http://111.93.8.198/mendvd/token';
}

function getSubscriptionURL()
{
    return getApplicationURL() + '/SubscribeMagazine';
}

function getdescriptionURL()
{
    return getApplicationURL() + '/DisplayArticle';
}








