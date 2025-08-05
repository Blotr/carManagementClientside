const addButton      = document.getElementById('addCarBtn');
const clearTableBtn  = document.getElementById('clearTableBtn');
const tableBody      = document.getElementById('carTableBody');

const nameEl  = document.getElementById('carName');
const yearEl  = document.getElementById('carYear');
const priceEl = document.getElementById('carPrice');
const modelEl = document.getElementById('carModel');

const regexName  = /^[A-Za-z\s]{2,}$/;
const regexYear  = /^\d{4}$/;
const regexPrice = /^\d+(\.\d{1,2})?$/;
const regexModel = /^[A-Za-z0-9\- ]+$/;

let cars = [];
let editingIndex = null;

function readForm() {
    return {
        name:  nameEl.value.trim(),
        year:  yearEl.value.trim(),
        price: priceEl.value.trim(),
        model: modelEl.value.trim(),
    };
}

function validateInputs({ name, year, price, model }) {
    const nameOk  = regexName.test(name);
    const yearOk  = regexYear.test(year);
    const priceOk = regexPrice.test(price);
    const modelOk = regexModel.test(model);

    nameEl.classList.toggle('is-invalid',  !nameOk);
    yearEl.classList.toggle('is-invalid',  !yearOk);
    priceEl.classList.toggle('is-invalid', !priceOk);
    modelEl.classList.toggle('is-invalid', !modelOk);

    return nameOk && yearOk && priceOk && modelOk;
}

function clearForm() {
    nameEl.value  = '';
    yearEl.value  = '';
    priceEl.value = '';
    modelEl.value = '';

    nameEl.classList.remove('is-invalid');
    yearEl.classList.remove('is-invalid');
    priceEl.classList.remove('is-invalid');
    modelEl.classList.remove('is-invalid');
}

function formatPrice(n) {
    const num = Number(n);
    return isNaN(num) ? n : num.toFixed(2);
}

function renderTable() {
    tableBody.innerHTML = '';

    cars.forEach((car, index) => {
        const row = tableBody.insertRow();
        row.dataset.index = index;

        row.insertCell(0).textContent = car.name;
        row.insertCell(1).textContent = car.year;
        row.insertCell(2).textContent = formatPrice(car.price);
        row.insertCell(3).textContent = car.model;
        row.insertCell(4).textContent = `${car.getAge()} years old`;

        const actionsCell = row.insertCell(5);
        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex justify-content-center gap-2';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn btn-warning btn-sm';
        editBtn.addEventListener('click', () => startEdit(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.addEventListener('click', () => deleteRow(index));

        wrapper.appendChild(editBtn);
        wrapper.appendChild(deleteBtn);
        actionsCell.appendChild(wrapper);
    });
}

function startEdit(index) {
    const car = cars[index];
    nameEl.value  = car.name;
    yearEl.value  = car.year;
    priceEl.value = car.price;
    modelEl.value = car.model;

    editingIndex = index;
    addButton.textContent = 'Save';
}

function deleteRow(index) {
    if (editingIndex === index) {
        editingIndex = null;
        addButton.textContent = 'Add';
        clearForm();
    }
    cars.splice(index, 1);
    renderTable();
}

addButton.addEventListener('click', function () {
    const data = readForm();
    if (!validateInputs(data)) return;

    const car = createCar(data.name, data.year, data.price, data.model);

    if (editingIndex === null) {
        cars.push(car);
    } else {
        cars[editingIndex] = car;
        editingIndex = null;
        addButton.textContent = 'Add';
    }

    renderTable();
    clearForm();
});

clearTableBtn.addEventListener('click', function () {
    cars = [];
    editingIndex = null;
    addButton.textContent = 'Add';
    clearForm();
    renderTable();
});

renderTable();