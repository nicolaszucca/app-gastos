//Tambien puedo usar querySelector (tiempo real ?¿)
const form = document.getElementById("transactionForm");
const selectElement = document.getElementById("categoria");
const deleteButton = document.getElementById("removeCategory");
const addButton = document.getElementById("addCategory");

let numberId = 0;

form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (form.transactionSelect.value && form.description.value && form.monto.value && form.categoria.value) {
        if (form.monto.value >= 0) {
            //Creo un objeto formData que me devuelva el value de todos los inputs del form
            let formData = new FormData(form);
            let transactionObj = convertFormDataToTransactionObj(formData);
            saveTransactionObjLStorage(transactionObj);
            createTableWithData(transactionObj);
            //Devolvemos el formulario al estado inicial.
            form.reset();
        } else {
            alert("Debes ingresar un monto mayor a 0")
        }
    } else {
        alert("Debes rellenar los campos");
    }
})

document.addEventListener("DOMContentLoaded", function (event) {
    saveLocalStorageCategories();
    let transactionArrayObj = JSON.parse(localStorage.getItem("transactionData")) || [];
    transactionArrayObj.forEach(arrayObjElement => {
        createTableWithData(arrayObjElement);
    });


})

function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
    let newTransactionId = JSON.parse(lastTransactionId) + 1;
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}

function convertFormDataToTransactionObj(formData) {
    let transactionSelect = formData.get("transactionSelect");
    let description = formData.get("description");
    let monto = formData.get("monto");
    let categoria = formData.get("categoria");
    let transactionId = getNewTransactionId();

    return {
        "transactionSelect": transactionSelect,
        "description": description,
        "monto": monto,
        "categoria": categoria,
        "transactionId": transactionId

    }
}

function createTableWithData(transactionObj) {
    //Ref: Cuando hacemos un getElementByID no obtenemos el HTML y lo guardamos en variable, sino que guardamos una REFERENCIA a ese codigo
    let tableRef = document.getElementById("transactionTable");

    let tableRowRef = tableRef.insertRow(-1);
    tableRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"]);

    tableCellRef = tableRowRef.insertCell(0);
    tableCellRef.textContent = transactionObj["transactionSelect"];

    tableCellRef = tableRowRef.insertCell(1);
    tableCellRef.textContent = transactionObj["description"];

    tableCellRef = tableRowRef.insertCell(2);
    tableCellRef.textContent = transactionObj["monto"];

    tableCellRef = tableRowRef.insertCell(3);
    tableCellRef.textContent = transactionObj["categoria"];

    tableCellRef = tableRowRef.insertCell(4);
    let createDeleteButton = document.createElement("button");
    createDeleteButton.textContent = "Eliminar";
    tableCellRef.appendChild(createDeleteButton);

    createDeleteButton.addEventListener("click", (event) => {
        let transactionRow = event.target.parentNode.parentNode;
        let transactionRowId = JSON.parse(transactionRow.getAttribute("data-transaction-id"));
        transactionRow.remove();
        deleteDataFromLocalStorage(transactionRowId);

    })
}

function saveTransactionObjLStorage(transactionObj) {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
    myTransactionArray.push(transactionObj);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);
    localStorage.setItem("transactionData", transactionArrayJSON);
}

function deleteDataFromLocalStorage(transactionRowId) {
    //obtengo transacciones de mi base de datos
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    //busco el indice / la posicion de la transaccion que quiero eliminar que coincida con el transactionId que pasamos como parametro incial
    let transactionIdexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionRowId);
    //Elimino el elemento de esa posicion del array
    transactionObjArr.splice(transactionIdexInArray, 1);
    //Convierto nuevamente a JSON para guardar en el localStorage
    let miTransactionArrayJSON = JSON.stringify(transactionObjArr);
    //Guardo en el localStorage
    localStorage.setItem("transactionData", miTransactionArrayJSON);


}

//Botones y categorias con su respectivo localStorage

function saveLocalStorageCategories() {
    let allCategory = JSON.parse(localStorage.getItem("Categories")) || []
    let allCategoryJSON = JSON.stringify(allCategory);
    localStorage.setItem("Categories", allCategoryJSON);
    insertCategory();
}

function insertCategory() {
    let categories = JSON.parse(localStorage.getItem("Categories"));
    categories.forEach(element => {
        let optionHtml = `<option data-NumberId="${numberId}"> ${element} </option>`;
        selectElement.insertAdjacentHTML("beforeend", optionHtml);
        numberId++;
    })
};

//Boton que añade categorias
addButton.addEventListener("click", () => {
    let categoryUser = prompt("¿Qué categoria deseas agregar?");
    //validacion del campo
    if (categoryUser === "" || categoryUser === null || categoryUser === " ") {
        alert("Debes ingresar una categoria")
    }
    else {
        AddCategory(categoryUser);
    }
});

//añado categorias
function AddCategory(categoryUser) {
    //recupero del local storage el array con categorias
    let allCategory = JSON.parse(localStorage.getItem("Categories"))
    //le hago un push con la categoria nueva del usuario al array
    allCategory.push(categoryUser);
    //Al array con la categoria nueva le hago un JSON.Stringify()
    let allCategoryArrJSON = JSON.stringify(allCategory);
    //Y guardo en el localStorage
    localStorage.setItem("Categories", allCategoryArrJSON);
    //Pone el data-atributteID y la categoria que haya elegido el usuario en un elemento HTML y lo inserta en la ultima fila del elemento SELECT OPTION 
    let optionHtml = `<option data-NumberId="${numberId}"> ${categoryUser} </option>`;
    selectElement.insertAdjacentHTML("beforeend", optionHtml);
    numberId++;

}

//Boton elimina categorias
deleteButton.addEventListener("click", () => {
    let categoriesArray = JSON.parse(localStorage.getItem("Categories"));

    for (elements in categoriesArray) {
        alert(`Para esta Categoria: ${categoriesArray[elements]}\n
        indice: ${elements} `);
    }

    let deleteElement = prompt("¿Qué elemento desesas eliminar? Ingresa su indice");

    if (deleteElement === "" || deleteElement === null || deleteElement === " ") {
        alert("Debes ingresar el indice del elemento que quieras eliminar");

    } else {
        //ELIMINA UNA DE LAS OPCIONES DE LAS CATEGORIAS
        categoriesArray.splice(deleteElement, 1);
        let categoriesArrayJSON = JSON.stringify(categoriesArray);
        localStorage.setItem("Categories", categoriesArrayJSON);
        let deleteHtmlElement = document.querySelector(`[data-NumberId="${deleteElement}"]`);
        deleteHtmlElement.remove();
    }
})


