import bitfinex2Rest from '../bitfinex2.js';
import type { Int, Str, OrderBook, Order, Trade, Ticker, OHLCV, Balances } from '../base/types.js';
import Client from '../base/ws/Client.js';
export default class bitfinex2 extends bitfinex2Rest {
    describe(): any;
    subscribe(channel: any, symbol: any, params?: {}): Promise<any>;
    subscribePrivate(messageHash: any): Promise<any>;
    watchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    handleOHLCV(client: Client, message: any, subscription: any): void;
    watchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    watchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    watchTicker(symbol: string, params?: {}): Promise<Ticker>;
    handleMyTrade(client: Client, message: any, subscription?: {}): void;
    handleTrades(client: Client, message: any, subscription: any): any;
    parseWsTrade(trade: any, market?: any): Trade;
    handleTicker(client: Client, message: any, subscription: any): void;
    parseWsTicker(ticker: any, market?: any): Ticker;
    watchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    handleOrderBook(client: Client, message: any, subscription: any): void;
    handleChecksum(client: Client, message: any, subscription: any): void;
    watchBalance(params?: {}): Promise<Balances>;
    handleBalance(client: Client, message: any, subscription: any): void;
    parseWsBalance(balance: any): import("../base/types.js").Account;
    handleSystemStatus(client: Client, message: any): any;
    handleSubscriptionStatus(client: Client, message: any): any;
    authenticate(params?: {}): Promise<any>;
    handleAuthenticationMessage(client: Client, message: any): void;
    watchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    handleOrders(client: Client, message: any, subscription: any): void;
    parseWsOrderStatus(status: any): string;
    parseWsOrder(order: any, market?: any): Order;
    handleMessage(client: Client, message: any): any;
}
