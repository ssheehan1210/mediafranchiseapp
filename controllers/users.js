const express = require('express');
const router = express.Router();
const Users = require('../models/user');

router.get('/', (req, res) => {
	console.log(req.session);
	Users.find((err, inp) => {
		if (err) {
			res.send('database error');
		} else {
			res.render('users/index', {users: inp});
		}
	})
});

router.get('/register', (req, res) => {
	res.render('users/register', {})
});

router.post('/register', (req, res) => {
	Users.findOne({username: req.body.username}, (err, input) => {
		if (!input) {
			const password = req.body.password;
			const userDbEntry = {};
			userDbEntry.username = req.body.username;
			userDbEntry.password = password;
			Users.create(userDbEntry, (err, user) => {
				if (err) {
					res.send('error');
				} else {
					req.session.logged = true;
					req.session.username = user.username;
					req.session.save();
					res.redirect('/');
				}
			})
		} else {
			res.send('Username already in use');
		}
	})
})

router.get('/login', (req, res) => {
	res.render('users/login', {});
})

router.post('/login', (req, res) => {
	console.log(req.body);
	Users.find((err, inp) => {
		let ticker = 0;
		for (let i = 0; i < inp.length; i++){
			if (inp[i].username === req.body.username){
				if (inp[i].password === req.body.password){
					req.session.logged = true;
					req.session.username = req.body.username;
					req.session.save();
					console.log(req.session);
					res.redirect('/users');
				} else {
					res.send('Sorry, that password was incorrect.');
				}
			} else {
				ticker++;
				if (ticker === inp.length){
					res.send('That user does not appear in our database.');
				}
			}
		}
	})
})

module.exports = router;
