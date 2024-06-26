'use strict'

// ----------------------------------------------------------------------------

import ccxt from '../../../dist/cjs/ccxt.js'
const gateio = ccxt['gateio']

// ----------------------------------------------------------------------------


// mocking responses from the exchange needed for private methods execution
const mockCall = (url) => {
    switch (url) {
        case 'https://api.gateio.ws/api/v4/spot/currencies':
            return {
                "currency": "BCN",
                "delisted": false,
                "withdraw_disabled": true,
                "withdraw_delayed": false,
                "deposit_disabled": true,
                "trade_disabled": false
            }
        case 'https://api.gateio.ws/api/v4/spot/currency_pairs':
            return [
                {
                    "id": "BTC_USDT",
                    "base": "BTC",
                    "quote": "USDT",
                    "fee": "0.2",
                    "min_base_amount": "0.01",
                    "min_quote_amount": "0.001",
                    "amount_precision": 3,
                    "precision": 6,
                    "trade_status": "tradable",
                    "sell_start": 0,
                    "buy_start": 0
                }
            ];
        default:
            return {}
    }
}

const URL_MUST_CONTAINING_PROXY = [
    'https://fakeProxy.com/https://api.gateio.ws/api/v4/spot/my_trades'
]

class ProxyError extends Error {
    constructor(message) {
        super(message);
    }
}

class GateioCustom extends gateio {
    async fetch(url, method = 'GET', headers = undefined, body = undefined) {
        const newUrl = this.implodeParams(url, this.omit(this.extend({}, this.urls), this.version));

        const urlWithoutParams = newUrl.split('?')[0];
        if (newUrl.includes("https://fakeProxy.com/")) {
            if (!URL_MUST_CONTAINING_PROXY.includes(urlWithoutParams)) {
                throw new ProxyError(`URL "${urlWithoutParams}" shouldn't contain https://fakeProxy.com/`);
            }
        } else {
            if (URL_MUST_CONTAINING_PROXY.some((key) => key.includes(urlWithoutParams))) {
                throw new ProxyError(`URL "${urlWithoutParams}" should contain https://fakeProxy.com/`);
            }
        }
        return mockCall(url);
    }
}

(async () => {
    // Initialize the custom Binance exchange class
    const exchange = new GateioCustom({
        apiKey: '12345678',
        secret: '12345678',
        forcedProxy: 'https://fakeProxy.com/',
    });

    await exchange.fetchMyTrades('BTC/USDT');
})();