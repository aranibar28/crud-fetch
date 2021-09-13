// Crea elemento tipo nodo user
function createListUser(value) {
  const { name, sexo, grado, id } = value;
  const card = document.createElement("article");
  card.innerHTML = `
        <ul>
            <li><span>Nombre: </span>${name}</li>
            <li><span>Sexo: </span>${sexo}</li>
            <li><span>Grado: </span>${grado}</li>
            <li><button class="js_edit btn btn-warning">Editar</button> <button class="js_delete btn btn-danger" >Eliminar</button></li>
        </ul>
    `;

  card.querySelector(".js_edit").onclick = function () {
    const inpName = document.querySelector('input[type="text"]');
    const inpSex = document.querySelectorAll('input[type="radio"]');
    const slctGrade = document.querySelector("select");
    const inpHidden = document.querySelector('input[type="hidden"]');

    inpName.value = name;
    slctGrade.value = grado;
    inpHidden.value = id;
    inpSex.forEach(function (radio) {
      if (radio.value == sexo) radio.checked = true;
    });
  };

  card.querySelector(".js_delete").onclick = function () {
    if (confirm("Estas seguro que quieres elminar al usuario")) {
      card.remove();
      deleteUser(id);
    }
  };

  return card;
}

// Agrega elemtos al DOM
function addDom(element) {
  const appContainer = document.getElementById("app-container");
  appContainer.appendChild(element);
}

// Invocando usuarios registrados.
function getUsers() {
  fetch("http://localhost:3000/users")
    .then(function (promise) {
      return promise.json();
    })
    .then(function (users) {
      users.forEach((user) => addDom(createListUser(user)));
    })
    .catch(function (error) {
      console.log("error", error);
    });
}

// Crear usuarios.
function createUser(user) {
  console.log("create", user);
  fetch("http://localhost:3000/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(() => getUsers())
    .catch((error) => {
      console.log("error!!", error);
    });
}

// Editar usuarios
function editUser(user) {
  fetch(`http://localhost:3000/users/${user.id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then(() => getUsers())
    .catch((error) => {
      console.log("error!!", error);
    });
}

// Eliminar usuarios
function deleteUser(id) {
  fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });
}

function getSexValue(values) {
  const element = Array.from(values).find((element) => element.checked);
  return element.value;
}

// Registrar evento formularios y atrapar datos del formulario
function onSubmit() {
  const formRegister = document.querySelector(".js-register");
  const formEdit = document.querySelector(".js-edit");
  const inpName = document.querySelector('input[type="text"]');
  const inpSex = document.querySelectorAll('input[type="radio"]');
  const slctGrade = document.querySelector("select");
  const inpHidden = document.querySelector('input[type="hidden"]');

  formRegister.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    createUser({
      name: inpName.value,
      grado: slctGrade.value,
      sexo: getSexValue(inpSex),
    });
  };

  formEdit.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    editUser({
      name: inpName.value,
      grado: slctGrade.value,
      sexo: getSexValue(inpSex),
      id: inpHidden.value,
    });
  };
}

function main() {
  getUsers();
  onSubmit();
}

main();
