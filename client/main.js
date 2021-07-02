const formElement = document.getElementById("form");
const tableElement = document.getElementById("table");

class Table {
  constructor(element) {
    this.element = element;
    this.body = element.querySelector("tbody");
  }

  createTd(value) {
    const td = document.createElement("td");
    td.innerText = value;
    return td;
  }

  createTr(columns) {
    const tr = document.createElement("tr");
    columns.forEach(col => tr.appendChild(col));
    return tr;
  }

  addRow(data) {
    const columns = Object.values(data).map(this.createTd);
    const tr = this.createTr(columns);
    tr.setAttribute("data-id", data.id);

    tr.addEventListener("click", function(event){
      fetch("http://localhost:3000/delete", {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: data.id })
      }).then(function(response){
        console.log(response);
        this.refresh();
      }.bind(this)).catch(function(response){
        console.log(response);
      }.bind(this));

    }.bind(this));

    this.body.appendChild(tr);
  }

  refresh() {
    fetch("http://localhost:3000/list").then(function(response){
      response.json().then(function(data){

        const list = data.people; // listan med personer
        this.body.innerHTML = "";
        list.forEach(function(person){
          this.addRow(person);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}
// rack upp handen nar ni ser information i tabellen
const table = new Table(tableElement);
table.refresh();

class Form {
  constructor(element, onSubmit) {
    this.element = element;
    this.button = element.querySelector("#button");
    this.fields = element.querySelectorAll("input[type='text']");

    this.button.addEventListener("click", function(event){
      event.preventDefault();
      onSubmit(this.fields);
    }.bind(this));
  }
}
const form = new Form(formElement, async function(fields){

  // rack upp handen nar ni har denna
  const data = Array.from(fields).reduce(function(prev, cur){
    let ret = typeof prev === "object" ? prev : {};
    ret[cur.name] = cur.value;
    return ret;
  }, {});

  const response = await fetch("http://localhost:3000/create", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const resBody = await response.json();
  table.refresh();
});
