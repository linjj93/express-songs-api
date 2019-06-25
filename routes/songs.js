const Joi = require("joi");
const express = require("express");
const router = express.Router();

let songs = [];
const DELAY = 10;

//Integrate below methods in the route handlers with async and await
const getSongs = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(songs);
    }, DELAY);
  });
};

const createSong = requestBody => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let newSong = {
        id: songs.length + 1,
        name: requestBody.name,
        artist: requestBody.artist
      };

      songs.push(newSong);
      resolve(newSong);
    }, DELAY);
  });
};

const getSong = id => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let songFound = songs.find(song => song.id == parseInt(id));
      if (!songFound) {
        const error = new Error(`Unable to find song with id: ${id}`);
        error.statusCode = 404;
        reject(error);
      }
      return resolve(songFound);
    }, DELAY);
  });
};

const updateSong = (requestBody, songToUpdate) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      songToUpdate.name = requestBody.name;
      songToUpdate.artist = requestBody.artist;
      resolve(songToUpdate);
    }, DELAY);
  });
};

const deleteSong = songToDelete => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!songToDelete) {
        reject(new Error());
      }

      let index = songs.indexOf(songToDelete);
      songs.splice(index, 1);
      resolve(songToDelete);
    }, DELAY);
  });
};

//Song API
router.param("id", async (req, res, next, id) => {
  const songs = await getSongs().catch(e => next(e));
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
router.get("/", async (req, res, next) => {
  const songs = await getSongs().catch(e => next(e));
  res.status(200).json(songs);
});

//create a new song, and return new song
router.post("/", async (req, res, next) => {
  const validation = validateSong(req.body);
  if (validation.error) {
    let error = new Error(validation.error.details[0].message);
    error.statusCode = 400;
    return next(error);
  }

  const newSong = await createSong(req.body).catch(e => next(e));

  res.status(201).json(newSong);
});

//return a song with id
router.get("/:id", async (req, res, next) => {
  //   const songToFind = await getSong(req.song.id).catch(e => next(e));
  //   res.status(200).json(songToFind);
  res.status(200).json(req.song);
});

//update a song with id, and return edited song
router.put("/:id", async (req, res, next) => {
  const validation = validateSong(req.body);
  if (validation.error) {
    let error = new Error(validation.error.details[0].message);
    error.statusCode = 400;
    return next(error);
  }
  const song = await updateSong(req.body, req.song).catch(e => next(e));
  res.status(200).json(song);
});

//delete a song with id, and return deleted song
router.delete("/:id", async (req, res, next) => {
  const song = await deleteSong(req.song).catch(e => next(e));
  res.status(200).json(song);
});

//Add error handler for songs router to return error on failure at any route
router.use(function(err, req, res, next) {
  // If err has no error code, set error code to 500
  if (!err.statusCode) {
    err.statusCode = 500;
    err.message = { message: "Internal server error" };
  }

  // send back specified status code and message
  res.status(err.statusCode).json({ message: err.message });
});

function validateSong(song) {
  const schema = {
    id: Joi.number().integer(),
    name: Joi.string()
      .min(3)
      .required(),
    artist: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(song, schema);
}

module.exports = router;
