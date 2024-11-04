const API_URL = 'http://localhost:5000/api';
let token = '';

document.addEventListener('DOMContentLoaded', () => {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    token = savedToken;
    showExpenseTracker();
  }
 document.getElementById('editButton').addEventListener('click', saveEditedExpense);
});

function toggleForm(form) {
  document.getElementById('register').style.display = form === 'register' ? 'block' : 'none';
  document.getElementById('login').style.display = form === 'login' ? 'block' : 'none';
}

async function registerUser() {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    alert('Registration successful! Please log in.');
    toggleForm('login');
  } else {
    alert('Registration failed');
  }
}

async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json();
    token = data.token;
    localStorage.setItem('token', token);
    showExpenseTracker();
  } else {
    alert('Login failed');
  }
}

function showExpenseTracker() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('register').style.display = 'none';
  document.getElementById('expenseTracker').style.display = 'block';
  fetchExpenses();
}

async function addExpense() {

  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  if(isNaN(amount)||amount<=0){
    alert("Please enter a valid number.");
    return;
  }

  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ description, amount, category })
  });

  if (res.ok) {
    fetchExpenses();
    clearForm();
  } else {
    alert('Failed to add expense');
  }
}

async function fetchExpenses() {
  const res = await fetch(`${API_URL}/expenses`, {
    headers: { 'Authorization': token }
  });

  if (res.ok) {
    const expenses = await res.json();
    displayExpenses(expenses);
  } else {
    alert('Failed to load expenses');
  }
}

let editingExpenseId=null;

async function updateExpense(id) {
    const res = await fetch(`${API_URL}/expenses`, {
        headers: { 'Authorization': token }
      });
    
      if (res.ok) {
        const expenses = await res.json();
    
    const expense=expenses.find(exp=>exp.id===id);
    if(expense){
        document.getElementById('description').value=expense.description;
        document.getElementById('amount').value=expense.amount;
        document.getElementById('category').value=expense.category;
        editingExpenseId=id;

        document.getElementById('addButton').style.display='none';
        document.getElementById('editButton').style.display='inline';
    }}
    else{
      alert("Failed to load expense details");
    }
  }

async function saveEditedExpense(){
 if(!editingExpenseId){
  alert("No expense selected for editing");
}
    var description=document.getElementById('description').value;
    var amount=parseFloat(document.getElementById('amount').value);
    var category=document.getElementById('category').value;

    if(isNaN(amount)||amount<=0){
        alert("Please enter a valid amount.");
        return;
    }
    try{
    const res = await fetch(`${API_URL}/expenses/${editingExpenseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ description, amount, category })
      });
      if (res.ok) {
        fetchExpenses();  
        editingExpenseId = null;  
        clearForm();
        document.getElementById('addButton').style.display='inline';
        document.getElementById('editButton').style.display='none';
      } else {
        alert(`Failed to update expense: ${responseBody.message || 'Unknown error'}`);
    }
} catch (error) {
    alert(`An error occurred: ${error.message}`);
}
}

function clearForm() {
      document.getElementById('description').value = '';
      document.getElementById('amount').value = '';
    }

function displayExpenses(expenses) {
  const expensesList = document.getElementById('expensesList');
  expensesList.innerHTML = '';
  let totalAmount = 0;

  expenses.forEach(expense => {
    totalAmount += expense.amount;
    const item = document.createElement('li');
    item.classList.add('expense-item');
    item.innerHTML = `
      <span>${expense.description} - ₹${expense.amount} (${expense.category})</span>
      <div class="buttons">
      <button onclick="updateExpense(${expense.id})">Edit</button>
      <button onclick="deleteExpense(${expense.id})">Delete</button>
      </div>
    `;
    expensesList.appendChild(item);
  });

  document.getElementById('totalAmount').textContent = totalAmount;
}

async function deleteExpense(id) {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  });

  if (res.ok) {
    fetchExpenses();
  } else {
    alert('Failed to delete expense');
  }
}

function logout() {
  token = '';
  localStorage.removeItem('token');
  document.getElementById('expenseTracker').style.display = 'none';
  toggleForm('login');
  document.getElementById('loginEmail').value='';
  document.getElementById('loginPassword').value='';
}