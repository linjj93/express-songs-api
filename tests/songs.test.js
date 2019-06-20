const app = require("../app");
const request = require("supertest");

describe("routes/songs", () => {
  it("POST /songs should return a new song object", () => {
    requestBody = { name: "test song", artist: "rhianna" };
    responseBody = { id: 1, name: "test song", artist: "rhianna" };
    return request(app)
      .post("/songs")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(201);
        expect(response.body).toEqual(responseBody);
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
    responseBody = { id: 1, name: "test song", artist: "rhianna" };

    return request(app)
      .get("/songs/1")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("GET /songs/:id should return 404 if song id does not exist", () => {
    return request(app)
      .get("/songs/10")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({
          message: "Unable to find song with id: 10"
        });
      });
  });

  it("PUT /songs should return the updated song", () => {
    requestBody = { name: "updated song", artist: "rhianna" };
    responseBody = { id: 1, name: "updated song", artist: "rhianna" };

    return request(app)
      .put("/songs/1")
      .send(requestBody)

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(responseBody);
      });
  });

  it("PUT /songs/:id should return 404 if song id does not exist", () => {
    requestBody = {
      id: 10,
      name: "updated song",
      artist: "rhianna"
    };

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

  it("DELETE /songs/:id should return the deleted song", () => {
    expected = { id: 1, name: "updated song", artist: "rhianna" };

    return request(app)
      .delete("/songs/1")

      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual(expected);
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

describe("Validation checks", () => {
  it("POST /songs should return error message when name is less than 3 characters long", async () => {
    requestBody = {
      name: "AB",
      artist: "CDE"
    };

    const response = await request(app)
      .post("/songs")
      .send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual(
      '{"message":"child \\"name\\" fails because [\\"name\\" length must be at least 3 characters long]"}'
    );
  });

  it("POST /songs should return error message when artist is less than 3 characters long", async () => {
    requestBody = {
      name: "ABC",
      artist: "DE"
    };

    const response = await request(app)
      .post("/songs")
      .send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual(
      '{"message":"child \\"artist\\" fails because [\\"artist\\" length must be at least 3 characters long]"}'
    );
  });

  it("POST /songs should return error message when there is no name", async () => {
    requestBody = {
      artist: "DE"
    };

    const response = await request(app)
      .post("/songs")
      .send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual(
      '{"message":"child \\"name\\" fails because [\\"name\\" is required]"}'
    );
  });

  it("POST /songs should return error message when there is no artist", async () => {
    requestBody = {
      name: "ABC"
    };

    const response = await request(app)
      .post("/songs")
      .send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.text).toEqual(
      '{"message":"child \\"artist\\" fails because [\\"artist\\" is required]"}'
    );
  });
});
