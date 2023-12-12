# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCache, ArrayCacheBySymbolById, ArrayCacheBySymbolBySide, ArrayCacheByTimestamp
import hashlib
from ccxt.base.types import Int, OrderSide, OrderType, Str, Strings
from ccxt.async_support.base.ws.client import Client
from typing import List
from ccxt.base.errors import NetworkError
from ccxt.base.errors import AuthenticationError


class cryptocom(ccxt.async_support.cryptocom):

    def describe(self):
        return self.deep_extend(super(cryptocom, self).describe(), {
            'has': {
                'ws': True,
                'watchBalance': True,
                'watchTicker': True,
                'watchTickers': False,  # for now
                'watchMyTrades': True,
                'watchTrades': True,
                'watchTradesForSymbols': True,
                'watchOrderBook': True,
                'watchOrderBookForSymbols': True,
                'watchOrders': True,
                'watchOHLCV': True,
                'watchPositions': True,
                'createOrderWs': True,
                'cancelOrderWs': True,
                'cancelAllOrders': True,
            },
            'urls': {
                'api': {
                    'ws': {
                        'public': 'wss://stream.crypto.com/exchange/v1/market',
                        'private': 'wss://stream.crypto.com/exchange/v1/user',
                    },
                },
                'test': {
                    'public': 'wss://uat-stream.3ona.co/exchange/v1/market',
                    'private': 'wss://uat-stream.3ona.co/exchange/v1/user',
                },
            },
            'options': {
                'watchPositions': {
                    'fetchPositionsSnapshot': True,  # or False
                    'awaitPositionsSnapshot': True,  # whether to wait for the positions snapshot before providing updates
                },
            },
            'streaming': {
            },
        })

    async def pong(self, client, message):
        # {
        #     "id": 1587523073344,
        #     "method": "public/heartbeat",
        #     "code": 0
        # }
        try:
            await client.send({'id': self.safe_integer(message, 'id'), 'method': 'public/respond-heartbeat'})
        except Exception as e:
            error = NetworkError(self.id + ' pong failed with error ' + self.json(e))
            client.reset(error)

    async def watch_order_book(self, symbol: str, limit: Int = None, params={}):
        """
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int [limit]: the maximum amount of order book entries to return
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        market = self.market(symbol)
        messageHash = 'book' + '.' + market['id']
        orderbook = await self.watch_public(messageHash, params)
        return orderbook.limit()

    async def watch_order_book_for_symbols(self, symbols: List[str], limit: Int = None, params={}):
        """
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#book-instrument_name
        :param str[] symbols: unified array of symbols
        :param int [limit]: the maximum amount of order book entries to return
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        symbols = self.market_symbols(symbols)
        topics = []
        for i in range(0, len(symbols)):
            symbol = symbols[i]
            market = self.market(symbol)
            currentMessageHash = 'book' + '.' + market['id']
            topics.append(currentMessageHash)
        messageHash = 'multipleOrderbooks::' + ','.join(symbols)
        orderbook = await self.watch_public_multiple(messageHash, topics, params)
        return orderbook.limit()

    def handle_order_book_snapshot(self, client: Client, message):
        # full snapshot
        #
        # {
        #     "instrument_name":"LTC_USDT",
        #     "subscription":"book.LTC_USDT.150",
        #     "channel":"book",
        #     "depth":150,
        #     "data": [
        #          {
        #              "bids": [
        #                  [122.21, 0.74041, 4]
        #              ],
        #              "asks": [
        #                  [122.29, 0.00002, 1]
        #              ]
        #              "t": 1648123943803,
        #              "s":754560122
        #          }
        #      ]
        # }
        #
        messageHash = self.safe_string(message, 'subscription')
        marketId = self.safe_string(message, 'instrument_name')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        data = self.safe_value(message, 'data')
        data = self.safe_value(data, 0)
        timestamp = self.safe_integer(data, 't')
        snapshot = self.parse_order_book(data, symbol, timestamp)
        snapshot['nonce'] = self.safe_integer(data, 's')
        orderbook = self.safe_value(self.orderbooks, symbol)
        if orderbook is None:
            limit = self.safe_integer(message, 'depth')
            orderbook = self.order_book({}, limit)
        orderbook.reset(snapshot)
        self.orderbooks[symbol] = orderbook
        client.resolve(orderbook, messageHash)
        self.resolve_promise_if_messagehash_matches(client, 'multipleOrderbooks::', symbol, orderbook)

    async def watch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={}):
        """
        get the list of most recent trades for a particular symbol
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#trade-instrument_name
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        messageHash = 'trade' + '.' + market['id']
        trades = await self.watch_public(messageHash, params)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    async def watch_trades_for_symbols(self, symbols: List[str], since: Int = None, limit: Int = None, params={}):
        """
        get the list of most recent trades for a particular symbol
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#trade-instrument_name
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        symbols = self.market_symbols(symbols)
        topics = []
        for i in range(0, len(symbols)):
            symbol = symbols[i]
            market = self.market(symbol)
            currentMessageHash = 'trade' + '.' + market['id']
            topics.append(currentMessageHash)
        messageHash = 'multipleTrades::' + ','.join(symbols)
        trades = await self.watch_public_multiple(messageHash, topics, params)
        if self.newUpdates:
            first = self.safe_value(trades, 0)
            tradeSymbol = self.safe_string(first, 'symbol')
            limit = trades.getLimit(tradeSymbol, limit)
        return self.filter_by_since_limit(trades, since, limit, 'timestamp', True)

    def handle_trades(self, client: Client, message):
        #
        # {
        #     "code": 0,
        #     "method": "subscribe",
        #     "result": {
        #       "instrument_name": "BTC_USDT",
        #       "subscription": "trade.BTC_USDT",
        #       "channel": "trade",
        #       "data": [
        #             {
        #                 "dataTime":1648122434405,
        #                 "d":"2358394540212355488",
        #                 "s":"SELL",
        #                 "p":42980.85,
        #                 "q":0.002325,
        #                 "t":1648122434404,
        #                 "i":"BTC_USDT"
        #              }
        #              (...)
        #       ]
        # }
        #
        channel = self.safe_string(message, 'channel')
        marketId = self.safe_string(message, 'instrument_name')
        symbolSpecificMessageHash = self.safe_string(message, 'subscription')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        stored = self.safe_value(self.trades, symbol)
        if stored is None:
            limit = self.safe_integer(self.options, 'tradesLimit', 1000)
            stored = ArrayCache(limit)
            self.trades[symbol] = stored
        data = self.safe_value(message, 'data', [])
        dataLength = len(data)
        if dataLength == 0:
            return
        parsedTrades = self.parse_trades(data, market)
        for j in range(0, len(parsedTrades)):
            stored.append(parsedTrades[j])
        channelReplaced = channel.replace('.' + marketId, '')
        client.resolve(stored, symbolSpecificMessageHash)
        client.resolve(stored, channelReplaced)
        self.resolve_promise_if_messagehash_matches(client, 'multipleTrades::', symbol, stored)

    async def watch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}):
        """
        watches information on multiple trades made by the user
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-trade-instrument_name
        :param str symbol: unified market symbol of the market trades were made in
        :param int [since]: the earliest time in ms to fetch trades for
        :param int [limit]: the maximum number of trade structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure
        """
        await self.load_markets()
        market = None
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
        messageHash = 'user.trade'
        messageHash = (messageHash + '.' + market['id']) if (market is not None) else messageHash
        trades = await self.watch_private_subscribe(messageHash, params)
        if self.newUpdates:
            limit = trades.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(trades, symbol, since, limit, True)

    async def watch_ticker(self, symbol: str, params={}):
        """
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#ticker-instrument_name
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        messageHash = 'ticker' + '.' + market['id']
        return await self.watch_public(messageHash, params)

    def handle_ticker(self, client: Client, message):
        #
        # {
        #     "info":{
        #        "instrument_name":"BTC_USDT",
        #        "subscription":"ticker.BTC_USDT",
        #        "channel":"ticker",
        #        "data":[
        #           {
        #              "i":"BTC_USDT",
        #              "b":43063.19,
        #              "k":43063.2,
        #              "a":43063.19,
        #              "t":1648121165658,
        #              "v":43573.912409,
        #              "h":43498.51,
        #              "l":41876.58,
        #              "c":1087.43
        #           }
        #        ]
        #     }
        #  }
        #
        messageHash = self.safe_string(message, 'subscription')
        marketId = self.safe_string(message, 'instrument_name')
        market = self.safe_market(marketId)
        data = self.safe_value(message, 'data', [])
        for i in range(0, len(data)):
            ticker = data[i]
            parsed = self.parse_ticker(ticker, market)
            symbol = parsed['symbol']
            self.tickers[symbol] = parsed
            client.resolve(parsed, messageHash)

    async def watch_ohlcv(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}):
        """
        watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#candlestick-time_frame-instrument_name
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        """
        await self.load_markets()
        market = self.market(symbol)
        symbol = market['symbol']
        interval = self.safe_string(self.timeframes, timeframe, timeframe)
        messageHash = 'candlestick' + '.' + interval + '.' + market['id']
        ohlcv = await self.watch_public(messageHash, params)
        if self.newUpdates:
            limit = ohlcv.getLimit(symbol, limit)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    def handle_ohlcv(self, client: Client, message):
        #
        #  {
        #       "instrument_name": "BTC_USDT",
        #       "subscription": "candlestick.1m.BTC_USDT",
        #       "channel": "candlestick",
        #       "depth": 300,
        #       "interval": "1m",
        #       "data": [[Object]]
        #   }
        #
        messageHash = self.safe_string(message, 'subscription')
        marketId = self.safe_string(message, 'instrument_name')
        market = self.safe_market(marketId)
        symbol = market['symbol']
        interval = self.safe_string(message, 'interval')
        timeframe = self.find_timeframe(interval)
        self.ohlcvs[symbol] = self.safe_value(self.ohlcvs, symbol, {})
        stored = self.safe_value(self.ohlcvs[symbol], timeframe)
        if stored is None:
            limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
            stored = ArrayCacheByTimestamp(limit)
            self.ohlcvs[symbol][timeframe] = stored
        data = self.safe_value(message, 'data')
        for i in range(0, len(data)):
            tick = data[i]
            parsed = self.parse_ohlcv(tick, market)
            stored.append(parsed)
        client.resolve(stored, messageHash)

    async def watch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}):
        """
        watches information on multiple orders made by the user
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-order-instrument_name
        :param str symbol: unified market symbol of the market orders were made in
        :param int [since]: the earliest time in ms to fetch orders for
        :param int [limit]: the maximum number of order structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `order structures <https://docs.ccxt.com/#/?id=order-structure>`
        """
        await self.load_markets()
        market = None
        if symbol is not None:
            market = self.market(symbol)
            symbol = market['symbol']
        messageHash = 'user.order'
        messageHash = (messageHash + '.' + market['id']) if (market is not None) else messageHash
        orders = await self.watch_private_subscribe(messageHash, params)
        if self.newUpdates:
            limit = orders.getLimit(symbol, limit)
        return self.filter_by_symbol_since_limit(orders, symbol, since, limit, True)

    def handle_orders(self, client: Client, message, subscription=None):
        #
        #    {
        #        "method": "subscribe",
        #        "result": {
        #          "instrument_name": "ETH_CRO",
        #          "subscription": "user.order.ETH_CRO",
        #          "channel": "user.order",
        #          "data": [
        #            {
        #              "status": "ACTIVE",
        #              "side": "BUY",
        #              "price": 1,
        #              "quantity": 1,
        #              "order_id": "366455245775097673",
        #              "client_oid": "my_order_0002",
        #              "create_time": 1588758017375,
        #              "update_time": 1588758017411,
        #              "type": "LIMIT",
        #              "instrument_name": "ETH_CRO",
        #              "cumulative_quantity": 0,
        #              "cumulative_value": 0,
        #              "avg_price": 0,
        #              "fee_currency": "CRO",
        #              "time_in_force":"GOOD_TILL_CANCEL"
        #            }
        #          ],
        #          "channel": "user.order.ETH_CRO"
        #        }
        #    }
        #
        channel = self.safe_string(message, 'channel')
        symbolSpecificMessageHash = self.safe_string(message, 'subscription')
        orders = self.safe_value(message, 'data', [])
        ordersLength = len(orders)
        if ordersLength > 0:
            if self.orders is None:
                limit = self.safe_integer(self.options, 'ordersLimit', 1000)
                self.orders = ArrayCacheBySymbolById(limit)
            stored = self.orders
            parsed = self.parse_orders(orders)
            for i in range(0, len(parsed)):
                stored.append(parsed[i])
            client.resolve(stored, symbolSpecificMessageHash)
            # non-symbol specific
            client.resolve(stored, channel)  # channel might have a symbol-specific suffix
            client.resolve(stored, 'user.order')

    async def watch_positions(self, symbols: Strings = None, since: Int = None, limit: Int = None, params={}):
        """
        watch all open positions
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-position_balance
        :param str[]|None symbols: list of unified market symbols
        :param dict params: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `position structure <https://docs.ccxt.com/en/latest/manual.html#position-structure>`
        """
        await self.load_markets()
        await self.authenticate()
        url = self.urls['api']['ws']['private']
        id = self.nonce()
        request = {
            'method': 'subscribe',
            'params': {
                'channels': ['user.position_balance'],
            },
            'nonce': id,
        }
        messageHash = 'positions'
        symbols = self.market_symbols(symbols)
        if not self.is_empty(symbols):
            messageHash = '::' + ','.join(symbols)
        client = self.client(url)
        self.set_positions_cache(client, symbols)
        fetchPositionsSnapshot = self.handle_option('watchPositions', 'fetchPositionsSnapshot', True)
        awaitPositionsSnapshot = self.safe_value('watchPositions', 'awaitPositionsSnapshot', True)
        if fetchPositionsSnapshot and awaitPositionsSnapshot and self.positions is None:
            snapshot = await client.future('fetchPositionsSnapshot')
            return self.filter_by_symbols_since_limit(snapshot, symbols, since, limit, True)
        newPositions = await self.watch(url, messageHash, self.extend(request, params))
        if self.newUpdates:
            return newPositions
        return self.filter_by_symbols_since_limit(self.positions, symbols, since, limit, True)

    def set_positions_cache(self, client: Client, type, symbols: Strings = None):
        fetchPositionsSnapshot = self.handle_option('watchPositions', 'fetchPositionsSnapshot', False)
        if fetchPositionsSnapshot:
            messageHash = 'fetchPositionsSnapshot'
            if not (messageHash in client.futures):
                client.future(messageHash)
                self.spawn(self.load_positions_snapshot, client, messageHash)
        else:
            self.positions = ArrayCacheBySymbolBySide()

    async def load_positions_snapshot(self, client, messageHash):
        positions = await self.fetch_positions()
        self.positions = ArrayCacheBySymbolBySide()
        cache = self.positions
        for i in range(0, len(positions)):
            position = positions[i]
            contracts = self.safe_number(position, 'contracts', 0)
            if contracts > 0:
                cache.append(position)
        # don't remove the future from the .futures cache
        future = client.futures[messageHash]
        future.resolve(cache)
        client.resolve(cache, 'positions')

    def handle_positions(self, client, message):
        #
        #    {
        #        "subscription": "user.position_balance",
        #        "channel": "user.position_balance",
        #        "data": [{
        #            "balances": [{
        #                "instrument_name": "USD",
        #                "quantity": "8.9979961950886",
        #                "update_timestamp_ms": 1695598760597,
        #            }],
        #            "positions": [{
        #                "account_id": "96a0edb1-afb5-4c7c-af89-5cb610319e2c",
        #                "instrument_name": "LTCUSD-PERP",
        #                "type": "PERPETUAL_SWAP",
        #                "quantity": "1.8",
        #                "cost": "114.766",
        #                "open_position_pnl": "-0.0216206",
        #                "session_pnl": "0.00962994",
        #                "update_timestamp_ms": 1695598760597,
        #                "open_pos_cost": "114.766",
        #            }],
        #        }],
        #    }
        #
        # each account is connected to a different endpoint
        # and has exactly one subscriptionhash which is the account type
        data = self.safe_value(message, 'data', [])
        firstData = self.safe_value(data, 0, {})
        rawPositions = self.safe_value(firstData, 'positions', [])
        if self.positions is None:
            self.positions = ArrayCacheBySymbolBySide()
        cache = self.positions
        newPositions = []
        for i in range(0, len(rawPositions)):
            rawPosition = rawPositions[i]
            position = self.parse_position(rawPosition)
            newPositions.append(position)
            cache.append(position)
        messageHashes = self.find_message_hashes(client, 'positions::')
        for i in range(0, len(messageHashes)):
            messageHash = messageHashes[i]
            parts = messageHash.split('::')
            symbolsString = parts[1]
            symbols = symbolsString.split(',')
            positions = self.filter_by_array(newPositions, 'symbol', symbols, False)
            if not self.is_empty(positions):
                client.resolve(positions, messageHash)
        client.resolve(newPositions, 'positions')

    async def watch_balance(self, params={}):
        """
        watch balance and get the amount of funds available for trading or funds locked in orders
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#user-balance
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `balance structure <https://docs.ccxt.com/#/?id=balance-structure>`
        """
        messageHash = 'user.balance'
        return await self.watch_private_subscribe(messageHash, params)

    def handle_balance(self, client: Client, message):
        #
        #     {
        #         "id": 1,
        #         "method": "subscribe",
        #         "code": 0,
        #         "result": {
        #             "subscription": "user.balance",
        #             "channel": "user.balance",
        #             "data": [
        #                 {
        #                     "total_available_balance": "5.84684368",
        #                     "total_margin_balance": "5.84684368",
        #                     "total_initial_margin": "0",
        #                     "total_maintenance_margin": "0",
        #                     "total_position_cost": "0",
        #                     "total_cash_balance": "6.44412101",
        #                     "total_collateral_value": "5.846843685",
        #                     "total_session_unrealized_pnl": "0",
        #                     "instrument_name": "USD",
        #                     "total_session_realized_pnl": "0",
        #                     "position_balances": [
        #                         {
        #                             "quantity": "0.0002119875",
        #                             "reserved_qty": "0",
        #                             "collateral_weight": "0.9",
        #                             "collateral_amount": "5.37549592",
        #                             "market_value": "5.97277325",
        #                             "max_withdrawal_balance": "0.00021198",
        #                             "instrument_name": "BTC",
        #                             "hourly_interest_rate": "0"
        #                         },
        #                     ],
        #                     "total_effective_leverage": "0",
        #                     "position_limit": "3000000",
        #                     "used_position_limit": "0",
        #                     "total_borrow": "0",
        #                     "margin_score": "0",
        #                     "is_liquidating": False,
        #                     "has_risk": False,
        #                     "terminatable": True
        #                 }
        #             ]
        #         }
        #     }
        #
        messageHash = self.safe_string(message, 'subscription')
        data = self.safe_value(message, 'data', [])
        positionBalances = self.safe_value(data[0], 'position_balances', [])
        self.balance['info'] = data
        for i in range(0, len(positionBalances)):
            balance = positionBalances[i]
            currencyId = self.safe_string(balance, 'instrument_name')
            code = self.safe_currency_code(currencyId)
            account = self.account()
            account['total'] = self.safe_string(balance, 'quantity')
            account['used'] = self.safe_string(balance, 'reserved_qty')
            self.balance[code] = account
            self.balance = self.safe_balance(self.balance)
        client.resolve(self.balance, messageHash)
        messageHashRequest = self.safe_string(message, 'id')
        client.resolve(self.balance, messageHashRequest)

    async def create_order_ws(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: float = None, params={}):
        """
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-create-order
        create a trade order
        :param str symbol: unified symbol of the market to create an order in
        :param str type: 'market' or 'limit'
        :param str side: 'buy' or 'sell'
        :param float amount: how much of currency you want to trade in units of base currency
        :param float [price]: the price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: an `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        await self.load_markets()
        params = self.createOrderRequest(symbol, type, side, amount, price, params)
        request = {
            'method': 'private/create-order',
            'params': params,
        }
        messageHash = self.nonce()
        return await self.watch_private_request(messageHash, request)

    def handle_order(self, client: Client, message):
        #
        #    {
        #        "id": 1,
        #        "method": "private/create-order",
        #        "code": 0,
        #        "result": {
        #            "client_oid": "c5f682ed-7108-4f1c-b755-972fcdca0f02",
        #            "order_id": "18342311"
        #        }
        #    }
        #
        messageHash = self.safe_string(message, 'id')
        rawOrder = self.safe_value(message, 'result', {})
        order = self.parse_order(rawOrder)
        client.resolve(order, messageHash)

    async def cancel_order_ws(self, id: str, symbol: Str = None, params={}):
        """
        cancels an open order
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-order
        :param str id: the order id of the order to cancel
        :param str [symbol]: unified symbol of the market the order was made in
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: An `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        await self.load_markets()
        params = self.extend({
            'order_id': id,
        }, params)
        request = {
            'method': 'private/cancel-order',
            'params': params,
        }
        messageHash = self.nonce()
        return await self.watch_private_request(messageHash, request)

    async def cancel_all_orders_ws(self, symbol: Str = None, params={}):
        """
        cancel all open orders
        :see: https://exchange-docs.crypto.com/exchange/v1/rest-ws/index.html#private-cancel-all-orders
        :param str symbol: unified market symbol of the orders to cancel
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict} Returns exchange raw message {@link https://docs.ccxt.com/#/?id=order-structure:
        """
        await self.load_markets()
        market = None
        request = {
            'method': 'private/cancel-all-orders',
            'params': self.extend({}, params),
        }
        if symbol is not None:
            market = self.market(symbol)
            request['params']['instrument_name'] = market['id']
        messageHash = self.nonce()
        return await self.watch_private_request(messageHash, request)

    def handle_cancel_all_orders(self, client: Client, message):
        #
        #    {
        #        "id": 1688914586647,
        #        "method": "private/cancel-all-orders",
        #        "code": 0
        #    }
        #
        messageHash = self.safe_string(message, 'id')
        client.resolve(message, messageHash)

    async def watch_public(self, messageHash, params={}):
        url = self.urls['api']['ws']['public']
        id = self.nonce()
        request = {
            'method': 'subscribe',
            'params': {
                'channels': [messageHash],
            },
            'nonce': id,
        }
        message = self.extend(request, params)
        return await self.watch(url, messageHash, message, messageHash)

    async def watch_public_multiple(self, messageHash, topics, params={}):
        url = self.urls['api']['ws']['public']
        id = self.nonce()
        request = {
            'method': 'subscribe',
            'params': {
                'channels': topics,
            },
            'nonce': id,
        }
        message = self.extend(request, params)
        return await self.watch(url, messageHash, message, messageHash)

    async def watch_private_request(self, nonce, params={}):
        await self.authenticate()
        url = self.urls['api']['ws']['private']
        request = {
            'id': nonce,
            'nonce': nonce,
        }
        message = self.extend(request, params)
        return await self.watch(url, str(nonce), message, True)

    async def watch_private_subscribe(self, messageHash, params={}):
        await self.authenticate()
        url = self.urls['api']['ws']['private']
        id = self.nonce()
        request = {
            'method': 'subscribe',
            'params': {
                'channels': [messageHash],
            },
            'nonce': id,
        }
        message = self.extend(request, params)
        return await self.watch(url, messageHash, message, messageHash)

    def handle_error_message(self, client: Client, message):
        #
        #    {
        #        "id": 0,
        #        "code": 10004,
        #        "method": "subscribe",
        #        "message": "invalid channel {"channels":["trade.BTCUSD-PERP"]}"
        #    }
        #
        errorCode = self.safe_string(message, 'code')
        try:
            if errorCode and errorCode != '0':
                feedback = self.id + ' ' + self.json(message)
                self.throw_exactly_matched_exception(self.exceptions['exact'], errorCode, feedback)
                messageString = self.safe_value(message, 'message')
                if messageString is not None:
                    self.throw_broadly_matched_exception(self.exceptions['broad'], messageString, feedback)
            return False
        except Exception as e:
            if isinstance(e, AuthenticationError):
                messageHash = 'authenticated'
                client.reject(e, messageHash)
                if messageHash in client.subscriptions:
                    del client.subscriptions[messageHash]
            else:
                client.reject(e)
            return True

    def handle_subscribe(self, client: Client, message):
        methods = {
            'candlestick': self.handle_ohlcv,
            'ticker': self.handle_ticker,
            'trade': self.handle_trades,
            'book': self.handle_order_book_snapshot,
            'user.order': self.handle_orders,
            'user.trade': self.handle_trades,
            'user.balance': self.handle_balance,
            'user.position_balance': self.handle_positions,
        }
        result = self.safe_value_2(message, 'result', 'info')
        channel = self.safe_string(result, 'channel')
        if (channel is not None) and channel.find('user.trade') > -1:
            # channel might be user.trade.BTC_USDT
            self.handle_trades(client, result)
        if (channel is not None) and channel.startswith('user.order'):
            # channel might be user.order.BTC_USDT
            self.handle_orders(client, result)
        method = self.safe_value(methods, channel)
        if method is not None:
            method(client, result)

    def handle_message(self, client: Client, message):
        #
        # ping
        #    {
        #        "id": 1587523073344,
        #        "method": "public/heartbeat",
        #        "code": 0
        #    }
        # auth
        #     {id: 1648132625434, method: "public/auth", code: 0}
        # ohlcv
        #    {
        #        "code": 0,
        #        "method": "subscribe",
        #        "result": {
        #          "instrument_name": "BTC_USDT",
        #          "subscription": "candlestick.1m.BTC_USDT",
        #          "channel": "candlestick",
        #          "depth": 300,
        #          "interval": "1m",
        #          "data": [[Object]]
        #        }
        #      }
        # ticker
        #    {
        #        "info":{
        #           "instrument_name":"BTC_USDT",
        #           "subscription":"ticker.BTC_USDT",
        #           "channel":"ticker",
        #           "data":[{}]
        #
        if self.handle_error_message(client, message):
            return
        method = self.safe_string(message, 'method')
        methods = {
            '': self.handle_ping,
            'public/heartbeat': self.handle_ping,
            'public/auth': self.handle_authenticate,
            'private/create-order': self.handle_order,
            'private/cancel-order': self.handle_order,
            'private/cancel-all-orders': self.handle_cancel_all_orders,
            'private/close-position': self.handle_order,
            'subscribe': self.handle_subscribe,
        }
        callMethod = self.safe_value(methods, method)
        if callMethod is not None:
            callMethod(client, message)

    async def authenticate(self, params={}):
        self.check_required_credentials()
        url = self.urls['api']['ws']['private']
        client = self.client(url)
        messageHash = 'authenticated'
        future = client.future(messageHash)
        authenticated = self.safe_value(client.subscriptions, messageHash)
        if authenticated is None:
            method = 'public/auth'
            nonce = str(self.nonce())
            auth = method + nonce + self.apiKey + nonce
            signature = self.hmac(self.encode(auth), self.encode(self.secret), hashlib.sha256)
            request = {
                'id': nonce,
                'nonce': nonce,
                'method': method,
                'api_key': self.apiKey,
                'sig': signature,
            }
            message = self.extend(request, params)
            self.watch(url, messageHash, message, messageHash)
        return future

    def handle_ping(self, client: Client, message):
        self.spawn(self.pong, client, message)

    def handle_authenticate(self, client: Client, message):
        #
        #  {id: 1648132625434, method: "public/auth", code: 0}
        #
        future = self.safe_value(client.futures, 'authenticated')
        future.resolve(True)
