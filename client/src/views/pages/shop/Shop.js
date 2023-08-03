import { sentenceCase } from 'change-case';
import { filter } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { useHttp } from 'hooks/http.hook';
// import { AuthContext } from 'context/AuthContext';
import config from 'config';

import Loader from 'ui-component/Loader';
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
  // InputLabel,
  // Select,
  // FormControl,
  // FormControlLabel,
  // MenuItem,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { ShopListHead, ShopListToolbar, ShopMoreMenu } from './';
import Iconify        from 'ui-component/Iconify';
import SearchNotFound from 'ui-component/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'act',  label: '',     alignRight: false },
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
    return filter(array, (_shop) => (_shop.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) || _shop.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function Shop() {
  // const {token} = useContext(AuthContext)
  const [shopList, setShopList] = useState([])
  const [selected, setSelected] = useState([])
  const [filterName, setFilterName] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [modeModal, setModeModal] = useState('add')
  const [currentShopId, setCurrentShopId] = useState()
  const [currentShopName, setCurrentShopName] = useState('')
  
  const {loading, request} = useHttp()

  const getShops = useCallback(async () => {
    try {
      const shops = await request(`${config.API_URL}api/store`, 'GET', null, {
        // Authorization: `Bearer ${token}`
      })
      // console.log('shops:', shops);
      setShopList(shops);
    } catch (e) { console.log('error:', e)}
  }, [request, shopList])
  useEffect(() => {getShops()}, [])
  
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
      const newSelecteds = shopList.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([]);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0
  const emptyRows = 0;
  const filteredShops = applySortFilter(shopList, getComparator(order, orderBy), filterName);
  const isShopNotFound = filteredShops.length === 0;

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


  const getShop = (event, id, name) => {
    setCurrentShopId(id)
    setCurrentShopName(name)
    // console.log(`Edit Shop ${id}`);
    handleOpen('edit')
  }

  // Modal -- Add Store
  const [open, setOpen] = useState(false)
  const handleOpen = (mode) => {
    setModeModal(mode)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // console.log('name:', data.get('name'))
    if(data.get('name')){
      try {
        const res = await request(`${config.API_URL}api/store`, 'POST', {
          name: data.get('name'),
        })
        if(res){
          setOpen(false);
          handleUpdate();
        }
      } catch (e) {console.log('error:', e)} 
    } else alert('You need to fill fields.')
  }

  const handleSaveChanges = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // console.log('name:', data.get('name'))
    if(data.get('name')){
      try {
        const res = await request(`${config.API_URL}api/store/${currentShopId}`, 'POST', {
          name: data.get('name'),
        })
        if(res){
          setOpen(false);
          handleUpdate();
        }
      } catch (e) {console.log('error:', e)} 
    } else alert('You need to fill fields.')
  }

  const handleUpdate = () => {
    getShops();
  }

  const handleDelete = () => {
    selected.map((name) => {
      try {
        const delId = shopList.filter(s => s.name === name)[0].id;
        request(`${config.API_URL}api/store/${delId}`, 'DELETE', null, {
          // Authorization: `Bearer ${token}`
        })
        handleUpdate()
      } catch (e) { console.log('error:', e)}
    })
  }



  if (loading) return <Loader/>
  else {
    return (
      // <Page title="Store">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Stores
            </Typography>
            <Button variant="contained" onClick={() => {handleOpen('add')}} startIcon={<Iconify icon="eva:plus-fill" />}>
              Add Store
            </Button>
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
                      <span style={{ textTransform: "uppercase" }}>{modeModal}</span> STORE
                    </Typography>
                    <Box component="form" noValidate onSubmit={modeModal === 'add' ? handleSubmit : handleSaveChanges} sx={{ mt: 3 }} style={{ width:"100%", textAlign:"center" }}>
                      <Grid container spacing={2}>
                        <Grid container spacing={2} item xs={12} sm={12}>
                          <Grid item xs={12} sm={12} >
                            <TextField
                              autoComplete="name"
                              name="name"
                              required
                              fullWidth
                              id="name"
                              label="Name"
                              defaultValue={currentShopName}
                              autoFocus
                            />
                          </Grid>
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
            <ShopListToolbar numSelected={selected.length} onFilterName={handleFilterByName} onDelete={handleDelete} />
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <ShopListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={shopList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {/* {filteredShops.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => { */}
                  {filteredShops.map((row) => {
                    const { id, name } = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

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
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell component="th" scope="row" padding="normal" onClick={(event) => getShop(event, id, name)}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="body1" noWrap>
                              {sentenceCase(name)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <ShopMoreMenu id={id} shop={row} onChange={handleUpdate} />
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

                {isShopNotFound && (
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
              count={shopList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      // </Page>
    )
  }
}
