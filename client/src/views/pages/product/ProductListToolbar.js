import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// component
import Iconify from 'ui-component/Iconify';
import { AuthContext } from 'context/AuthContext';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': { width: 320 },// boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

ProductListToolbar.propTypes = {
  numSelected: PropTypes.number,
};

export default function ProductListToolbar({ numSelected, onFilterName, storeList, onStore, currentStore = '', onDelete }) {
  const { storeId } = useContext(AuthContext);
  const [productFilter, setProductFilter] = useState('');
  // console.log('Store List:', storeList);
  // console.log('Current Store:', currentStore);
  // console.log('storeId:', storeId);

  const handleChange = (event) => {
    // console.log('handleChange', event.target.value);
    setProductFilter(event.target.value);
    onFilterName(event.target.value);
  }

  const handleStoreChange = (event) => {
    // console.log('handleStoreChange', event.target.value);
    onStore(event.target.value);
  }

  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <SearchStyle
            value={productFilter}
            onChange={handleChange}
            placeholder="Search product..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />
          <div style={{ width:"20px" }}>&nbsp;</div>
        </>
      )}
      {storeId ? (
          <Typography component="div" variant="h2" style={{ textDecoration:"underline" }}>
            Store {storeList.find(s => s.id === storeId)?.name}
          </Typography>
        ) : (
          <FormControl style={{ width: "60%" }}>
            <InputLabel id="store-select">Store</InputLabel>
            <Select
              labelId="store-select"
              id="store-select"
              name="store_id"
              value={currentStore}
              label="Store"
              onChange={handleStoreChange} 
            >
              <MenuItem key='all stores' value={'all_stores'}>All stores</MenuItem>
              {storeList.map((item, key)=>{
                return(
                  <MenuItem key={key} value={item.id}>{item.name}</MenuItem>
                )
              })}
            </Select>
          </FormControl>
        )
      }
      <div style={{ width:"20px" }}>&nbsp;</div>

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => {onDelete()}}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </RootStyle>
  );
}
