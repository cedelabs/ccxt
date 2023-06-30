'use strict'

// ----------------------------------------------------------------------------

const jest = require('jest-mock')
const bybit = require('../../bybit.js')
const expect = require('expect');

// ----------------------------------------------------------------------------


// mocking responses from the exchange needed for private methods execution
const mockCall = (url) => ({});

const URL_MUST_CONTAINING_PROXY = {
    'https://fakeProxy.com/https://api.bybit.com/asset/v3/private/coin-info/query': true,
    'https://fakeProxy.com/https://api.bybit.com/user/v3/private/query-api': true,
    'https://fakeProxy.com/https://api.bybit.com/contract/v3/private/account/wallet/balance': true,
}

class ProxyError extends Error {
    constructor(message) {
        super(message);
    }
}

class BybitCustom extends bybit {
    async fetch(url, method = 'GET', headers = undefined, body = undefined) {
        const newUrl = this.implodeParams(url, this.omit(this.extend({}, this.urls), this.version));
        const urlWithoutParams = newUrl.split('?')[0];
        if (newUrl.includes("https://fakeProxy.com/")) {
            if (URL_MUST_CONTAINING_PROXY[urlWithoutParams] === undefined) {
                throw new ProxyError("URL shoun't contain https://fakeProxy.com/");
            }
        } else {
            if (URL_MUST_CONTAINING_PROXY[urlWithoutParams] === true) {
                throw new ProxyError("URL should contain https://fakeProxy.com/");
            }
        }

        return mockCall(url);
    }
}

(async () => {
    // Initialize the custom Bybit exchange class
    const exchange = new BybitCustom({
        apiKey: '12345678',
        secret: '12345678',
        forcedProxy: 'https://fakeProxy.com/',
    });

    // Privates endpoints that will be called :
    // https://fakeProxy.com/https://api.bybit.com/asset/v3/private/coin-info/query
    // https://fakeProxy.com/https://api.bybit.com/user/v3/private/query-api
    // https://fakeProxy.com/https://api.bybit.com/contract/v3/private/account/wallet/balance

    // Public endpoints that will be called :
    // https://api.bybit.com/spot/v1/symbols
    // https://api.bybit.com/derivatives/v3/public/instruments-info

    await exchange.fetchBalance('ETH-USDT');
})();