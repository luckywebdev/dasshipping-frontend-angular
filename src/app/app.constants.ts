export const LOCAL_STORAGE = {
  accessToken: 'zoolu_token',
  refreshToken: 'zoolu_refresh',
};

export const APP_ROUTES = {
  auth: 'auth',
  forgot_password: 'forgot-password',
  terms: 'terms',
  register_carrier_finish: 'register-carrier-finish',
  reset_password: 'reset-password',
  register_common: 'register-common',
  carrier_decline: 'register-carrier-decline',
  common_decline: 'register-common-decline',
  register: 'register',
  register_carrier: 'register-carrier',
  changes_carrier: 'changes-carrier',
  waiting: 'waiting',
  profile: 'profile',
  error: 'error',
  home: 'home',
  my_company: 'my-company',
  drivers_location: 'drivers-location',
  accounts: 'accounts',
  company: 'company',
  order: 'order',
  new_order: 'new-order',
  orders: 'orders',
  sys_order: 'sys-order',
  trip: 'trip',
  quote: 'quote',
  leeds: 'leeds',
  dispatch: 'dispatch',
  policy: 'policy',
  list: 'list',
  revenue: 'revenue',
  user: 'user',
  custom: 'custom',
  reports: 'reports',
};

export const SNACK_BAR = {
  success: { panelClass: 'success-snackbar' },
  error: { panelClass: 'error-snackbar' },
};

export const INFO_MSG_PASSWORD = {
  3: `Make sure you display 8+ characters, caps, number, sign`,
  2: `Make sure you display 12+ characters, caps, number, sign`,
  1: `Make sure you display 12+ characters, caps, number, sign`,
};

export const REGEX_PASSWORD = {
  3: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g,
  2: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/g,
  1: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/g,
};
