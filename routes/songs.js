const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

const schema = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .required(),
  artist: Joi.string()
    .min(3)
    .required()
});

let songs = [];

const validateData = (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).json({ message: result.error.message });
  }
  next();
};

//Song API
router.param("id", (req, res, next, id) => {
  let song = songs.find(song => song.id === parseInt(id));
  if (!song) {
    const error = new Error(`Unable to find song with id: ${id}`);
    error.statusCode = 404;
    return next(error);
  }
  req.song = song;
  next();
});

//return list of all songs
router.get("/", (req, res, next) => {
  res.status(200).json(songs);
});

//create a new song, and return new song
router.post("/", validateData, (req, res) => {
  if (!req.body) {
    return next(new Error("Unable to create song"));
  }

  let newSong = {
    id: songs.length + 1,
    name: req.body.name,
    artist: req.body.artist
  };
  songs.push(newSong);
  res.status(201).json(newSong);
});

//return a song with id
router.get("/:id", (req, res, next) => {
  res.status(200).json(req.song);
});

//update a song with id, and return edited song
router.put("/:id", validateData, (req, res, next) => {
  req.song.name = req.body.name;
  req.song.artist = req.body.artist;
  res.status(200).json(req.song);
});

//delete a song with id, and return deleted song
router.delete("/:id", (req, res, next) => {
  let index = songs.indexOf(req.song);
  songs.splice(index, 1);
  res.status(200).json(req.song);
});

//Add error handler for songs router to return 404 on failure at any route
router.use((err, req, res, next) => {
  res.status(404).json({ message: err.message });
});

module.exports = router;
