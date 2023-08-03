const DB = require('../db');

class ProductController {  
  async createProduct(req, res){
    // save to DB
    const { product, producttype_id, cost, store_id, qty, user_id } = req.body;

    const existsProduct = await DB.query(`SELECT * FROM products WHERE product = $1`, [product]);
    console.log('already exists product:', existsProduct);
    if (existsProduct.rows && existsProduct.rows.length) {
      return res.status(400).json({ message: 'Same product already exist' });
    }

    const sqlProd = 'INSERT INTO products (product, producttype_id, cost, ts) VALUES ($1, $2, $3, $4) RETURNING *';
    const sqlFlow = `INSERT INTO product_store_flow (product_id, store_id, qty, user_id, ts) VALUES ($1, $2, $3, $4, $5) RETURNING *`
    let ts = new Date();
    // console.log('add product:', product, producttype_id, cost, ts);


    try{
      const newProduct = await DB.query(sqlProd, [product, producttype_id, cost, ts]);
      // console.log('new Product', newProduct.rows[0]);
      let flowProduct;
      if(newProduct && newProduct.rows && newProduct.rows[0].id) flowProduct = await DB.query(sqlFlow, [newProduct.rows[0].id, store_id, qty, user_id, ts]);

      return res.send(newProduct.rows[0]);
    } catch (err) {
      console.log(`Error: ${err}`)  
      return res.status(500).json({message: "The connection with DB was lost."})
    }
  }

  async getProducts(req, res){
    const store_id = req.query.store_id;
    // console.log('get all products for store:', store_id);
    const sql = `
      WITH 
        store_ids AS (
          SELECT 
            product_id,
            SUM(qty) AS quantity
          FROM product_store_flow
          ${store_id ? `WHERE store_id = ${store_id}` : ``}
          GROUP BY product_id
      )
      SELECT 
        p.id,
        p.product,
        si.quantity,
      -- 	p.quantity,
        p.cost,
        p.ts,
        p.producttype_id,
        pt.product_type
      FROM products p
      JOIN product_types pt ON p.producttype_id = pt.id
      JOIN store_ids si ON si.product_id = p.id
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
    const { quantity, store_id, user_id, photo_id } = req.body;
    // console.log('update qty for product', id, 'for store:', store_id, quantity);
    try{
    //   const updProduct = await DB.query(`
    //     UPDATE products 
    //     SET 
    //       quantity = $2
    //     WHERE id = $1 
    //     RETURNING *
    //   `, [id, quantity]);
      const ts = new Date();
      const sqlFlow = `INSERT INTO product_store_flow (product_id, store_id, qty, user_id, photo_id, ts) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
      const updProduct = await DB.query(sqlFlow, [id, store_id, quantity, user_id, photo_id, ts]);
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



  async getProductsFlow(req, res){
    const store_id = req.query.store_id;
    // console.log('get all products for store:', store_id);
    const sql = `
      SELECT 
        psf.id,
        psf.product_id,
        p.product,
        p.producttype_id,
        pt.product_type,
        psf.qty,
        psf.store_id,
        psf.ts,
        s.name AS store_name,
        psf.user_id,
        u.firstname,
        u.lastname,
        psf.photo_id,
        f.path,
        f.filename
      FROM product_store_flow psf
      LEFT JOIN products p ON psf.product_id = p.id
      LEFT JOIN product_types pt ON p.producttype_id = pt.id
      LEFT JOIN users u ON psf.user_id = u.id
      LEFT JOIN stores s ON psf.store_id = s.id
      LEFT JOIN files f ON psf.photo_id = f.id
      ${store_id ? `WHERE psf.store_id = ${store_id}` : ``}
    `;
    const products = await DB.query(sql);
    // console.log('products:', products.rows);
    return res.send(products.rows);
  }


}

module.exports = new ProductController()