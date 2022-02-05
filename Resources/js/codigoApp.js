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

            let formData = new FormData(form);
            let transactionObj = convertFormDataToTransactionObj(formData);
            saveTransactionObjLStorage(transactionObj);
            createTableWithData(transactionObj);
            form.reset();

        } else {
            alert("Debes ingresar un monto mayor a 0")
        }
    } else {
        alert("Debes rellenar los campos");
    }
})

document.addEventListener("DOMContentLoaded", function (event) {
    basicCategoriesDefoult();
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

    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    //busco el indice / la posicion de la transaccion que quiero eliminar que coincida con el transactionId que pasamos como parametro incial
    let transactionIdexInArray = transactionObjArr.findIndex(element => element.transactionId === transactionRowId);
    transactionObjArr.splice(transactionIdexInArray, 1);
    let miTransactionArrayJSON = JSON.stringify(transactionObjArr);
    localStorage.setItem("transactionData", miTransactionArrayJSON);


}

//Botones y categorias con su respectivo localStorage

function basicCategoriesDefoult() {
    if (JSON.parse(localStorage.getItem("Categories")) === [] || JSON.parse(localStorage.getItem("Categories")) === null) {
        let categoriesArray = [];
        categoriesArray.push("Trabajo", "Comidas", "Salidas");
        let categoriesArrayJSON = JSON.stringify(categoriesArray);
        localStorage.setItem("Categories", categoriesArrayJSON);
    }
    else {
        let categoriesArray = JSON.parse(localStorage.getItem("Categories"));
        let categoriesArrayJSON = JSON.stringify(categoriesArray);
        localStorage.setItem("Categories", categoriesArrayJSON);
    }
    insertCategory();
}

function insertCategory() {
    let categories = JSON.parse(localStorage.getItem("Categories"));
    categories.forEach(element => {
        let optionHtml = `<option data-numberid="${numberId}" value="${element}"> ${element} </option>`;
        selectElement.insertAdjacentHTML("beforeend", optionHtml);
        numberId++;
    })
};

//Boton que añade categorias
addButton.addEventListener("click", () => {
    let categoryUser = prompt("¿Qué categoria deseas agregar?");
    if (categoryUser === "" || categoryUser === null || categoryUser === " ") {
        alert("Debes ingresar una categoria")
    }
    else {
        AddCategory(categoryUser);
    }
});

//Funcion que añade categorias
function AddCategory(categoryUser) {
    let allCategory = JSON.parse(localStorage.getItem("Categories"));
    allCategory.push(categoryUser);
    let allCategoryArrJSON = JSON.stringify(allCategory);
    localStorage.setItem("Categories", allCategoryArrJSON);
    let optionHtml = `<option data-numberid="${numberId}"value="${categoryUser}"> ${categoryUser} </option>`;
    selectElement.insertAdjacentHTML("beforeend", optionHtml);
    numberId++;
}



//Boton que elimina categorias
deleteButton.addEventListener("click", () => {
    let categoriesArray = JSON.parse(localStorage.getItem("Categories"));

    for (elements in categoriesArray) {
        alert(`Para esta Categoria: ${categoriesArray[elements]}\n
            indice: ${elements} `);
    }

    let deleteElement = prompt("Ingrese el indice de la categoria que desea eliminar:");

    if (deleteElement == 0 || deleteElement == 1 || deleteElement == 2 ||
        deleteElement === "" || deleteElement === null || deleteElement === " ") {

        alert("No puedes eliminar esas categorias");
    }

    else {
        //Elimino la categoria seleccionada segun su posicion en el array y su data-attribute
        categoriesArray.splice(deleteElement, 1);
        let categoriesArrayJSON = JSON.stringify(categoriesArray);
        localStorage.setItem("Categories", categoriesArrayJSON);
        deleteAndRefresHtmlCategories();
    }
})

//Elimino las categorias de HTML y las ingreso nuevamente sin la categoria eliminada
//Se actualizan los numberId a las categorias
function deleteAndRefresHtmlCategories() {
    numberId = 0;
    let categoriesArray = JSON.parse(localStorage.getItem("Categories"));
    for (i = 0; i <= categoriesArray.length; i++) {
        let deleteOption = document.querySelector(`[data-numberid="${i}"]`);
        deleteOption.remove();
    }
    categoriesArray.forEach(element => {
        let optionHtml = `<option data-numberid="${numberId}" value="${element}"> ${element} </option>`;
        selectElement.insertAdjacentHTML("beforeend", optionHtml);
        numberId++;
    })
}