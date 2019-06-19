const express = require("express");
const router = express.Router();

let songs = [];

//Song API
router.param("id", (req, res, next, id) => {
  //   if (typeof req.params.id !== "number") {
  //     req.invalidId = req.params.id;
  //     throw new Error("Invalid id");
  //   }
  let song = songs.find(song => song.id === parseInt(id));
  if (song === undefined) {
    throw new Error(`Unable to find song with id: ${id}`);
  }
  req.song = song;
  next();
});

router.use("/:id", (req, res, next) => {
  if (req.song) {
    next();
  } else {
    const err = new Error("Invalid id");
    next(err);
  }
});

//return list of all songs
router.get("/", (req, res) => {
  res.status(200).json(songs);
});

//create a new song, and return new song
router.post("/", (req, res) => {
  let newSong = {
    id: songs.length + 1,
    name: req.body.name,
    artist: req.body.artist
  };
  songs.push(newSong);
  res.status(201).json(newSong);
});

//return a song with id
router.get("/:id", (req, res) => {
  //   if (typeof req.params.id !== "number") {
  //     req.invalidId = req.params.id;
  //     throw new Error("Invalid id");
  //   }
  res.status(200).json(req.song);
});

//edit a song with id, and return edited song
router.put("/:id", (req, res) => {
  if (typeof req.params.id !== "number") {
    req.invalidId = req.params.id;
    throw new Error("Invalid id");
  }
  req.song.name = req.body.name;
  req.song.artist = req.body.artist;
  res.status(200).json(req.song);
});

//delete a song with id, and return deleted song
router.delete("/:id", (req, res) => {
  if (typeof req.params.id !== "number") {
    req.invalidId = req.params.id;
    throw new Error("Invalid id");
  }
  let songToDelete = req.song;
  let index = songs.indexOf(songToDelete);
  songs.splice(index, 1);
  res.status(200).json(songToDelete);
});

// Return HTTP status code 404
// Expected response: { message: “Unable to find song with id : xx” }

router.use("/:id", (err, req, res, next) => {
  res.status(404).json(err.message);

  //   if (err.message === "Invalid id") {
  //     res
  //       .status(404)
  //       .json({ message: `Unable to find song with id: ${req.invalidId}` });
  //   } else {
  //     next(err);
  //   }
});

router.use((err, req, res, next) => {
  res.status(500);
  res.send({ error: "Unknown error" });
});

module.exports = router;
