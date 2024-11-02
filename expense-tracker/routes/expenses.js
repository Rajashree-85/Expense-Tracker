const express=require('express');
const Expense=require('../models/expenseModel');
const router=express.Router();

router.post('/',(req,res)=>{
    const {description,amount,category}=req.body;
    Expense.create(req.user.id,description,amount,category,(err)=>{
        if(err) 
            return res.status(400).json({message:'Failed to add expense'});
        res.status(201).json({message:'Expense added'});
    });

});

router.get('/',(req,res)=>{
    Expense.getByUser(req.user.id,(err,expenses)=>{
        if(err)
            return res.status(400).json({message:'Could not retrieve expense'});
        res.status(200).json(expenses);
    });
});


router.put('/:id',(req,res)=>{
    const {description,amount,category}=req.body;
    Expense.update(req.params.id,description,amount,category,(err)=>{
        if(err)
            return res.status(400).json({message:'Could not update expense'});
        res.status(200).json({message:'Updation successful'});
    });
})

router.delete('/:id',(req,res)=>{
    Expense.delete(req.params.id,(err)=>{
        if (err)
            return res.status(400).json({message:'Could not delete'});
        res.status(200).json({message:'Deleted expense'});
    });
});

module.exports=router;