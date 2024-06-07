import express from "express";
import morgan from "morgan";

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "Bruce Banner",
    number: "53-223-554335",
    id: 5,
  },
];

/*morgan.token("method", (req, res) => req.method);
morgan.token("url", (req, res) => req.url);
morgan.token("status", (req, res) => res.statusCode);
morgan.token("content-length", (req, res) => res.get("Content-Length"));
morgan.token("response-time", (req, res) => res.get("response-time"));
morgan.token("body", (req, res) =>
  req.method === "POST" ? JSON.stringify(req.body) : "",
);

const formatString =
  ":method :url :status :res[content-length] - :response-time ms :body";*/

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

const app = express();
app.use(express.json());

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

//app.use(morgan(formatString));

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const data = persons.find((person) => person.id === parseInt(req.params.id));
  data
    ? res.status(200).json(data)
    : res.status(400).json({ message: "Not found" });
});

app.get("/info", (req, res) => {
  const now = new Date();
  res
    .status(200)
    .send(
      `Phonebook has ${persons.length} persons information in it. <br>${now} `,
    );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personToRem = persons.find((person) => person.id === id);

  if (personToRem) {
    persons = persons.filter((person) => person.id !== id);
    res.sendStatus(200);
  } else {
    res.status(400).json({ message: "Not found" });
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.number || !body.name) {
    return res
      .status(400)
      .json({ message: "There needs to be number and name" });
  }

  const duplicate = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase(),
  );

  if (duplicate) {
    return res.status(400).json({ message: "Name must be unique" });
  }

  const personObject = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(personObject);
  res.status(201).json({ message: "New person added", persons: persons });
});

const PORT = 3001;
const URL = "127.0.0.1";
app.listen(PORT, () => {
  console.log(`
    Server is running on http://${URL}:${PORT}`);
});
