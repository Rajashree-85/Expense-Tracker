const db = require('../config/db');

const Expense = {
  create: (userId, description, amount, category, callback) => {
    db.run(
      'INSERT INTO expenses (userId, description, amount, category) VALUES (?, ?, ?, ?)',
      [userId, description, amount, category],
      callback
    );
  },

  getByUser: (userId, callback) => {
    db.all('SELECT * FROM expenses WHERE userId = ? ORDER BY created_at DESC', [userId], callback);
  },

  delete: (id, callback) => {
    db.run('DELETE FROM expenses WHERE id = ?', [id], callback);
  },

  update: (id, description, amount, category, callback) => {
    db.run(
      'UPDATE expenses SET description = ?, amount = ?, category = ? WHERE id = ?',
      [description, amount, category, id],
      callback
    );
  }
};

module.exports = Expense;