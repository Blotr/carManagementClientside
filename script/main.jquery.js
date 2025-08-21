// jQuery version of car management
// Requires: jQuery, car.js (for createCar and classes)

(function ($) {
  $(function () {
    const $name = $('#carName');
    const $year = $('#carYear');
    const $price = $('#carPrice');
    const $model = $('#carModel');
    const $addBtn = $('#addCarBtn');
    const $clearBtn = $('#clearTableBtn');
    const $tbody = $('#carTableBody');

    // If the page doesn't have the car table, do nothing
    if ($tbody.length === 0) return;

    const regexName = /^[A-Za-z\s]{2,}$/;
    const regexYear = /^\d{4}$/;
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    const regexModel = /^[A-Za-z0-9\- ]+$/;

    let cars = [];
    let editingIndex = null;

    function readForm() {
      return {
        name: $name.val().trim(),
        year: $year.val().trim(),
        price: $price.val().trim(),
        model: $model.val().trim(),
      };
    }

    function validateInputs({ name, year, price, model }) {
      const nameOk = regexName.test(name);
      const yearOk = regexYear.test(year);
      const priceOk = regexPrice.test(price);
      const modelOk = regexModel.test(model);

      $name.toggleClass('is-invalid', !nameOk);
      $year.toggleClass('is-invalid', !yearOk);
      $price.toggleClass('is-invalid', !priceOk);
      $model.toggleClass('is-invalid', !modelOk);

      return nameOk && yearOk && priceOk && modelOk;
    }

    function clearForm() {
      $name.val('');
      $year.val('');
      $price.val('');
      $model.val('');
      $name.removeClass('is-invalid');
      $year.removeClass('is-invalid');
      $price.removeClass('is-invalid');
      $model.removeClass('is-invalid');
    }

    function formatPrice(n) {
      const num = Number(n);
      return isNaN(num) ? n : num.toFixed(2);
    }

    function renderTable() {
      const rows = cars
        .map((car, index) => {
          return `
            <tr data-index="${index}">
              <td>${car.name}</td>
              <td>${car.year}</td>
              <td>${formatPrice(car.price)}</td>
              <td>${car.model}</td>
              <td>${car.getAge()} years old</td>
              <td>
                <div class="d-flex justify-content-center gap-2">
                  <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Edit</button>
                  <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
                </div>
              </td>
            </tr>`;
        })
        .join('');
      $tbody.html(rows);
    }

    function startEdit(index) {
      const car = cars[index];
      if (!car) return;
      $name.val(car.name);
      $year.val(car.year);
      $price.val(car.price);
      $model.val(car.model);
      editingIndex = index;
      $addBtn.text('Save');
    }

    function deleteRow(index) {
      if (editingIndex === index) {
        editingIndex = null;
        $addBtn.text('Add');
        clearForm();
      }
      cars.splice(index, 1);
      renderTable();
    }

    // Handlers
    $addBtn.on('click', function () {
      const data = readForm();
      if (!validateInputs(data)) return;

      const car = createCar(data.name, data.year, data.price, data.model);

      if (editingIndex === null) {
        cars.push(car);
      } else {
        cars[editingIndex] = car;
        editingIndex = null;
        $addBtn.text('Add');
      }

      renderTable();
      clearForm();
    });

    $clearBtn.on('click', function () {
      cars = [];
      editingIndex = null;
      $addBtn.text('Add');
      clearForm();
      renderTable();
    });

    // Delegated events for dynamic buttons
    $tbody.on('click', '.edit-btn', function () {
      const index = Number($(this).data('index'));
      startEdit(index);
    });

    $tbody.on('click', '.delete-btn', function () {
      const index = Number($(this).data('index'));
      deleteRow(index);
    });

    // Initial render
    renderTable();
  });
})(jQuery);
