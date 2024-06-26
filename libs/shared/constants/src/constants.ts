export enum Services {
  AUTH_SERVICE = 'AUTH_SERVICE',
  WALLET_SERVICE = 'WALLET_SERVICE',
  TRANSACTION_ORDER_SERVICE = 'TRANSACTION_ORDER_SERVICE',
  INTEGRATION_SERVICE = 'INTEGRATION_SERVICE',
  GRPC_RATE_SERVICE = 'RATE_PACKAGE',
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

  //---------------------------------- TRANSACTION/ORDER ----------------------------------
  SAVE_TRANSACTION = 'save_transaction',
  GET_ALL_TRANSACTION = 'get_all_transactions',
  GET_ALL_ORDERS = 'get_all_orders',
  CREATE_ORDER = 'create_order',
  UPDATE_ORDER = 'update_order',
  DELETE_ORDER = 'delete_order',
  SAVE_ORDER_TRANSACTION = 'save_order_transaction',
  GET_ORDER_TRANSACTIONS = 'get_order_transactions',
}

export enum Queues {
  AUTH_QUEUE = 'auth_queue',
  WALLET_QUEUE = 'wallet_queue',
  TRANSACTION_ORDER_QUEUE = 'transaction_order_queue',
  INTEGRATION_QUEUE = 'integration_queue',
}
