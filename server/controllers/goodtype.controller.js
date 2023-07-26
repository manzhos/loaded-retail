const DB = require('../db');

class GoodTypeController {  
  async createGoodType(req, res){
    // save to DB
    const { product_type } = req.body;
    console.log('add product_type:', product_type);

    const goodType = await DB.query(`SELECT * FROM product_types WHERE product_type = $1`, [product_type]);
    // console.log('already exists store:', goodType);
    if (goodType.rows && goodType.rows.length) {
      return res.status(400).json({ message: 'Same store already exist' });
    }

    const sql = 'INSERT INTO product_types (product_type, ts) VALUES ($1, $2) RETURNING *';
    let ts = new Date();
    try{
      const newGoodType = await DB.query(sql, [product_type, ts]);
      // console.log('newGoodType', newGoodType.rows[0]);
      return res.send(newGoodType.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async getGoodTypes(req, res){
    // console.log('get all product types');
    const sql = `
      SELECT 
        id,
        product_type
      FROM product_types
      WHERE archive IS NOT true
      ORDER BY product_type
      LIMIT 9999
      `;
    const productTypes = await DB.query(sql);
    // console.log('productTypes:', productTypes.rows);
    return res.send(productTypes.rows);
  }

  async getGoodType(req, res){

  }

  async updateGoodType(req, res){
    // update data
    const id = req.params.id
    const { product_type } = req.body;
    // console.log('update goodType:', product_type);
    try{
      const goodType = await DB.query(`UPDATE product_types SET product_type=$2 WHERE id = $1 RETURNING *`, [id, product_type]);
      return res.send(goodType.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async deleteGoodType(req, res){
    const id = req.params.id
    console.log('delete product_type by ID:', id)
    // const sql = `DELETE FROM product_types WHERE id = $1 RETURNING *;`
    const sql =`UPDATE product_types SET archive = true WHERE id = $1;`    
    const productTypeDeleted = await DB.query(sql, [id])
    // console.log(`product #${id} with SQL: ${sql}. `, productTypeDeleted)
    res.send(productTypeDeleted) 
  }

}

module.exports = new GoodTypeController()