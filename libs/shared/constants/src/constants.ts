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
  VALIDATE_TOKEN = 'validate_token',
  VERIFY_JWT = 'verify_jwt',
  DECODE_JWT = 'decode_jwt',
  CHANGE_PASSWORD = 'change_password',

  GET_EXCHANGE_RATES = 'get_exchange_rates',
  GET_EXCHANGE_RATE = 'get_exchange_rate',
  EXCHANGE_AMOUNT = 'exchange_amount',
}

export enum Queues {
  AUTH_QUEUE = 'auth_queue',
  WALLET_QUEUE = 'wallet_queue',
  TRANSACTION_QUEUE = 'transaction_queue',
  ORDER_QUEUE = 'order_queue',
  INTEGRATION_QUEUE = 'integration_queue',
}
