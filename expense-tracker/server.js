const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const authRoutes=require('./routes/auth');
const expenseRoutes=require('./routes/expenses');
const authMiddleware =require('./middleware/authMiddleware');

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth',authRoutes);
app.use('/api/expenses',authMiddleware,expenseRoutes);



app.listen(5000,()=>console.log("Server running on http://localhost:5000"));