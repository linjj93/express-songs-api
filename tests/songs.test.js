const app = require("../app");
const request = require("supertest");

//Fill in the test case below for the Songs API

const TEST_SONG_1 = {
  name: "Someone Like You",
  artist: "Adele"
};

const TEST_SONG_2 = {
  name: "Sugar",
  artist: "Maroon 5"
};

describe("routes/songs", () => {
  it("POST /songs should return a new song object", async () => {
    const postResponse = await request(app)
      .post("/songs")
      .send(TEST_SONG_1);
    const getResponse = await request(app).get("/songs/1");

    expect(getResponse.body).toMatchObject(TEST_SONG_1);
    expect(postResponse.status).toEqual(201);
    expect(postResponse.body).toMatchObject(TEST_SONG_1);
  });

  it("GET /songs should return a non empty array", async () => {
    const getSingleSongResponse = await request(app).get("/songs/1");
    expect(getSingleSongResponse.body).toMatchObject(TEST_SONG_1);
    const response = await request(app).get("/songs");
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy;
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toMatchObject(TEST_SONG_1);
  });

  it("GET /songs/:id should return song with id specified", async () => {
    const response = await request(app).get("/songs/1");
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(TEST_SONG_1);
    expect(response.body.id).toEqual(1);
  });

  it("PUT /songs/:id should return the updated song", async () => {
    const putResponse = await request(app)
      .put("/songs/1")
      .send(TEST_SONG_2);
    expect(putResponse.status).toEqual(200);
    expect(putResponse.body).toMatchObject(TEST_SONG_2);
    const getAllSongs = await request(app).get("/songs");
    expect(getAllSongs.body).toHaveLength(1);
    expect(getAllSongs.status).toEqual(200);
  });

  it("DELETE /songs/:id should return the deleted song", async () => {
    const deleteSong = await request(app).delete("/songs/1");
    expect(deleteSong.status).toEqual(200);
    expect(deleteSong.body).toMatchObject(TEST_SONG_2);

    const getRemainingSongs = await request(app).get("/songs");
    expect(getRemainingSongs.body.length).toEqual(0);
    expect(getRemainingSongs.status).toEqual(200);
  });

  it("GET /songs should return an empty array", async () => {
    const response = await request(app).get("/songs");
    expect(response.body.length).toEqual(0);
    expect(response.status).toEqual(200);
  });
});
