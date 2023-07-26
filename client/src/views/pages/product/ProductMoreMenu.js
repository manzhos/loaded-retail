import React, { useRef, useState } from 'react';
import { sentenceCase } from 'change-case';
// material
import { 
  Menu, 
  MenuItem, 
  IconButton, 
  ListItemIcon, 
  ListItemText,
  Modal,
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
 } from '@mui/material';
// component
// import { AuthContext } from '../../../context/AuthContext'
import Iconify from '../../../ui-component/Iconify';
import { useHttp } from '../../../hooks/http.hook'
import config from '../../../config';

// ----------------------------------------------------------------------

export default function ProductMoreMenu({ id, product = {}, productTypeList = [], onChange }) {
  // console.log('Product:', product)
  // const {token} = useContext(AuthContext)
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [productTypeId, setProductTypeId] = useState(product.producttype_id);
  const {request} = useHttp();

  const handleDelete = async (event) => {
    event.preventDefault()
    try {
      // console.log(`try deleting product #${id}`)
      await request(`${config.API_URL}api/delproduct/${id}`, 'get', null, {
        // Authorization: `Bearer ${token}`
      })
      setIsOpen(false)
      onChange(true)
    } catch (e) { console.log('error:', e)}
  }

  // Edit Product
  const [open, setOpen] = useState(false)

  const handleEdit = () => {
    setIsOpen(false)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const handleSaveChanges = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log('product:', data.get('product'))
    try {
      const updProduct = await request(`${config.API_URL}api/product/${product.id}`, 'PATCH', {
        product:        data.get('product'),
        producttype_id: data.get('producttype_id'),
        cost:           data.get('cost'),
      })
      if(updProduct){
        setOpen(false);
        onChange(true)
      }
    } catch (e) {console.log('error:', e)} 
  }


  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleEdit}>
          <ListItemIcon>
            <Iconify icon="eva:edit-fill" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleDelete}>
          <ListItemIcon>
            <Iconify icon="eva:trash-2-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>

      {/* Edit Product */}
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
                EDIT PRODUCT
              </Typography>
              <Box component="form" noValidate onSubmit={handleSaveChanges} sx={{ mt: 3 }} style={{ width:"100%", textAlign:"center" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} >
                    <TextField
                      autoComplete="product"
                      name="product"
                      required
                      fullWidth
                      id="product"
                      label="Product"
                      defaultValue={product.product}
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
                        defaultValue={product.producttype_id}
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
                        defaultValue={product.cost}
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

    </>
  );
}
