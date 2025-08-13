const noflicker = document.getElementById('navbar-placeholder');
const cached = sessionStorage.getItem('navbarHTML');

if (cached) {
  noflicker.innerHTML = cached;
  noflicker.style.visibility = 'visible';
}

fetch('navbar.html')
  .then(res => res.text())
  .then(data => {
    if (data !== cached) {
      noflicker.innerHTML = data;
      sessionStorage.setItem('navbarHTML', data);
    }
    noflicker.style.visibility = 'visible';
  });


document.addEventListener("DOMContentLoaded", function() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;
      sessionStorage.setItem('navbarHTML', data);
    });
});

document.addEventListener("DOMContentLoaded", function() {
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
      document.getElementById('navbar-placeholder').style.visibility = 'visible';
    });
});