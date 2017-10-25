const express = require('express');
const router = express.Router();
const Movies = require('../models/movies');

router.get('/', (req, res) => {
	Movies.find((err, movies) => {
		res.render('movies/index', {movies: movies});
	})
});

router.post('/', (req, res) => {
	Movies.create(req.body, (err, newMovie) => {
		if (err) {
			res.send('error');
		} else {
			console.log(newMovie);
			res.redirect('movies/');
		}
	})
});

router.get('/new', (req, res) => {
	res.render('movies/new', {});
});

router.get('/:index', (req, res) => {
	req.params.index = parseInt(req.params.index);
	Movies.find((err, movies) => {
		let ticker = 0;
		for (let i = 0; i < movies.length; i++){
			if (movies[i].id === req.params.index){
				res.render('movies/show', {movie: movies[i]});
			} else {
				ticker++;
				if (ticker === movies.length){
					res.redirect('/movies')
				}
			}
		}
	})
});

router.get('/:index/addchar', (req, res) => {
	Movies.findOne({id: req.params.index}, (err, foundMovie) =>{
		res.render('movies/addcharacters', {movie: foundMovie});
	})
})

router.put('/:index/addchar', (req, res) => {
	Movies.findOne({id: req.params.index}, (err, foundMovie) => {
		foundMovie.characters.push(req.body.name);
		foundMovie.save();
		res.redirect('/movies/:index');
	})
})

module.exports = router;
