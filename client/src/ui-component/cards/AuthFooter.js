// material-ui
import { 
  Link, 
  Typography, 
  Stack 
} from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    {/* <Typography variant="subtitle2" component={Link} href="https://manzhos.cz" target="_blank" underline="hover">
      manzhos.cz
    </Typography> */}
    <Typography variant="subtitle2" component={Link} href="https://www.privatejet.media/" target="_blank" underline="hover" style={{textTransform:'uppercase'}}>
      &copy; Private Jet Media, 2023
    </Typography>
  </Stack>
);

export default AuthFooter;
