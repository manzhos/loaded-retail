const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  // like '/client/react/default'
  basename: '/',
  defaultPath: '/dashboard/default',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,

  API_URL: 'http://localhost:3300/',
  // AUTH_URL: 'https://localhost:3000/auth/',
  URL: 'http://localhost:3000/',
  
  //production
  // export const API_URL  = 'https://---.com/',
  // export const AUTH_URL = 'https://---.com/auth/',
  // export const URL      = 'https://---.com/',
  
  MONTH: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  MONTH_FULL: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  USERTYPE: [
    'Admin',
    'Manager',
    'Seller'
  ]
  
};

export default config;
