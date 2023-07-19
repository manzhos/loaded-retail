const DB = require('../db');
const bcrypt = require('bcryptjs');
// const genPass = require('generate-password');
// const jwt = require('jsonwebtoken');

class UserController {  
  async createUser(req, res){
    // save to DB
    const { firstname, lastname, email, phone, usertype_id, password } = req.body;

    const user = await DB.query(`SELECT * FROM users WHERE email = $1`, [email]);
    console.log('already exists user:', user);
    if (user.rows && user.rows.length) {
      return res.status(400).json({ message: 'Same user already exist' });
    }

    const sql = 'INSERT INTO users (firstname, lastname, email, phone, usertype_id, password, ts) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    let ts = new Date();
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('add user:', firstname, lastname, email, phone, usertype_id, hashedPassword, ts);
    try{
      const newUser = await DB.query(sql, [firstname, lastname, email, phone, usertype_id, hashedPassword, ts]);
      // console.log('new user', newUser.rows[0]);
      return res.send(newUser.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }

  }
  
  async getUsers(req, res){
    // console.log('get all users');
    const sql = `SELECT * FROM users WHERE NOT archive LIMIT 1000`;
    const users = await DB.query(sql);
    // console.log('USERS:', users.rows);
    return res.send(users.rows);
  }

  async getUser(req, res){

  }

  async updateUser(req, res){

  }

  async deleteUser(req, res){
    const id = req.params.id
    console.log('delete user by ID:', id)
    // const sql = `DELETE FROM users WHERE id = $1 RETURNING name;`
    const sql =`UPDATE users SET archive = true WHERE id = $1;`    
    const userDeleted = await DB.query(sql, [id])
    // console.log(`user #${id} with SQL: ${sql}. `, userDeleted)
    res.send(userDeleted) 
  }

  async loginUser(req, res){

  }

  async getRoles(req, res){

  }
}

module.exports = new UserController()