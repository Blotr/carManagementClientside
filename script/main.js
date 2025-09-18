const API_BASE = "http://localhost:3000/api/cars";

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
let editingId = null;

async function loadCars() {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        cars = data.map(car => {
            const carObj = createCar(car.name, car.year, car.price, car.model);
            carObj.id = car.id;
            return carObj;
        });
        renderTable();
    } catch (error) {
        alert('Failed to load cars from server.');
    }
    
}

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
  editingId = car.id;
  addButton.textContent = 'Save';
}

async function deleteRow(index) {
    try {
        await fetch(`${API_BASE}/${cars[index].id}`, { method: 'DELETE' });
        if (editingIndex === index) {
            editingIndex = null;
            addButton.textContent = 'Add';
            clearForm();
        }
    } catch (error) {
        alert('Failed to delete car from server.');
    }

    cars.splice(index, 1);
    renderTable();
    }


addButton.addEventListener('click', async function () {
  const data = readForm();
  if (!validateInputs(data)) return;
                                                                                      
  const payload = {
    name:  data.name,
    year:  Number(data.year),
    price: Number(data.price),
    model: data.model
  };

    if (editingId !== null) {
        // UPDATE (PUT)
        console.log('PUT payload:', payload);
        await fetch(`${API_BASE}/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
  } else {
    // CREATE (POST)
    await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  await loadCars();
  clearForm();
  addButton.textContent = 'Add';
  editingIndex = null;
  editingId = null;
});



clearTableBtn.addEventListener('click', function () {
    cars = [];
    editingIndex = null;
    addButton.textContent = 'Add';
    clearForm();
    renderTable();
});

loadCars();