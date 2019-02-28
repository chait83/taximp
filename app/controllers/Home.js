var xlsx = require('node-xlsx');

var fs = require('fs');
var MAST_COLS_DEFINE = {
	"TYPE" : 1,
	"NAME" : 0

};

var COLS_DEFINE = {
	"DATE" : 0,
	"NARRATION" : 1,
	"TYPE" : 2,
	"NAME" : 3,
	"AMT" : 4
};

function parseLedgerEntry(row) {

	var str = "";

	for (var index = COLS_DEFINE["NAME"]; index < row.length; index += 2) {

		var name = row[index];
		if (name != null) {
			name = name.replace("&", "&amp;");
		}
		str += '<ALLLEDGERENTRIES.LIST>\n';
		str += '<LEDGERNAME>' + name + '</LEDGERNAME>';
		str += '<REMOVEZEROENTRIES>NO</REMOVEZEROENTRIES>';
		str += '<LEDGERFROMITEM>NO</LEDGERFROMITEM>';
		str += '<ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>';
		str += '<AMOUNT>' + row[index + 1] + '</AMOUNT>';
		str += '</ALLLEDGERENTRIES.LIST>';
	}
	return str;
}

function parseLedger(data) {
	var company = data[0][0];
	var strXML = '<?xml version="1.0" encoding="UTF-8"?><ENVELOPE> <HEADER><TALLYREQUEST>Import Data</TALLYREQUEST> </HEADER> <BODY> <IMPORTDATA><REQUESTDESC> <REPORTNAME>All Masters</REPORTNAME> <STATICVARIABLES><SVCURRENTCOMPANY>'
			+ company
			+ '</SVCURRENTCOMPANY> </STATICVARIABLES></REQUESTDESC><REQUESTDATA>';
	for (var index = 2; index < data.length; index++) {
		row = data[index];
		strXML += '<TALLYMESSAGE xmlns:UDF="TallyUDF">';
		strXML += '<VOUCHER VCHTYPE="' + row[COLS_DEFINE["TYPE"]]
				+ '" ACTION="Create">';
		strXML += '<VOUCHERTYPENAME>' + row[COLS_DEFINE["TYPE"]]
				+ '</VOUCHERTYPENAME>';
		var date = "";
		if (row[COLS_DEFINE["DATE"]] != null) {
			var ary = row[COLS_DEFINE["DATE"]].split("-");
			if (ary.length == 3) {
				date = ary[2] + ary[1] + ary[0];
			}
		}
		var name = row[COLS_DEFINE["NAME"]];
		if (name != null) {
			name = name.replace("&", "&amp;");
		}
		strXML += '<DATE>' + date + '</DATE>';
		strXML += '<PARTYLEDGERNAME>' + name + '</PARTYLEDGERNAME>';
		strXML += '<NARRATION>' + row[COLS_DEFINE["NARRATION"]]
				+ '</NARRATION>';
		strXML += '<EFFECTIVEDATE>' + date + '</EFFECTIVEDATE>';
		if (row.length > COLS_DEFINE["AMT"]) {
			strXML += parseLedgerEntry(row);
		}
		strXML += "</VOUCHER></TALLYMESSAGE>\n";

	}

	strXML += "</REQUESTDATA> </IMPORTDATA></BODY></ENVELOPE>";
	return strXML;

}

function parseMaster(data) {
	var company = data[0][0];
	var strXML = '<?xml version="1.0" encoding="UTF-8"?><ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY> <IMPORTDATA><REQUESTDESC><REPORTNAME>All Masters</REPORTNAME><STATICVARIABLES><SVCURRENTCOMPANY>'
			+ company
			+ '</SVCURRENTCOMPANY></STATICVARIABLES></REQUESTDESC><REQUESTDATA>';
	for (var index = 2; index < data.length; index++) {
		row = data[index];
		var name = row[MAST_COLS_DEFINE["NAME"]];
		if (name != null) {
			name = name.replace("&", "&amp;");
		}
		var type = row[MAST_COLS_DEFINE["TYPE"]];
		if (type != null) {
			type = type.replace("&", "&amp;");
		}
		strXML += '\n<TALLYMESSAGE xmlns:UDF="TallyUDF">';
		strXML += '<LEDGER RESERVEDNAME="" NAME="' + name + '">';
		strXML += '<NAME.LIST>';
		strXML += '<NAME>' + name + '</NAME>';
		strXML += '</NAME.LIST>';
		strXML += '<ADDITIONALNAME>' + name + '</ADDITIONALNAME>';
		strXML += '<PARENT>' + type + '</PARENT>';
		strXML += '<ISBILLWISEON>No</ISBILLWISEON>';
		strXML += '<AFFECTSSTOCK>No</AFFECTSSTOCK>';
		strXML += '<SERVICECATEGORY/>';
		strXML += '</LEDGER>';
		strXML += '</TALLYMESSAGE>';
	}
	strXML += '</REQUESTDATA> </IMPORTDATA></BODY></ENVELOPE>';
	return strXML;

}
module.exports.convert = function(req, res) {
	let testFile;
	let uploadPath;
	var sess = req.session;
	console.log("In SaveNewTest");
	if (Object.keys(req.files).length == 0) {
		res.status(400).send('No files were uploaded.');
		return;
	}
	testFile = req.files.testFile;
	var Type = parseInt(req.body.rdType);
	var timeSt = Date.now();
	var fileName = testFile.name + "_" + timeSt;
	var fName = testFile.name.replace(".xlsx", "");
	uploadPath = __dirname + '/uploads/' + fName + "_" + timeSt + ".xlsx";
	testFile.mv(uploadPath, function(err) {
		try {
			console.log("saved file");
			var obj = xlsx.parse(uploadPath);
			var data = obj[0].data;
			var strXML ="";
			switch (Type) {
			case 0:
				strXML = parseMaster(data);
				break;
			case 1:
				strXML = parseLedger(data);
				break;
			default:
				res.render("Home.pug", {"msg":""});
				return;
			}
			

			var opFile = __dirname + "/convert/" + fName + "_" + timeSt
					+ ".xml";
			fs.writeFile(opFile, strXML, function(err) {
				if (err) {
					return console.log(err);
				}

				console.log("The file was saved!");
				res.download(opFile);
			})

		} catch (err) {
			res.render("Home.pug", {"msg":"Error in parsing the file"});
			console.log(err);
		}

	});

}
module.exports.index = function(req, res) {
	res.render("Home.pug", {"msg":"Upload data"});
}