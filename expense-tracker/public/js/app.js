const API_URL='http://loalhost:5000/api';
let token='';

document.addEventListener('DOMContentLoaded',()=>{
    const savedToken=localStorage.getItem('token');
    if(savedToken){
        token=savedToken;
        showExpenseTracker();
    }
});

function toggleForm(form){
    document.getElementById('register').style.display=form === 'register'?'block':'none';
    document.getElementById('login').style.display=form === 'login'?'block':'none';
}

async function registerUser() {
    const email=document.getElementById('registerEmail').value;
    const pwd=document.getElementById('registerPassword').value;

    const res=await fetch(`${API_URL}/auth/register`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,pwd})
    });

    if(res.ok){
        alert('Registration Successful!! PLease Login');
        toggleForm('login');
    }else{
        alert('Registration Failed');
    }
    
}

async function loginUser() {
    const email=document.getElementById('loginEmail').value;
    const pwd=document.getElementById('loginPassword').value;

    const res=await fetch(`${API_URL}/auth/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,pwd})
    })
    if(res.ok){
        const data=await res.json();
        //console.log(data);
        token=data.token;
        localStorage.setItem('token',token);
        showExpenseTracker();
    }else{
        alert('Login Failed');
    }
}

async function showExpenseTracker() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('register').style.display = 'none';
  document.getElementById('expenseTracker').style.display = 'block';
  fetchExpenses();
}

async function addExpense() {
    const description=document.getElementById('description').value;
    const amount=parseFloat(document.getElementById('amount').value);
    const category=document.getElementById('category').value;

    if(isNaN(amount)||amount<=0){
        alert('Please enter a valid amount');
        return;
    }
    const res=await fetch(`${API_URL}/expenses`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':token
        },
        body:JSON.stringify({description,amount,category})
    });
    if(res.ok){
        fetchExpenses();
        clearForm();
    }else{
        alert('Failed to add expense');
    }
}

async function fetchExpenses() {
    const res=await fetch(`${API_URL}/expenses`,{
        headers:{'Authorization':token}
    });
    if(res.ok){
        const expenses=await res.json();
        displayExpenses(expense);
    }else{
        alert('Failed to load');
    }
}

let updatingId=null;

async function updateExpense(id) {
    const res=await fetch(`${API_URL}/expenses`,{
        headers:{'Authorization':token}
    });
    if(res.ok){
        const expenses=await res.json();
        const expense=expenses.find(exp=>exp.id===id);
        if(expense){
            document.getElementById('description').value=expense.description;
            document.getElementById('amount').value=expense.amount;
            document.getElementById('category').value=expense.category;
            updatingId=id;

            document.getElementById('addButton').style.display='none';
            document.getElementById('editButton').style.display='inline';
        }
    }else{
        alert('Failed to load');
    }
}

async function saveExpense() {
    if(!updatingId){
        alert('No expense selected');
    }
    const description=document.getElementById('description').value;
    const amount=parseFloat(document.getElementById('amount').value);
    const category=document.getElementById('category').value;

    if(isNaN(amount)||amount<=0){
        alert('Please enter a valid amount');
        return;
    }
    try{
        const res=await fetch(`${API_URL}/expenses/${updatingId}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization':token
            },
            body:JSON.stringify({description,amount,category})
        });
        if(res.ok){
            fetchExpenses();
            updatingId=null;
            clearForm();
            document.getElementById('addButton').style.display='inline';
            document.getElementById('editButton').style.display='none';
        }else{
            alert('Failed to update expense');
        }
    }catch(error){
        alert(`An error occurred: ${error.message}`);
    }
}

function clearForm(){
    document.getElementById('description').value = '';
      document.getElementById('amount').value = '';
      document.getElementById('category').value = '';
}

function displayExpenses(expenses){
    const expensesList=document.getElementById('expensesList');
    expensesList.innerHTML='';
    let total=0;

    expenses.forEach(expense => {
        total+=expense.amount;
        const element=document.createElement('li');
        element.classList.add('expense-item');
        element.innerHTML=` <span>${expense.amount} (${expense.category})</span>
        <button onclick="updateExpense(${expense.id})">Edit</button>
        <button onclick="deleteExpense(${expense.id})">Delete</button>`;
        expensesList.appendChild(element);
    });
    document.getElementById('totalAmount').textContent=total;
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
  }