const DB = require('../db');
const bcrypt = require('bcryptjs');
// const genPass = require('generate-password');
const jwt = require('jsonwebtoken');

class UserController { 

  async loginUser(req, res){
    // console.log('try login')
    const {email, password} = req.body
    // console.log('data:', email, password)
    try {
      let q = await DB.query(`SELECT * FROM users WHERE email = $1`, [email])
      const user = q.rows[0]
      if (!user) return res.status(400).json({ message: 'User not found' })
      
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })
      // console.log('user:', user);
      
      let exp = '1h'
      const jwtSecret = process.env.jwtSecret
      const token = jwt.sign(
        { userId: user.id },
        jwtSecret,
        { expiresIn: exp }
      )
      user.password = 'fuckYou';
      // console.log('user:', user);
      res.json({ token, user:user })
    } catch (e) {
      res.status(500).json({ message: 'Something wrong' })
    }
  }

  async createUser(req, res){
    // console.log('try create user');
    // save to DB
    const { firstname, lastname, email, phone, usertype_id, store_id, password } = req.body;

    const user = await DB.query(`SELECT * FROM users WHERE email = $1`, [email]);
    console.log('already exists user:', user);
    if (user.rows && user.rows.length) {
      return res.status(400).json({ message: 'Same user already exist' });
    }

    const sql = 'INSERT INTO users (firstname, lastname, email, phone, usertype_id, store_id, password, ts) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    let ts = new Date();
    const hashedPassword = await bcrypt.hash(password, 12);
    // console.log('add user:', firstname, lastname, email, phone, usertype_id, store_id, hashedPassword, ts);
    try{
      const newUser = await DB.query(sql, [firstname, lastname, email, phone, usertype_id, store_id, hashedPassword, ts]);
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
    // console.log('update data');
    const id = req.params.id
    const { firstname, lastname, email, phone, usertype_id, store_id, password } = req.body;
    // console.log('update user:', firstname, lastname, email, phone, usertype_id, store_id, password);
    const oldUser = await DB.query(` SELECT password FROM users WHERE id = $1`, [id]);
    // const hashedPassword = await bcrypt.hash(password, 12)
    let hashedPassword = oldUser.rows[0].password;
    if (password && password !== '') hashedPassword = await bcrypt.hash(password, 12);

    try{
      const user = await DB.query(`
        UPDATE users 
        SET 
          firstname   = $2, 
          lastname    = $3, 
          email       = $4, 
          phone       = $5, 
          usertype_id = $6,
          store_id    = $7,
          password    = $8
        WHERE id = $1 
        RETURNING *
      `, [id, firstname, lastname, email, phone, usertype_id, Number(store_id), hashedPassword]);
      return res.send(user.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }

  }

  async deleteUser(req, res){
    const id = req.params.id
    // console.log('delete user by ID:', id)
    // const sql = `DELETE FROM users WHERE id = $1 RETURNING name;`
    const sql =`UPDATE users SET archive = true WHERE id = $1;`    
    const userDeleted = await DB.query(sql, [id])
    // console.log(`user #${id} with SQL: ${sql}. `, userDeleted)
    res.send(userDeleted) 
  }

  async getRoles(req, res){

  }
}

module.exports = new UserController()