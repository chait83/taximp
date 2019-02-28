require('../models/CandidateDb');
var util = require('../../miscUtil');
var mongoose = require('mongoose');
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var dbCandidate = mongoose.model('Candidate');
module.exports.createCandidate = function (req, res) {
    /*
    var sess = req.session;
    try {
        assert(util.validateSession(sess));
    } catch (err) {
        util.sendJSONresponse(res, 400, {
            "res": "Invalid session"
        });
        return;
    }*/
    try {
        var strName = req.body.Name;
        assert(util.validateRText(strName, "Full Name"));
        var strEM = req.body.EM;
        assert(util.validateREmail(strEM, "Email"));
        var strPH = req.body.PH;
        assert(util.validateRText(strPH, "Phone No"));

        var G = parseInt(req.body.G);
        assert(util.validateRNum(G, "Gender"));

        str = req.body.Qa;
        var aryQa = str.split(",");
        for (var index = 0; index <
            aryQa.length; index++) {
            var temp = aryQa[index];

            assert(util.validateRAlpaNum(temp, "Qualification"));
        }
        var WExp = parseFloat(req.body.WExp);
        assert(util.validateRNum(WExp, "Work Experience "));

        var strDoB = req.body.DoB;
        assert(util.validateRDate(strDoB, "Date of Birth"));

        var dtDoB = new Date(strDoB);
        var CTC = parseFloat(req.body.CTC);
        assert(util.validateRNum(CTC, "Current CTC"));
        var ECTC = parseFloat(req.body.ECTC);
        assert(util.validateRNum(ECTC, "Expected CTC"));

    } catch (err) {
        return;
    }
    dbCandidate.create({
        Name: strName,
        EM: strEM,
        PH: strPH,
        G: G,
        Qa: aryQa,
        WExp: WExp,
        DoB: dtDoB,
        CTC: CTC,
        ECTC: ECTC,

        // CUID: sess.UID,
        CUID: req.body.userid,
        st: 1
    }, function (err, op) {
        if (err) {
            console.log(err);
            util.sendJSONresponse(res, 400, {
                "res": "err",
                "ec": 4
            });
        } else {
            util.sendJSONresponse(res, 201, {
                "res": "OK",
                "id": op._id
            });
        }
    });
};


module.exports.editCandidate = function (req, res) {

    var sess = req.session;
    try {
        assert(util.validateSession(sess));
    } catch (err) {
        util.sendJSONresponse(res, 400, {
            "res": "Invalid session"
        });
        return;
    }

    if (!req.body.id) {
        util.sendJSONresponse(res, 404, {
            "res": "Id is required"
        });
        return;
    }
    var str;
    var ary;
    try {
        var data = {};

        var strName = req.body.Name;
        var strName = req.body.Name;
        assert(util.validateRText(strName, "Full Name"));
        data["Name"] = strName;

        var strEM = req.body.EM;
        var strEM = req.body.EM;
        assert(util.validateREmail(strEM, "Email"));
        data["EM"] = strEM;

        var strPH = req.body.PH;
        var strPH = req.body.PH;
        assert(util.validateRText(strPH, "Phone No"));
        data["PH"] = strPH;


        var G = parseInt(req.body.G);
        assert(util.validateRNum(G, "Gender"));

        data["G"] = G;

        str = req.body.Qa;
        var aryQa = str.split(",");
        for (var index = 0; index <
            aryQa.length; index++) {
            var temp = aryQa[index];

            assert(util.validateRAlpaNum(temp, "Qualification"));

        }
        data["Qa"] = aryQa;

        var strWExp = req.body.WExp;
        var WExp = parseFloat(req.body.WExp);
        assert(util.validateRNum(WExp, "Work Experience "));
        data["WExp"] = WExp;

        var strDoB = req.body.DoB;
        assert(util.validateRDate(DoB, "Date of Birth"));

        data["DoB"] = new Date(strDoB);

        var strCTC = req.body.CTC;
        var CTC = parseFloat(req.body.CTC);
        assert(util.validateRNum(CTC, "Current CTC"));
        data["CTC"] = CTC;

        var strECTC = req.body.ECTC;
        var ECTC = parseFloat(req.body.ECTC);
        assert(util.validateRNum(ECTC, "Expected CTC"));
        data["ECTC"] = ECTC;

    } catch (err) {
        return;
    }
    data["CUID"] = sess.UID;
    data["st"] = 2;
    data["upT"] = new Date();
    dbCandidate.updateOne({
        '_id': ObjectId(req.body.id)
    }, data, {
        upsert: false
    }, function (err, op) {
        if (err) {
            var opMsg = {
                "res": "err",
                "msg": err
            };
            util.sendJSONresponse(res, 404, opMsg);
        } else {
            util.sendJSONresponse(res, 200, {
                "res": "OK",
                "msg": op
            });
        }
    });
};

module.exports.delCandidate = function (req, res) {

    var sess = req.session;
    if (!req.body.id) {
        util.sendJSONresponse(res, 404, {
            "res": "err",
            "ec": 5
        });
        return;
    }

    try {
        assert(util.validateSession(sess));
    } catch (err) {
        util.sendJSONresponse(res, 400, {
            "res": "err",
            "ec": 4
        });
        return;
    }

    var data = {
        "st": 3
    }
    dbCandidate.updateOne({
        '_id': ObjectId(req.body.id)
    }, data, {
        upsert: false
    }, function (err, op) {
        if (err) {
            var opMsg = {
                "res": "err",
                "ec": 4
            };
            util.sendJSONresponse(res, 404, opMsg);
        } else {
            util.sendJSONresponse(res, 200, {
                "res": "OK",
                "msg": op
            });
        }
    });
};

module.exports.listCandidate = function (req, res) {
if (!req.body.search) {
    util.sendJSONresponse(res, 404, {
        "res": "Search term is empty"
    });
    return;
}
dbCandidate.agrregate({
        $match: {
            "":""
        }
    },
    function (err, op) {
        if (!op) {
            util.sendJSONresponse(res, 404, {
                "res": "err",
                "ec": 5
            });
            return;
        } else if (err) {
            util.sendJSONresponse(res, 400, {
                "res": "err",
                "ec": 4
            });
            return;
        }
        util.sendJSONresponse(res, 200, {
            "res": "OK",
            "msg": op
        });
    });
};

module.exports.findCandidate = function (req, res) {

    if (!req.body.search) {
        util.sendJSONresponse(res, 404, {
            "res": "err",
            "ec": 6
        });
        return;
    }
    dbCandidate.find(req.body.search)
        .exec(
            function (err, op) {
                if (!op) {
                    util.sendJSONresponse(res, 404, {
                        "res": "err",
                        "ec": 5
                    });
                    return;
                } else if (err) {
                    util.sendJSONresponse(res, 400, {
                        "res": "err",
                        "ec": 4
                    });
                    return;
                }
                util.sendJSONresponse(res, 200, {
                    "res": "OK",
                    "msg": op
                });
            });
};