var express = require('express');
var router = express.Router();
var firebase = require("firebase");
var dateFormat = require('dateformat');

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

router.get('/', function(req, res, next) {
    res.redirect('boardList');
});

var config = {
    apiKey: "AIzaSyAEQU52QpJAg36VjnUVVLmIV7l70taXhTM",
    authDomain: "polarship-000.firebaseapp.com",
    databaseURL: "https://polarship-000.firebaseio.com",
    projectId: "polarship-000",
    storageBucket: "polarship-000.appspot.com",
    //storageBucket: 'gs://polarpractice-6cdd8.appspot.com',
    messagingSenderId: "1069408421511"
};
firebase.initializeApp(config);
var db = firebase.firestore();
//var storage = firebase.storage();


router.get('/boardList', function(req, res, next) {
    db.collection('board').orderBy("brddate", "desc").get()
        .then((snapshot) => {
            var rows = [];
            snapshot.forEach((doc) => {
                var childData = doc.data();
                //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
                rows.push(childData);
            });
            res.render('board3/boardList', {
                rows: rows
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
});

router.get('/boardList2', function(req, res, next){
    db.collection('board').orderBy("brddate", "desc").get()
        .then((snapshot) => {
            var rows = [];
            snapshot.forEach((doc) => {
                var childData = doc.data();
                //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
                rows.push(childData);
            });
            res.render('board3/boardList2', {
                rows: rows
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
})

router.get('/boardList3', function(req, res, next){
    db.collection('board').orderBy("brddate", "desc").get()
        .then((snapshot) => {
            var rows = [];
            snapshot.forEach((doc) => {
                var childData = doc.data();
                //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
                rows.push(childData);
            });
            res.render('board3/boardList3', {
                rows: rows
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
})

router.get('/boardRead', function(req, res, next) {
    db.collection('board').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();

            //childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd hh:mm");
            res.render('board3/boardRead', {
                row: childData
            });
        })
});


router.get('/boardForm', function(req, res, next) {
    if (!firebase.auth().currentUser) {
        res.redirect('loginForm');
        return;
    }
    if (!req.query.brdno) { // new
        res.render('board3/boardForm', {
            row: ""
        });
        return;
    }

    // update
    db.collection('board').doc(req.query.brdno).get()
        .then((doc) => {
            var childData = doc.data();
            res.render('board3/boardForm', {
                row: childData
            });
        })
});

router.post('/boardSave', function(req, res, next) {
    var user = firebase.auth().currentUser;
    if (!firebase.auth().currentUser) {
        res.redirect('loginForm');
        return;
    }
    var postData = req.body;
    if (!postData.brdno) { // new
        postData.brddate = Date.now();
        var doc = db.collection("board").doc();
        postData.brdno = doc.id;
        //postData.brdwriter = user.email;
        /*
        var testurl = storage.ref('img/'+postdata.brdimage).getDownloadURL();
        storage.ref('img/'+brdimage).getDownloadURL().then(function(url){
            testurl = url;
            document.querySelector('img').src = testurl;
        }).catch(function(error){
        });
        //postData.brdurl = "firebase.storage().ref('img/'+brdimage)";
        */
        doc.set(postData);
    } else { // update
        var doc = db.collection("board").doc(postData.brdno);
        doc.update(postData);
    }

    res.redirect('boardList');
});

router.get('/boardDelete', function(req, res, next) {
    if (!firebase.auth().currentUser) {
        res.redirect('loginForm');
        return;
    }
    db.collection('board').doc(req.query.brdno).delete()
    res.redirect('boardList');
});

router.get('/loginForm', function(req, res, next) {
    res.render('board3/loginForm');
});

router.post('/loginChk', function(req, res, next) {
    firebase.auth().signInWithEmailAndPassword(req.body.id, req.body.passwd)
       .then(function(firebaseUser) {
           res.redirect('boardList');
       })
      .catch(function(error) {
          res.redirect('loginForm');
      });
});

router.get('/main', function(req, res, next) {
    res.render('board3/main');
});

router.get('/introduction', function(req, res, next) {
    res.render('board3/introduction');
});


module.exports = router;
