const DB = require('../db');

class ProductController {  
  async createProduct(req, res){
    // save to DB
    const { product, producttype_id, cost } = req.body;

    const existsProduct = await DB.query(`SELECT * FROM products WHERE product = $1`, [product]);
    console.log('already exists product:', existsProduct);
    if (existsProduct.rows && existsProduct.rows.length) {
      return res.status(400).json({ message: 'Same product already exist' });
    }

    const sql = 'INSERT INTO products (product, producttype_id, cost, ts) VALUES ($1, $2, $3, $4) RETURNING *';
    let ts = new Date();
    console.log('add product:', product, producttype_id, cost, ts);
    try{
      const newProduct = await DB.query(sql, [product, producttype_id, cost, ts]);
      // console.log('new Product', newProduct.rows[0]);
      return res.send(newProduct.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async getProducts(req, res){
    // console.log('get all products');
    const sql = `
      SELECT 
        p.id,
        p.product,
        p.quantity,
        p.cost,
        p.ts,
        p.producttype_id,
        pt.product_type
      FROM products p
      JOIN product_types pt ON p.producttype_id = pt.id
      WHERE p.archive IS NOT true
      ORDER BY pt.product_type, p.product
      LIMIT 9999
      `;
    const products = await DB.query(sql);
    // console.log('products:', products.rows);
    return res.send(products.rows);
  }

  async getProduct(req, res){

  }

  async updateProduct(req, res){
    const id = req.params.id;
    const { product, producttype_id, cost } = req.body;
    if(!product) return;
    // console.log('update product', id);
    try{
      const updProduct = await DB.query(`
        UPDATE products 
        SET 
          product        = $2,  
          producttype_id = $3,
          cost           = $4
        WHERE id = $1 
        RETURNING *
      `, [id, product, producttype_id, cost]);
      return res.send(updProduct.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async updateQtyProduct(req, res){
    const id = req.params.id;
    const { quantity } = req.body;
    console.log('update qty for product', id);
    try{
      const updProduct = await DB.query(`
        UPDATE products 
        SET 
          quantity = $2
        WHERE id = $1 
        RETURNING *
      `, [id, quantity]);
      return res.send(updProduct.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async deleteProduct(req, res){
    const id = req.params.id
    // console.log('delete product by ID:', id)
    // const sql = `DELETE FROM products WHERE id = $1 RETURNING product;`
    const sql =`UPDATE products SET archive = true WHERE id = $1;`    
    const productDeleted = await DB.query(sql, [id])
    // console.log(`product #${id} with SQL: ${sql}. `, productDeleted)
    res.send(productDeleted) 
  }

}

module.exports = new ProductController()