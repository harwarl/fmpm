import { Actions, Services } from '@fmpm/constants';
import { Order, OrderStatus, Wallet } from '@fmpm/models';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MarketService } from '../market/market.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  private threshold: number = 10 / 100; //10% threshold
  constructor(
    @Inject(Services.TRANSACTION_ORDER_SERVICE)
    private readonly orderClient: ClientProxy,
    private readonly marketService: MarketService,
    @Inject(Services.WALLET_SERVICE) private readonly walletClient: ClientProxy
  ) {}

  async getAllOrders() {
    try {
      const orders: Order[] = await lastValueFrom(
        this.orderClient.send({ cmd: Actions.GET_ALL_ORDERS }, {})
      );
      return orders;
    } catch (error) {
      console.log('Error -', error.message);
      return [];
    }
  }

  async executeOrders() {
    const orders = await this.getAllOrders();
    orders.forEach(async (order) => {
      const currentMarketRate = this.marketService.getRecentMarketRate(
        order.quote_currency
      );
      const diff = order.rate - currentMarketRate;
      if (diff < 0) return;
      if (diff > this.threshold) {
        await this.cancelOrder(order);
        await lastValueFrom(
          this.orderClient.send(
            { cmd: Actions.SAVE_ORDER_TRANSACTION },
            {
              userId: order.userId,
              orderId: order._id,
              base_currency: order.base_currency,
              quote_currency: order.quote_currency,
              amount: order.amount,
              status: OrderStatus.CANCELLED,
              rate: order.rate,
              message: 'Order Cancelled',
            }
          )
        );
        return;
      }
      const { error: orderError, message } = await this.executeOrder(
        order,
        currentMarketRate
      );
      //save the TXN
      await lastValueFrom(
        this.orderClient.send(
          { cmd: Actions.SAVE_ORDER_TRANSACTION },
          {
            userId: order.userId,
            orderId: order._id,
            base_currency: order.base_currency,
            quote_currency: order.quote_currency,
            amount: order.amount,
            status: orderError ? OrderStatus.CANCELLED : OrderStatus.COMPLETED,
            rate: order.rate,
            message: message,
          }
        )
      );
    });
    return;
  }

  async executeOrder(order: Order, marketRate: number): Promise<any> {
    //convert and adjust the users Wallet
    /**
     * TODO:
     * get the user wallets using their userId in the order
     * deduct from the base Curreny and fund the other
     * save txns
     */
    try {
      const userWallets: Wallet[] = await lastValueFrom(
        this.walletClient.send(
          { cmd: Actions.GET_ALL_WALLETS },
          { userId: order.userId }
        )
      );
      const usdWallet = userWallets.find((wallet) => wallet.currency === 'USD');
      if (!usdWallet)
        return {
          error: true,
          message: 'User does not have the required wallet',
        };

      const convertedAmount: number = order.amount * marketRate;

      const debitResponse = await lastValueFrom(
        this.walletClient.send(
          { cmd: Actions.DEBIT_WALLET },
          {
            userId: order.userId,
            currency: order.base_currency,
            amount: order.amount,
          }
        )
      );

      if (debitResponse.status && debitResponse.name === 'HttpException') {
        //Add a logger Here
        return {
          error: true,
          message: debitResponse.message,
        };
      }
      //save TXN
      await lastValueFrom(
        this.orderClient.send(
          { cmd: Actions.SAVE_TRANSACTION },
          {
            userId: order.userId,
            walletId: debitResponse._id,
            type: 'debit',
            amount: order.amount,
            currency: order.base_currency,
            metadata: JSON.stringify({
              type: 'transfer',
            }),
            status: OrderStatus.COMPLETED,
          }
        )
      );

      //credit the order Currency Account
      const creditResponse = await lastValueFrom(
        this.walletClient.send(
          {
            cmd: Actions.CREDIT_WALLET,
          },
          {
            senderId: order.userId,
            currency: order.quote_currency,
            amount: convertedAmount,
          }
        )
      );

      if (creditResponse.status && creditResponse.name === 'HttpException') {
        this.walletClient.send(
          { cmd: Actions.CREDIT_WALLET },
          {
            senderId: order.userId,
            currency: order.base_currency,
            amount: order.amount,
          }
        );
        //This is a reversed order
        await lastValueFrom(
          this.orderClient.send(
            { cmd: Actions.SAVE_TRANSACTION },
            {
              userId: order.userId,
              walletId: debitResponse._id,
              type: 'debit',
              amount: order.amount,
              currency: order.base_currency,
              metadata: JSON.stringify({
                type: 'transfer',
              }),
              status: OrderStatus.COMPLETED,
            }
          )
        );

        return {
          error: true,
          message: `${creditResponse.message} , Transaction Reversed`,
        };
      }

      await lastValueFrom(
        this.orderClient.send(
          { cmd: Actions.SAVE_TRANSACTION },
          {
            userId: order.userId,
            walletId: debitResponse._id,
            type: 'credit',
            amount: convertedAmount,
            currency: order.quote_currency,
            metadata: JSON.stringify({
              type: 'transfer',
            }),
            status: OrderStatus.COMPLETED,
          }
        )
      );

      return {
        error: false,
        message: 'Order Completed',
      };
    } catch (error) {
      console.log('Error getting user Wallets');
      return {
        error: true,
        message: `Order Error - ${error.message}`,
      };
    }
  }

  async cancelOrder(order: Order): Promise<boolean> {
    try {
      order.status = OrderStatus.CANCELLED;
      (await lastValueFrom(
        this.orderClient.send(
          { cmd: Actions.UPDATE_ORDER },
          { orderId: order._id, status: OrderStatus.CANCELLED }
        )
      )) as Order;
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
