module.exports.sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.validateSession = function(sess) {
	console.log("In validate session");
	if (sess == null){
		console.log("Session null");
		return false;
	}
	if (sess.UID == null || sess.UID == '') {

		console.log("Invalid UID");
		return false;
	} else if (sess.Role < '1' || sess.Role > '3') {

		console.log("Invalid role");
		return false;
	}
	return true;
}

module.exports.DateToStr = function(dt) {
    console.log(dt);
     var str =  dt.getDate();
var months = ['Jan','Feb', "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
"Oct", "Nov", "Dec"]
str = str +" "+months[dt.getMonth()];
str = str +" "+dt.getFullYear();
return str;
}
module.exports.GetUserFolder = function(role) {

	var navLink = "elements/";
	console.log("Role: "+role);
	switch (role) {
	case '1':
		navLink += 'cp/nav.html';
		return navLink;
	case '2':
		navLink += 'rc/nav.html';
		return navLink;
	case '3':
		navLink += 'ur/nav.html';
		return navLink;
	}
}

module.exports.validateDate = function(data, msg) {
	return true;
}

module.exports.validateRDate = function(data, msg) {
	return true;
}

module.exports.validateText = function(data, msg) {
	return true;
}
module.exports.validateRText = function(data, msg) {
	return true;
}
module.exports.validateNum = function(data, msg) {
	return true;
}
module.exports.validateRNum = function(data, msg) {
	return true;
}
module.exports.validateAlpaNum = function(data, msg) {
	return true;
}
module.exports.validateRAlpaNum = function(data, msg) {
	return true;
}
module.exports.validateEmail = function(data, msg) {
	return true;
}
module.exports.validateREmail = function(data, msg) {
	return true;
}
module.exports.validateNum = function(data, msg) {
	return true;
}
module.exports.validateNum = function(data, msg) {
	return true;
}
