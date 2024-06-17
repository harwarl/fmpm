export enum Services {
  AUTH_SERVICE = 'AUTH_SERVICE',
  WALLET_SERVICE = 'WALLET_SERVICE',
  ORDERS_SERVICE = 'ORDERS_SERVICE',
  TRANSACTION_SERVICE = 'TRANSACTION_SERVICE',
  INTEGRATION_SERVICE = 'INTEGRATIONM_SERVICE',
}

export enum Actions {
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  LOGIN_USER = 'login_user',
  GET_USER = 'get_user',
  Get_USER_BY_USERNAME = 'get_user_by_username',
  VALIDATE_TOKEN = 'validate_token',
  VERIFY_JWT = 'verify_jwt',
  DECODE_JWT = 'decode_jwt',
  CHANGE_PASSWORD = 'change_password',

  //---------------------------------- INTEGRATION/RATE ----------------------------------
  GET_EXCHANGE_RATES = 'get_exchange_rates',
  GET_EXCHANGE_RATE = 'get_exchange_rate',
  EXCHANGE_AMOUNT = 'exchange_amount',

  //---------------------------------- WALLET ----------------------------------
  CREATE_WALLET = 'create_wallet',
  GET_WALLET_BY_ID = 'get_wallet-by_id',
  GET_ALL_WALLETS = 'get_all_wallet',
  CREDIT_WALLET = 'credit_wallet',
  DEBIT_WALLET = 'debit_wallet',
}

export enum Queues {
  AUTH_QUEUE = 'auth_queue',
  WALLET_QUEUE = 'wallet_queue',
  TRANSACTION_QUEUE = 'transaction_queue',
  ORDER_QUEUE = 'order_queue',
  INTEGRATION_QUEUE = 'integration_queue',
}
