/*
 * David Rust-Smith & Nick Breen - August 2013
 *
 * Apache 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. 
 */
app.submitToServer = function() {
	// var userPasscode = document.getElementById('userPasscode').value;
	// var numOfUsers = document.getElementById('numOfUsers').value; 	
	var employee_id = 2;
	var numOfUsers = 1;
	numOfUsers = (numOfUsers == "") ? 1 : numOfUsers;

	if(app.position!=undefined && app.position!=null){
		if (((new Date().getTime() / 1000) - app.timeLastSubmit) > 59
				|| app.forcedSubmit) {
			app.timeLastSubmit = new Date().getTime() / 1000;
			app.checkConnection();

			$.ajax({
				url : "http://192.168.1.6:99/cb/index.php/api/mobileapp/locationSubmit/format/json",
				contentType : "application/json",
				type : "POST",
				data : {
					"employee_id" : employee_id 		 		,
					 "numOfUsers" : numOfUsers  		 		,
					 "lat" : app.position.coords.latitude 		,
					 "lng" : app.position.coords.longitude		,
				},
				timeout : 10000,
				success : function(response) {
					app.serverSuccess(response);
				},
				error : function(request, errorType, errorMessage) {
					app.serverError(request, errorType, errorMessage);
				}	
		} 
		else {
			console.log('too soon');
		}		
	}
	
};

app.serverSuccess = function(response) {
	var responseObj = jQuery.parseJSON(response);
	var serverResponse = document.getElementById('serverResponse');
	serverResponse.innerHTML = "auto-submit: " + responseObj.message + ": "
			+ app.getReadableTime(new Date());

	if (responseObj.message == "not authorized") {
		serverResponse.html("server Fail");
		$(serverResponse).removeClass("success");
		$(serverResponse).addClass("fail");
	} else {
		serverResponse.html("server Sucess");
		$(serverResponse).removeClass("fail");
		$(serverResponse).addClass("success");

		// Show or hide num of users option
	}

};

app.serverError = function(request, errorType, errorMessage) {
	var serverError = document.getElementById('serverResponse');
	$(serverError).removeClass("success");
	$(serverError).addClass("fail");
	serverError.innerHTML = "Error: " + errorMessage + " "
			+ app.getReadableTime(new Date());
};
