const db=require('../config/db');
const User={
    create:(email,password,callback)=>{
        db.run('INSERT INTO users (email,password) VALUES (?,?)',[email,password], callback);

    },

    findByEmail:(email,callback)=>{
        db.get('SELECT * FROM users WHERE email=?',[email],callback);
    }

};
module.exports=User;