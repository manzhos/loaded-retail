import { useContext } from 'react';
import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { useHttp } from 'hooks/http.hook';
import { AuthContext } from 'context/AuthContext';
import config from 'config';

import Loader from 'ui-component/Loader';
import AddFile from 'views/components/AddFile';
// import Page   from 'ui-component/Page';
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
import Iconify        from 'ui-component/Iconify';
import SearchNotFound from 'ui-component/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product',  label: 'Product', alignRight: false },
  { id: 'type',     label: 'Type',    alignRight: false },
  { id: 'qty',      label: 'Qty',     alignRight: false },
  // { id: 'cost',     label: 'Cost',    alignRight: false },
  { id: 'user',     label: 'User',    alignRight: false },
  { id: 'date',     label: 'Date',    alignRight: false },
  { id: 'store',    label: 'Store',   alignRight: false },
  { id: 'photo',    label: 'Photo',   alignRight: false },
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
  const { userId, token, userTypeId, storeId } = useContext(AuthContext);
  // console.log('userTypeId:', userTypeId, 'userId:', userId, 'storeId:', storeId);
  const [productList, setProductList] = useState([]);
  const [productTypeList, setProductTypeList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [storeList, setStoreList] = useState([]);
  const [currentStore, setCurrentStore] = useState(storeId ? storeId : null);
  
  const {loading, request} = useHttp()

  const getProducts = useCallback(async (sId = storeId) => {
    // console.log('get products for store:', storeId);

    try {
      const products = await request(`${config.API_URL}api/productflow${sId ? `?store_id=${sId}` : ''}`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      // console.log('products:', products);
      setProductList(products);
    } catch (e) { console.log('error:', e)}
  }, [token, request, productList])
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

  const getStores = useCallback(async () => {
    try {
      const stores = await request(`${config.API_URL}api/store`, 'GET', null, {
        Authorization: `Bearer ${token}`
      })
      // console.log('stores:', stores);
      setStoreList(stores);
    } catch (e) { console.log('error:', e)}
  }, [token, request, storeList])
  useEffect(() => {getStores()}, [])

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

  const handleStore = (storeId) => {
    // console.log('NEW filter by store:', storeId);
    if(storeId === 'all_stores') {
      setCurrentStore();
      getProducts();
    }
    else{
      setCurrentStore(storeId);
      getProducts(storeId);
    }
  }

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

  const fullScreenImg = (path, fileName) => {
    console.log('Full screen img:', path, fileName);
  } 


  if (loading) return <Loader/>
  else {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Movement of goods
          </Typography>
        </Stack>

        <Card>
          <ProductListToolbar numSelected={selected.length} onFilterName={handleFilterByName} storeList={storeList} onStore={handleStore} currentStore={currentStore} />
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
                  const { id, product_id, product, producttype_id, product_type, qty, store_id, store_name, user_id, firstname, lastname, photo_id, path, filename, ts } = row;
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
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {product}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {product_type}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {qty}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {sentenceCase(firstname ? firstname : '')} {sentenceCase(lastname ? lastname : '')}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {ts}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {store_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="normal" onClick={() => fullScreenImg(path, filename)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {filename && <img src={config.URL + '/' + path + '/' + filename} style={{ maxHeight:"100px" }} />}
                        </Stack>
                      </TableCell>
                      {/* <TableCell align="right">
                        <ProductMoreMenu id={id} product={row} productTypeList={productTypeList} onChange={handleUpdate} />
                      </TableCell> */}
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
