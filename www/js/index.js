
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();


var cur_idx=0; //cur_idx denotes the memo that a user clicked
var max_idx=0; //max_idx denotes the number of memos
var str_list=[""]; //This array contains the contents of memo
var date_list=[""]; //This array contains the created/modified date of memo

//When the app is launched, the app loads while memo data from localStorage
//and save it to the str_list and date_list to make it faster to retrieve data
//by doing this, we don't need to retrieve data from localstorage whenever we need
//rather we can easily retrieve data from arrays on main memory
$( document ).ready(function() {
	//max_idx is loaded from localStorage
	max_idx = localStorage.getItem("max_idx"); //\
	console.log(max_idx); 
	for (i=1;i<=max_idx;i++)
	{
		//Check if localStorage has corresponding value to eliminate errors
		//if it has, the data is inserted into the corresponding array.
		if (localStorage.getItem("cn")+i){
			str_list.push(localStorage.getItem("cn"+i));
		}
		if (localStorage.getItem("t")+i){
			date_list.push(localStorage.getItem("t"+i));
		}
	}
});



$(document).on("pageshow","#home",function(){

	//At first, it removes li lists to recontruct it	
	$("#lst_grp>li").remove();
	var empty = 0;
			//iterating from new memo to old memo, it rebuilds home page adding li entries with the memo contents and date
		for(var i=max_idx;i>0;i--){
			//error checking (if the content is empty or NULL, it is not shown on the list)
			if(str_list[i] && str_list[i] != "" && str_list[i]!= " "){
			var $li = $("<li/>").appendTo($("#lst_grp"));
			$li.attr("c_idx",i);
			 //the split function can cut off the words after enter, so it can show the first sentence of memo)
			$li.attr("c_nm",str_list[i].split('\n')[0]);
			 //the split function can cut off the words after enter, so it can show the first sentence of memo)
			$("<h3/>",{"text": str_list[i].split('\n')[0]}).appendTo($li);
			var $p = $("<p align=\"right\"/>").appendTo($li); //It makes date located on the right side.
			$("<strong/>",{"text":date_list[i]}).appendTo($p); //using date_list[], the corresponding date shows on the list
			
			//when a user click a memo, it goes to viewer page through fnMove function. parameter c_idx shows the content(memo) index
			$li.on("click",function(){
				fnMove($(this).attr("c_idx"));
			});
			//when a user click a memo, it deletes the memo through fnSwipe function. parameter c_idx shows the content(memo) index
			$li.on("swipeleft",function(){
				fnSwipe($(this).attr("c_idx"));
			});
		empty++;
		}

		}
		if(empty==0)	// if there is no memo on the app, show that No memos

		{
			var $li = $("<li/>").appendTo($("#lst_grp"));
			$("<h3/>",{"text":"No memos"}).appendTo($li);
			$li.css("text-align","center");

		}
		$("#lst_grp").listview("refresh");
	
});

//the first page "empty" redirects to #home page using this function
$(document).on("pageshow","#empty",function(){
		$.mobile.changePage("#home");
});

//when a user clicks a memo, it goes to viewer. the global variable cur_idx is changed to the memo clicked
function fnMove(idx){
	cur_idx=idx;
	$.mobile.changePage("#viewer");
}
//when a user swipe-lefts a memo, the memo is deleted from both of list and localStorage. and it goes to home page through empty page.
function fnSwipe(idx){
	alert("The memo is deleted"); //alert that the memo is deleted
	str_list[idx]="";
	date_list[idx]="";
	localStorage.removeItem("t"+cur_idx);
	localStorage.removeItem("cn"+cur_idx);
	$.mobile.changePage("#empty");

}

//when viewer page is loaded (when user clicks a memo), the content textarea(view_text_area) is filled with the content of the memo that the user clicked
$(document).on("pageshow","#viewer",function(){

	document.getElementById("view_text_area").value = str_list[cur_idx].toString();

});

//Delete All button on the home page clear the localStorage
function deleteAll()
{
	localStorage.clear();
	location.reload();

}


//this function is used to modify memo on the viewer page
function modify(){

	//To update the date, I use Date(). 
	//To make four letters of year and two letters of date, hours, and mins.
	//I addtionally processes the date data like below.
	var date = new Date();
	var dd = (date.getDate() < 10 ? '0' : '') + date.getDate(); //If date is lower than 10, it adds 0 in front of date to make it two letters
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);//If month is lower than 10, it adds 0 in front of month to make it two letters
    var yyyy = date.getFullYear();
    var hours = ("0" + date.getHours()).slice(-2); //it adds 0 in front of hours, and using slice it just takes the last two letters
    var mins = ("0" + date.getMinutes()).slice(-2); //it adds 0 in front of mins, and using slice it just takes the last two letters

	str_list[cur_idx] = document.getElementById("view_text_area").value.toString(); // it modifies the contents of the current memo in str_list
	date_list[cur_idx] = yyyy+"."+MM+"."+dd+"."+hours+":"+mins; // it modifies the contents of the current memo in date_list
	filesave(); // it stores the data in localStorage

	$.mobile.changePage("#home");

}

//This is used to create a new memo on Editor page
function saveFile(){

	// the process of getting date information is sames as above (modify function)
	var date = new Date();
	var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
    var hours = ("0" + date.getHours()).slice(-2);
    var mins = ("0" + date.getMinutes()).slice(-2);

	str_list.push(document.getElementById("new_memo").value); //It save the content of the new memo in str_list
	date_list.push(yyyy+"."+MM+"."+dd+"."+hours+":"+mins); //It save the date of the new memo in date_list
	max_idx++; //increment the number of memo (max_idx)
	cur_idx = max_idx; //since we are dealing with the new memo, it changes cur_idx to the new memo(max_idx)
	filesave(); //it stores the data in localStorage

    document.getElementById("new_memo").value = ''; //empty the memo text area
	$.mobile.changePage("#home");


}

function filesave(){
	//with key ("t"+cur_idx), it saves date of the current memo in localStorage
	localStorage.setItem("t"+cur_idx, date_list[cur_idx].toString()); 
	//with key ("cn"+cur_idx), it saves content of the current memo in localStorage
	localStorage.setItem("cn"+cur_idx, str_list[cur_idx].toString()); 
	//with key (max_idx), it saves the number of memos(max_idx) in localStorage
	localStorage.setItem("max_idx", max_idx); 
	alert("Memo saved"); // alert that the memo is safely saved
}