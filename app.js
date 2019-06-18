const express = require("express");
const app = express();
const PORT = 3001;git 

app.use(express.json());

let songs = [
  { id: 1, name: "Bohemian Rhapsody", artist: "Queen" },
  { id: 2, name: "Demons", artist: "Imagine Dragons" },
  { id: 3, name: "Someone Like You", artist: "Adele" }
];
let id = songs.length === 0 ? 0 : Number(songs[songs.length - 1].id);

//return list of all songs
app.get("/songs", (req, res) => {
  res.status(200).send(songs);
});

//create a new song, and return new song
app.post("/songs", (req, res) => {
  const nextId = id + 1;
  const nextSong = { id: nextId, name: req.body.name, artist: req.body.artist };
  songs.push(nextSong);
  res.status(201).send(nextSong);
});

//return a song with id
app.get("/songs/:id", (req, res) => {
  res.status(200).json(songs.find(song => song.id === Number(req.params.id)));
});

//find vs filter

//edit a song with id, and return edited song
app.put("/songs/:id", (req, res) => {
  const songToBeUpdated = songs.find(song => song.id === Number(req.params.id));
  songToBeUpdated.name ? (songToBeUpdated.name = req.body.name) : null;
  songToBeUpdated.artist ? (songToBeUpdated.artist = req.body.artist) : null;
  res.status(200).send(songToBeUpdated);
});

//delete a song with id, and return deleted song
app.delete("/songs/:id", (req, res) => {
  const songToBeReturned = songs.filter(song => song.id === req.params.id)[0];
  songs.splice(songs.indexOf(songToBeReturned), 1);
  res.status(200).send(songToBeReturned);
});

app.listen(PORT);
console.log(`Server listening on port ${PORT}`);
