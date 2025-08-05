// ===== Model classes (global) =====
class Car {
  constructor(name, year, price) {
    this.name = name;
    this.year = year;
    this.price = price;
  }

  getAge(currentYear = new Date().getFullYear()) {
    const y = parseInt(this.year, 10);
    if (isNaN(y)) return '';
    return currentYear - y;
  }
}

class CarModel extends Car {
  constructor(name, year, price, model) {
    super(name, year, price);
    this.model = model;
  }
}

// Factory kept close to your original
function createCar(name, year, price, model) {
  return new CarModel(name, year, price, model);
}
