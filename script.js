"use strict";

let books = [];
let booksCount = 0;

if (localStorage.getItem("books")) {
  books = JSON.parse(localStorage.getItem("books"));
}

class Book {
  constructor(name, price, author) {
    this.name = name;
    this.price = price;
    this.author = author;
  }
}

class Author {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

// Start
showInitialPage();

// PAGES 
function showInitialPage() {
  document.body.innerHTML = `
    <div class="container vh-100 d-flex justify-content-center align-items-center">
      <div class="card p-4 shadow" style="width:420px">
        <h3 class="text-center mb-3">Book System</h3>

        <input id="BooksNumberInput" min=1 type="number" class="form-control mb-3" placeholder="Number of books">

        <div id="countError" class="text-danger small mb-2"></div>

        <button id="submitBtn" class="btn btn-primary w-100">Submit</button>
      </div>
    </div>
  `;

  document.getElementById("submitBtn").onclick = handleBooksCount;
}

function showAddBookForm() {
  document.body.innerHTML = `
    <div class="container w-50 mt-5">
      <h3 class="text-center mb-4">Add Book</h3>

      <input id="bookNameInput" class="form-control mb-1" placeholder="Book Name">
      <div id="bookNameError" class="text-danger small mb-2"></div>

      <input id="bookPriceInput" type="number" class="form-control mb-1" placeholder="Price">
      <div id="bookPriceError" class="text-danger small mb-2"></div>

      <input id="authorNameInput" class="form-control mb-1" placeholder="Author Name">
      <div id="authorNameError" class="text-danger small mb-2"></div>

      <input id="authorEmailInput" type="email" class="form-control mb-1" placeholder="Author Email">
      <div id="authorEmailError" class="text-danger small mb-2"></div>

      <button id="addBookBtn" class="btn btn-info w-100 mt-3">Add Book</button>
      <div id="addError" class="text-danger text-center small mt-2"></div>
    </div>
  `;

  document.getElementById("addBookBtn").onclick = handleAddBook;
}

function showTablePage() {
  document.body.innerHTML = `
    <div class="container mt-5">
      <input id="searchInput" class="form-control w-50 m-auto mb-4" placeholder="Search by book name">

      <table class="table table-bordered text-center">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Author</th>
            <th>Email</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>

      <button class="btn btn-primary w-100" onclick="showInitialPage()">Add More Books</button>
    </div>
  `;

  document.getElementById("searchInput").oninput = function () {
    renderTable(this.value);
  };

  renderTable();
}

// book count , add book  
function handleBooksCount() {
  const input = document.getElementById("BooksNumberInput");
  const count = Number(input.value);
  const error = document.getElementById("countError");

  error.textContent = "";

  if (!count || count <= 0) {
    error.textContent = "Enter a valid number";
    return;
  }

  booksCount = count;
  showAddBookForm();
}

function handleAddBook() {
  if (!validateInput()) {
    document.getElementById("addError").textContent = "Fix errors above";
    return;
  }

  books.push(
    new Book(
      bookNameInput.value.trim(),
      bookPriceInput.value,
      new Author(authorNameInput.value.trim(), authorEmailInput.value.trim())
    )
  );

  booksCount--;

  if (booksCount === 0) {
    localStorage.setItem("books", JSON.stringify(books));
    showTablePage();
  } else {
    showAddBookForm();
  }
}

// validations
function validateInput() {
  clearErrors();
  let valid = true;

  if (bookNameInput.value.trim().length < 3) {
    bookNameError.textContent = "Min 3 characters";
    valid = false;
  }

  if (bookPriceInput.value <= 0) {
    bookPriceError.textContent = "Invalid price";
    valid = false;
  }

  if (!/^[A-Za-z\s]{3,}$/.test(authorNameInput.value.trim())) {
    authorNameError.textContent = "Letters only";
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmailInput.value.trim())) {
    authorEmailError.textContent = "Invalid email";
    valid = false;
  }

  return valid;
}

function clearErrors() {
  bookNameError.textContent = "";
  bookPriceError.textContent = "";
  authorNameError.textContent = "";
  authorEmailError.textContent = "";
  addError.textContent = "";
}

//table
function renderTable(search = "") {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  books.forEach((b, i) => {
    if (!b.name.toLowerCase().includes(search.toLowerCase())) return;

    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${b.name}</td>
        <td>${b.price}</td>
        <td>${b.author.name}</td>
        <td>${b.author.email}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editRow(${i})">Update</button>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteBook(${i})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// update
function editRow(index) {
  const tbody = document.getElementById("tableBody");
  const row = tbody.rows[index];
  const book = books[index];

  row.innerHTML = `
    <td>${index + 1}</td>
    <td><input value="${book.name}" class="form-control"></td>
    <td><input type="number" value="${book.price}" class="form-control"></td>
    <td><input value="${book.author.name}" class="form-control"></td>
    <td><input value="${book.author.email}" class="form-control"></td>
    <td>
      <button class="btn btn-success btn-sm" onclick="saveRow(${index})">Save</button>
    </td>
    <td>
      <button class="btn btn-secondary btn-sm" onclick="renderTable()">Cancel</button>
    </td>
  `;
}

function saveRow(index) {
  const row = document.getElementById("tableBody").rows[index];
  const inputs = row.querySelectorAll("input");

  books[index].name = inputs[0].value;
  books[index].price = inputs[1].value;
  books[index].author.name = inputs[2].value;
  books[index].author.email = inputs[3].value;

  localStorage.setItem("books", JSON.stringify(books));
  renderTable();
}

//delete
function deleteBook(index) {
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  renderTable();
}
