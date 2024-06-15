import "dotenv/config";
import {
  getPersons,
  postPerson,
  removePerson,
  updatePerson,
  findById,
} from "./models/persons.js";
import { errorHandler } from "./middlewares.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      req.method === "POST" ? JSON.stringify(req.body) : "",
    ].join(" ");
  }),
);

app.get("/api/persons", async (req, res) => {
  return res.status(200).json(await getPersons());
});

app.get("/api/persons/:id", async (req, res, next) => {
  const person = await findById(req.params.id).catch((err) => next(err));
  person
    ? res.status(200).json(person)
    : res.status(400).json({ message: "Not found" });
});

app.get("/info", async (req, res) => {
  const now = new Date();
  const persons = await getPersons();
  res
    .status(200)
    .send(
      `Phonebook has ${persons.length} persons information in it. <br>${now} `,
    );
});

app.delete("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  await removePerson(id).catch((err) => next(err));
  const persons = await getPersons();
  if (persons) {
    return res.status(200).json(persons);
  } else {
    return res.sendStatus(404);
  }
});

app.post("/api/persons", async (req, res, next) => {
  const body = req.body;

  if (!body.number || !body.name) {
    return res
      .status(400)
      .json({ message: "There needs to be number and name" });
  }
  const persons = await getPersons();
  const duplicate = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase(),
  );

  if (duplicate) {
    return res.status(400).json({ message: "Name must be unique" });
  }

  return postPerson(body.name, body.number)
    .then((result) => {
      return res.status(201).json(result);
    })
    .catch((err) => {
      return next(err);
    });
});

app.put("/api/persons/:id", async (req, res, next) => {
  const id = req.params.id;
  const person = req.body;
  const updatedPerson = await updatePerson(id, person).catch((err) =>
    next(err),
  );
  return res.status(200).json(updatedPerson);
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const URL = "127.0.0.1";
app.listen(PORT, () => {
  console.log(`
    Server is running on http://${URL}:${PORT}`);
});
