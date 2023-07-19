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
  // FormControlLabel,
  MenuItem,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { UserListHead, UserListToolbar, UserMoreMenu } from '.';
import Iconify        from '../../../ui-component/Iconify';
import SearchNotFound from '../../../ui-component/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name',   label: 'Name',    alignRight: false },
  { id: 'email',  label: 'Email',   alignRight: false },
  { id: 'phone',  label: 'Phone',   alignRight: false },
  { id: 'role',   label: 'Role',  alignRight: false },
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
    return filter(array, (_user) => (_user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) || _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function User() {
  // const {token} = useContext(AuthContext)
  const [userList, setUserList] = useState([])
  const [role, setRole] = useState(3)
  const [selected, setSelected] = useState([])
  const [filterName, setFilterName] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  
  const {loading, request} = useHttp()

  const getUsers = useCallback(async () => {
    try {
      const users = await request(`${config.API_URL}api/user`, 'GET', null, {
        // Authorization: `Bearer ${token}`
      })
      // console.log('users:', users);
      setUserList(users);
    } catch (e) { console.log('error:', e)}
  }, [request, userList])
  useEffect(() => {getUsers()}, [])
  
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
      const newSelecteds = userList.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([]);
  };

  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0
  const emptyRows = 0;
  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

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


  const getUser = (event, id) => {
    console.log(`User ${id} want to `, event.target.value);
  }

  // Modal -- Add User
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    // console.log('data:\n', 
    //   data.get('firstname'), '\n',
    //   data.get('lastname'), '\n',
    //   data.get('email'), '\n',
    //   data.get('phone'), '\n',
    //   role, '\n',
    // )
    if(data.get('firstname')){
      try {
        const res = await request(`${config.API_URL}api/user`, 'POST', {
          firstname:    data.get('firstname'),
          lastname:     data.get('lastname'),
          email:        data.get('email'),
          phone:        data.get('phone'),
          password:     data.get('password'),
          usertype_id:  role,
        })
        if(res){
          setOpen(false);
          handleUpdate();
        }
      } catch (e) {console.log('error:', e)} 
    } else alert('You need to fill fields.')
  }

  const handleUpdate = () => {
    getUsers();
  }

  const handleDelete = () => {
    selected.map((name) => {
      try {
        const delId = userList.filter(s => s.name === name)[0].id;
        request(`${config.API_URL}api/user/${delId}`, 'DELETE', null, {
          // Authorization: `Bearer ${token}`
        })
        handleUpdate()
      } catch (e) { console.log('error:', e)}
    })
  }



  if (loading) return <Loader/>
  else {
    return (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Button variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
            New User
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
                    NEW USER
                  </Typography>
                  <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }} style={{ width:"100%", textAlign:"center" }}>
                    <Grid container spacing={2}>
                      <Grid container spacing={2} item xs={12} sm={12}>
                        <Grid item xs={12} sm={6} >
                          <TextField
                            autoComplete="firstname"
                            name="firstname"
                            required
                            fullWidth
                            id="firstname"
                            label="Name"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                          <TextField
                            autoComplete="lastname"
                            name="lastname"
                            required
                            fullWidth
                            id="lastname"
                            label="Surname"
                            autoFocus
                          />
                        </Grid>
                       </Grid>
                       <Grid container spacing={2} item xs={12} sm={12}>
                        <Grid item xs={12} sm={2}>&nbsp;</Grid>
                        <Grid item xs={12} sm={4}>
                          <FormControl sx={{ width: 1 }}>
                            <InputLabel id="role-select">Role</InputLabel>
                            <Select
                              labelId="role-select"
                              id="role-select"
                              name="usertype_id"
                              value={role}
                              label="Role"
                              onChange={(event) => {setRole(event.target.value)}} 
                            >
                              {config.USERTYPE.map((item, key)=>{
                                return(
                                  <MenuItem key={key} value={key}>{sentenceCase(item)}</MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            name="password"
                            fullWidth
                            id="password"
                            label="Password"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>&nbsp;</Grid>
                       </Grid>
                       <Grid container spacing={2} item xs={12} sm={12}> 
                        <Grid item xs={12} sm={6} >
                          <TextField
                            autoComplete="email"
                            name="email"
                            fullWidth
                            id="email"
                            label="Email"
                            autoFocus
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} >
                          <TextField
                            autoComplete="phone"
                            name="phone"
                            fullWidth
                            id="phone"
                            label="Phone"
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
          <UserListToolbar numSelected={selected.length} onFilterName={handleFilterByName} onDelete={handleDelete} />
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                // {filteredUsers.map((row) => {
                  const { id, firstname, lastname, email, phone, usertype_id } = row;
                  const isItemSelected = selected.indexOf(firstname) !== -1;

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
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, firstname)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" onClick={(event) => getUser(event, id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {firstname ? sentenceCase(firstname) + ' ' : ''}{lastname ? sentenceCase(lastname) : ''}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" onClick={(event) => getUser(event, id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {email}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" onClick={(event) => getUser(event, id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {phone}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none" onClick={(event) => getUser(event, id)}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography variant="body1" noWrap>
                            {config.USERTYPE[usertype_id]}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <UserMoreMenu id={id} user={row} onChange={handleUpdate} />
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

              {isUserNotFound && (
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
            count={userList.length}
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
