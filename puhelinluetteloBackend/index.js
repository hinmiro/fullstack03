import express from "express";

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

const app = express();
app.use(express.json());

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const data = persons.find((person) => person.id === req.params.id);
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

const PORT = 3001;
const URL = "127.0.0.1";
app.listen(PORT, () => {
  console.log(`
    Server
    is
    running
    on
    http://${URL}:${PORT}`);
});
