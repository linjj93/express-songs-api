const app = require("../app");
const request = require("supertest");

describe("routes/songs", () => {
  it("POST /songs should return a new song object", () => {
    const requestBody = { name: "test song", artist: "rhianna" };
    const responseBody = { id: 1, name: "test song", artist: "rhianna" };

    return request(app)
      .post("/songs")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("POST /songs should return 400 if it is missing a field", () => {
    const requestBody = { name: "test song" };

    return request(app)
      .post("/songs")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ message: '"artist" is required' });
      });
  });

  it("GET /songs should return an array containing one song", () => {
    return request(app)
      .get("/songs")

      .then(response => {
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toEqual(1);
      });
  });

  it("GET /songs/:id should return the song with id", () => {
    const responseBody = { id: 1, name: "test song", artist: "rhianna" };

    return request(app)
      .get("/songs/1")

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("GET /songs/:id should return 404 if song id does not exist", () => {
    return request(app)
      .get("/songs/10")

      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          message: "Unable to find song with id: 10"
        });
      });
  });

  it("PUT /songs should return the updated song", () => {
    const requestBody = { name: "updated song", artist: "rhianna" };
    const responseBody = { id: 1, name: "updated song", artist: "rhianna" };

    return request(app)
      .put("/songs/1")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("PUT /songs/:id should return 404 if song id does not exist", () => {
    const requestBody = { id: 10, name: "updated song", artist: "rhianna" };

    return request(app)
      .put("/songs/10")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          message: "Unable to find song with id: 10"
        });
      });
  });

  it("PUT /songs should return 400 if there is missing a field", () => {
    const requestBody = { id: 1, name: "test song" };

    return request(app)
      .put("/songs/1")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(400);
        expect(response.body).toEqual({ message: '"artist" is required' });
      });
  });

  it("DELETE /songs/:id should return the deleted song", () => {
    const responseBody = { id: 1, name: "updated song", artist: "rhianna" };

    return request(app)
      .delete("/songs/1")

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("DELETE /songs/:id should return 404 if song id does not exist", () => {
    return request(app)
      .delete("/songs/10")

      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          message: "Unable to find song with id: 10"
        });
      });
  });

  it("GET /songs should return an empty array", () => {
    return request(app)
      .get("/songs")

      .then(response => {
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toEqual(0);
      });
  });
});
