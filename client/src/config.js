const config = {
  // basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
  // like '/client/react/default'
  basename: '/',
  // defaultPath: '/dashboard/default',
  defaultPath: '/',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,

  // dev
  // API_URL: 'http://localhost:3300/',
  // URL: 'http://localhost:3100/',
  
  //production
  API_URL: 'http://195.110.59.101/',
  URL:     'http://195.110.59.101/',
  
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
