'use strict'

// ----------------------------------------------------------------------------

const jest = require('jest-mock')
const okx = require('../../okx.js')
const expect = require('expect');

// ----------------------------------------------------------------------------


// mocking responses from the exchange needed for private methods execution
const mockCall = () => ({});

const URL_MUST_CONTAINING_PROXY = {
    'https://fakeProxy.com/https://www.okx.com/api/v5/asset/currencies': true,
    'https://fakeProxy.com/https://www.okx.com/api/v5/account/balance': true,
}

class ProxyError extends Error {
    constructor(message) {
        super(message);
    }
}

class OKXCustom extends okx {
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
    // Initialize the custom OKX exchange class
    const exchange = new OKXCustom({
        apiKey: '12345678',
        secret: '12345678',
        password: '12345678',
        forcedProxy: 'https://fakeProxy.com/',
    });

    // Privates endpoints that will be called :
    // https://fakeProxy.com/https://www.okx.com/api/v5/asset/currencies
    // https://fakeProxy.com/https://www.okx.com/api/v5/account/balance

    // Public endpoints that will be called :
    // https://www.okx.com/api/v5/public/instruments?instType=SPOT
    // https://www.okx.com/api/v5/public/instruments?instType=SWAP
    // https://www.okx.com/api/v5/public/instruments?instType=FUTURES
    // https://www.okx.com/api/v5/public/instruments?instType=OPTION

    await exchange.fetchBalance('ETH-USDT');
})();