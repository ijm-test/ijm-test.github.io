//globals
var host = "https://sharecad.org/",
	cadframe = "cadframe/load?url=",
    	fileDir = "uploads/";

// onLoad runs when the page is loaded
function init(){
	console.log("Loading Page");

	//set convert button to disabled
	var convertBtn = document.getElementById("convertBtn");
	convertBtn.disabled = true;
	convertBtn.display = "block";

	var output = document.getElementById("outputArea");
	output.style.display = "none";
}

//Button callback to start file upload and conversion
function convertCallback(){
	console.log("Button Pressed");

	//upload/convert/download file
	var file = document.getElementById("fileInput").files[0];
	if (file != ''){
		convert(file);
	}

	var output = document.getElementById("outputArea");
	output.style.display = "block";
}

//Input callback for enabling convert button
function fileCallback(file){
	console.log("File Callback");
	console.log(file);

	//only enable button if a file was chosen by user
	var convertBtn = document.getElementById("convertBtn");
	if (file == ''){
		convertBtn.disabled = true;
	}
	else {
		convertBtn.disabled = false;
	}
}

function displayPLT(id, file) {
	if (typeof displayPLT.last == "undefined") {
		displayPLT.last = '';
	}
	if (displayPLT.last != '') {
		var last = document.getElementById(displayPLT.last);
		if(last){
			last.style.color = "#cccccc";
		}
	}

	var current = document.getElementById(id);
	var pltFrame = document.getElementById("PLTview");
	var dataURL;

	if(current){
		current.style.color = "#ffffff";
		displayPLT.last = id;

		/*var xhr = new XMLHttpRequest;
		xhr.responseType = 'blob';

		xhr.onload = function() {
			var recoveredBlob = xhr.response;

			var reader = new FileReader;

			reader.onload = function() {
				var blobAsDataUrl = reader.result;
				dataURL = blobAsDataUrl;
				console.log(host + cadframe + dataURL);
				reloadIFrame(pltFrame, host + cadframe + dataURL);
			};
			reader.readAsDataURL(recoveredBlob);
		};
		xhr.open('GET', file);
		xhr.send();*/
		uploadFile(file, id);
		//reloadIFrame(pltFrame, host + cadframe + file);
	} else {
		displayPLT.last = '';
		reloadIFrame(pltFrame, null);
	}

}

function uploadFile(file, filename) {
	/*var xhr = new XMLHttpRequest();
	xhr.open('POST', '/server', true);
	xhr.onload = function(e) {
		//var recoveredBlob = xhr.response;
		//console.log(recoveredBlob);
	};

	// Listen to the upload progress.
	var progressBar = document.querySelector('progress');
	xhr.upload.onprogress = function(e) {
		if (e.lengthComputable) {
			progressBar.value = (e.loaded / e.total) * 100;
			progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
		}
	};

	xhr.send(file);*/
	var uploadTask = storageRef.child(fileDir + filename).put(file);
	
	uploadTask.on('state_changed', (snapshot) => {
  		// Observe state change events such as progress, pause, and resume
  	}, (error) => {
    		// Handle unsuccessful uploads
    		console.log(error);
 	 }, () => {
     		// Do something once upload is complete
     		console.log('success');
		
		var pltFrame = document.getElementById("PLTview");
		storageRef.child(fileDir + filename).getDownloadURL().then(function(url) {
			reloadIFrame(pltFrame, host + cadframe + url);
		});
  	});
}

function reloadIFrame(frm, src){
	frm.src = src ? src : host + "cadframe";
}

function deleteCallback() {
	var li = this.parentNode;
	var ol = li.parentNode;
	ol.removeChild(li);
	if (ol.children.length < 1) {
		var output = document.getElementById("outputArea");
		output.style.display = "none";
	} else {
		displayPLT();
	}
}

function downloadCallback(url) {
	console.log(url);
	window.location=url;
}

function updateScroll(elem){
	if(elem){
		elem.scrollTop = elem.scrollHeight;
	}
}
