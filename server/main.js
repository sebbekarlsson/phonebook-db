const express = require("express");
const cors = require('cors');
const fs = require("fs");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const DATABASE_NAME = "db.json";

function getDatabase() {
  if (fs.existsSync(DATABASE_NAME)) {
    const contents = fs.readFileSync(DATABASE_NAME, 'utf8');
    return JSON.parse(contents);
  } else {
    return { people: [] };
  }
}

function saveDatabase(db) {
  fs.writeFileSync(DATABASE_NAME, JSON.stringify(db));
}

function createPerson(firstname, lastname, phone) {
  const db = getDatabase();

  const id = db.people.length;

  db.people.push({
    firstname, lastname, phone, id
  });

  saveDatabase(db);
}
function deletePerson(id) {
  const db = getDatabase();

  db.people = db.people.filter(person => person.id !== id);

  saveDatabase(db);
}

app.post("/create", function(req, res){
  const data = req.body; // formular datan

  createPerson(data.firstname, data.lastname, data.phone);

  res.json({ ok: true });
});

app.delete("/delete", function(req, res){
  const data = req.body; // formular datan

  console.log(data);
  deletePerson(data.id);

  res.json({ ok: true });
});

// http://localhost:3000/list
// rack upp handen om ni ser person information dar.
app.get("/list", function(req, res){
  res.json(getDatabase());
});

app.listen(port, function(){
  console.log(`http://localhost:${port}`)
});
