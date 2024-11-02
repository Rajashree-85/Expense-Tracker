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

app.put('/api/expenses/:id', authRoutes, async (req, res) => {
    const { id } = req.params;
    const { description, amount, category } = req.body;
  
    try {
      const expense = await Expense.findById(id);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });
  
      expense.description = description;
      expense.amount = amount;
      expense.category = category;
      await expense.save();
  
      res.json({ message: 'Expense updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

app.listen(5000,()=>console.log("Server running on http://localhost:5000"));