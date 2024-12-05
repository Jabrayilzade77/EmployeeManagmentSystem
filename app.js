// Əvvəlcədən saxlanılmış istifadəçiləri və işçiləri localStorage-dan yükləyirik
let users = JSON.parse(localStorage.getItem('users')) || [];
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// HTML elementlərini seçirik
const authSection = document.getElementById('auth-section');
const homeSection = document.getElementById('home-section');
const adminSection = document.getElementById('admin-section');
const employeeList = document.getElementById('employeeList');
const welcomeUsername = document.getElementById('welcomeUsername');

// İstifadəçiləri localStorage-da saxla
function saveUsers() {
  localStorage.setItem('users', JSON.stringify(users));
}

// İşçiləri localStorage-da saxla
function saveEmployees() {
  localStorage.setItem('employees', JSON.stringify(employees));
}

// Admin səhifəsi üçün işçi siyahısını göstərmək
function updateEmployeeList() {
  employeeList.innerHTML = '';
  employees.forEach((employee, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
      ${employee.name} (${employee.role})
      <button class="btn btn-warning btn-sm float-end mx-2" onclick="editEmployee(${index})">Edit</button>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteEmployee(${index})">Delete</button>
    `;
    employeeList.appendChild(listItem);
  });
}

// İşçi əlavə et
function addEmployee() {
  const name = prompt("Enter employee name:");
  const role = prompt("Enter employee role:");
  const permission = prompt("Enter employee permission:");
  const contract = prompt("Enter employee contract:");

  const newEmployee = {
    name,
    role,
    permission,
    contract
  };

  employees.push(newEmployee);
  saveEmployees();
  updateEmployeeList();
}

// İşçi sil
function deleteEmployee(index) {
  employees.splice(index, 1);
  saveEmployees();
  updateEmployeeList();
}

// İşçi redaktə et
function editEmployee(index) {
  const employee = employees[index];
  const newName = prompt("Edit employee name:", employee.name);
  const newRole = prompt("Edit employee role:", employee.role);
  const newPermission = prompt("Edit employee permission:", employee.permission);
  const newContract = prompt("Edit employee contract:", employee.contract);

  employee.name = newName;
  employee.role = newRole;
  employee.permission = newPermission;
  employee.contract = newContract;

  saveEmployees();
  updateEmployeeList();
}

// Login funksiyası
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    if (user.role === 'admin') {
      authSection.classList.add('d-none');
      adminSection.classList.remove('d-none');
      updateEmployeeList();  // Admin səhifəsini yükləyirik
    } else {
      authSection.classList.add('d-none');
      homeSection.classList.remove('d-none');
      welcomeUsername.textContent = user.username;  // İstifadəçi adını göstəririk
    }
  } else {
    alert('Invalid username or password.');
  }
});


// İşçi əlavə etmə düyməsinə event listener əlavə edin
document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);

// addEmployee funksiyası:
function addEmployee() {
  const name = prompt("Enter employee name:").trim();
  const role = prompt("Enter employee role:").trim();
  const permission = prompt("Enter employee permission:").trim();
  const contract = prompt("Enter employee contract:").trim();

  if (!name || !role || !permission || !contract) {
    alert('All fields are required!');
    return;
  }

  const newEmployee = { name, role, permission, contract };
  employees.push(newEmployee);
  saveEmployees();
  updateEmployeeList();
}


// Register funksiyası
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;
  
  const userExists = users.some(u => u.username === username);
  if (userExists) {
    alert('User already exists.');
    return;
  }

  const role = 'admin';  // By default, all new users are 'user'
  users.push({ username, password, role });
  saveUsers();
  alert('Registration successful!');
});

// Logout funksiyaları
document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  authSection.classList.remove('d-none');
  homeSection.classList.add('d-none');
});

document.getElementById('logoutAdminBtn').addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  authSection.classList.remove('d-none');
  adminSection.classList.add('d-none');
});

// Sayfa yükləndikdə mövcud istifadəçini yoxla
if (currentUser) {
  if (currentUser.role === 'admin') {
    authSection.classList.add('d-none');
    adminSection.classList.remove('d-none');
    updateEmployeeList();  // Admin səhifəsini yükləyirik
  } else {
    authSection.classList.add('d-none');
    homeSection.classList.remove('d-none');
    welcomeUsername.textContent = currentUser.username;
  }
}
