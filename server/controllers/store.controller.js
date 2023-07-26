const DB = require('../db');

class StoreController {  
  async createStore(req, res){
    // save to DB
    const { name } = req.body;
    // console.log('add store:', name);

    const store = await DB.query(`SELECT * FROM stores WHERE name = $1`, [name]);
    console.log('already exists store:', store);
    if (store.rows && store.rows.length) {
      return res.status(400).json({ message: 'Same store already exist' });
    }

    const sql = 'INSERT INTO stores (name, ts) VALUES ($1, $2) RETURNING *';
    let ts = new Date();
    try{
      const newStore = await DB.query(sql, [name, ts]);
      // console.log('new store', newStore.rows[0]);
      return res.send(newStore.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async getStores(req, res){
    // console.log('get all stores');
    const sql = `SELECT * FROM stores LIMIT 1000`;
    const stores = await DB.query(sql);
    // console.log('STORES:', stores.rows);
    return res.send(stores.rows);
  }

  async getStore(req, res){

  }

  async updateStore(req, res){
    // update data
    const id = req.params.id
    const { name } = req.body;
    // console.log('update store name:', name);
    try{
      const store = await DB.query(`UPDATE stores SET name=$2 WHERE id = $1 RETURNING *`, [id, name]);
      return res.send(store.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async deleteStore(req, res){
    const id = req.params.id
    console.log('delete store by ID:', id)
    const sql = `DELETE FROM stores WHERE id = $1 RETURNING name;`
    // const sql =`UPDATE stores SET archive = true WHERE id = $1;`    
    const storeDeleted = await DB.query(sql, [id])
    // console.log(`store #${id} with SQL: ${sql}. `, storeDeleted)
    res.send(storeDeleted) 
  }

}

module.exports = new StoreController()