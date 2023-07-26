import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { useHttp } from '../../../hooks/http.hook';
// import { AuthContext } from '../../context/AuthContext';
import config from '../../../config';

import Loader from '../../../ui-component/Loader';
// import Page   from '../../../ui-component/Page';
// material
import {
  Card,
  Table,
  Stack,
  Grid,
  Box,
  TextField,
  Button,
  Modal,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  InputLabel,
  Select,
  FormControl,
  Input,
  // FormControlLabel,
  MenuItem,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { ProductListHead, ProductListToolbar, ProductMoreMenu } from '.';
import Iconify        from '../../../ui-component/Iconify';
import SearchNotFound from '../../../ui-component/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product',  label: 'Product', alignRight: false },
  { id: 'type',     label: 'Type',    alignRight: false },
  { id: 'qty',      label: 'Qty',     alignRight: false },
  { id: 'cost',     label: 'Cost',    alignRight: false },
  { id: 'action',   label: '',        alignRight: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if(query) {
    return filter(array, (_product) => (_product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) || _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Product() {
  // const {token} = useContext(AuthContext)
  const [productList, setProductList] = useState([])
  const [productTypeId, setProductTypeId] = useState(1)
  const [productTypeList, setProductTypeList] = useState([])
  const [selected, setSelected] = useState([])
  const [filterName, setFilterName] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [currentProduct, setCurrentProduct] = useState({})
  
  const {loading, request} = useHttp()

  const getProducts = useCallback(async () => {
    try {
      const products = await request(`${config.API_URL}api/product`, 'GET', null, {
        // Authorization: `Bearer ${token}`
      })
      console.log('products:', products);
      setProductList(products);
    } catch (e) { console.log('error:', e)}
  }, [request, productList])
  useEffect(() => {getProducts()}, [])

  const getProductTypes = useCallback(async () => {
    try {
      const productTypes = await request(`${config.API_URL}api/goodtype`, 'GET', null, {
        // Authorization: `Bearer ${jwt}`
      })
      // console.log('productTypes:', productTypes);
      setProductTypeList(productTypes);
    } catch (e) { console.log('error:', e)}
  }, [request, productTypeList])
  useEffect(() => {getProductTypes()}, []) 
  
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = productList.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([]);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0
  const emptyRows = 0;
  const filteredProducts = applySortFilter(productList, getComparator(order, orderBy), filterName);
  const isProductNotFound = filteredProducts.length === 0;

  const handleFilterByName = (filterString) => {
    setFilterName(filterString);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getProduct = (event, id, product, quantity, cost, product_type, producttype_id) => {
    // console.log(`Edit Qty Product ${id}:`, id, product, quantity);
    setCurrentProduct({
      'id':             id, 
      'product':        product,
      'quantity':       quantity,
    })
    handleQtyOpen()
  }

  // Modal -- Add Product
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // console.log('data:\n', 
    //   data.get('product'), '\n',
    //   data.get('producttype_id'), '\n',
    //   data.get('cost'), '\n',
    // )
    if(!data.get('cost').match(/^[0-9]+$/)){
      alert('The cost must be a number.');
      return;
    }

    if(data.get('product')){
      try {
        const res = await request(`${config.API_URL}api/product`, 'POST', {
          product:        data.get('product'),
          producttype_id: data.get('producttype_id'),
          cost:           data.get('cost'),
        })
        if(res){
          setOpen(false);
          handleUpdate();
        }
      } catch (e) {console.log('error:', e)} 
    } else alert('You need to fill fields.')
  }

  const handleUpdate = () => {
    getProducts();
  }

  const handleDelete = () => {
    selected.map((name) => {
      try {
        const delId = productList.filter(s => s.name === name)[0].id;
        request(`${config.API_URL}api/product/${delId}`, 'DELETE', null, {
          // Authorization: `Bearer ${token}`
        })
        handleUpdate()
      } catch (e) { console.log('error:', e)}
    })
  }

  // Modal -- Change Qty Product
  const [openQty, setOpenQty] = useState(false)
  const handleQtyOpen = () => setOpenQty(true)
  const handleQtyClose = () => setOpenQty(false)

  const handleQtySubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // console.log('data:', data.get('qty'))
    try {
      const res = await request(`${config.API_URL}api/qtyproduct/${currentProduct.id}`, 'PATCH', {
        quantity: data.get('qty'),
      })
      if(res){
        setOpenQty(false);
        handleUpdate();
      }
    } catch (e) {console.log('error:', e)} 
  }

  if (loading) return <Loader/>
  else {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Products
          </Typography>
          <Button variant="contained" onClick={ handleOpen } startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
          {/* Add product */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container component="main" maxWidth="md" disableGutters>
              <div className="login-modal">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography component="h1" variant="h5">
                    ADD PRODUCT
                  </Typography>
                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} style={{ width:"100%", textAlign:"center" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} >
                        <TextField
                          autoComplete="product"
                          name="product"
                          required
                          fullWidth
                          id="product"
                          label="Product"
                          defaultValue={currentProduct.product}
                          autoFocus
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <FormControl sx={{ width: 1 }}>
                          <InputLabel id="product-select">Product type</InputLabel>
                          <Select
                            labelId="product-select"
                            id="product-select"
                            name="producttype_id"
                            value={productTypeId}
                            label="Product type"
                            onChange={(event) => {setProductTypeId(event.target.value)}} 
                          >
                            {productTypeList.map((item, key)=>{
                              return(
                                <MenuItem key={key} value={item.id}>{sentenceCase(item.product_type)}</MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item container>
                        <Grid item xs={12} sm={3}></Grid>
                        <Grid item xs={12} sm={6} >
                          <TextField
                            name="cost"
                            fullWidth
                            id="cost"
                            label="Cost"
                            defaultValue={currentProduct.cost}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}></Grid>
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      // fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      style={{ padding:"8px 40px 5px"}}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </div>
            </Container>
          </Modal>

          {/* Change qty of product */}
          <Modal
            open={openQty}
            onClose={handleQtyClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Container component="main" maxWidth="md" disableGutters>
              <div className="login-modal">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography component="h1" variant="h5" style={{ textTransform:"uppercase" }}>
                    {currentProduct.product}
                  </Typography>
                  <Box component="form" noValidate onSubmit={handleQtySubmit} sx={{ mt: 3 }} style={{ width:"100%", textAlign:"center" }}>
                    <Grid container spacing={2} style={{ justifyContent: "center" }}>
                      <Grid item xs={6} sm={6}>
                        <Input 
                          type="number"
                          name="qty"
                          style={{
                            textAlign: "center",
                            fontSize: "64px"
                          }}
                          defaultValue={currentProduct.quantity} 
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      // fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      style={{ padding:"8px 40px 5px"}}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </div>
            </Container>
          </Modal>

        </Stack>

        <Card>
          <ProductListToolbar numSelected={selected.length} onFilterName={handleFilterByName} onDelete={handleDelete} />
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ProductListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={productList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                // {filteredProducts.map((row) => {
                  const { id, product, quantity, cost, product_type, producttype_id } = row;
                  // console.log( id, product, quantity, cost, product_type, producttype_id );
                  const isItemSelected = selected.indexOf(product) !== -1;

                  return (
                    <TableRow
                      hover
                      key={id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                      style={{ cursor:"pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, product)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={(event) => getProduct(event, id, product, quantity, cost, product_type, producttype_id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {product}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={(event) => getProduct(event, id, product, quantity, cost, product_type, producttype_id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {product_type}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={(event) => getProduct(event, id, product, quantity, cost, product_type, producttype_id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {quantity}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={(event) => getProduct(event, id, product, quantity, cost, product_type, producttype_id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {cost}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <ProductMoreMenu id={id} product={row} productTypeList={productTypeList} onChange={handleUpdate} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>

              {isProductNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    )
  }
}
