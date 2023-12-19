// ----------------------------------------------------------------------------
/* eslint-disable */

import * as functions from './functions.js';
const {
    isNode
    , deepExtend
    , extend
    , clone
    , flatten
    , unique
    , indexBy
    , sortBy
    , sortBy2
    , safeFloat2
    , groupBy
    , aggregate
    , uuid
    , unCamelCase
    , precisionFromString
    , Throttler
    , capitalize
    , now
    , decimalToPrecision
    , safeValue
    , safeValue2
    , safeString
    , safeString2
    , seconds
    , milliseconds
    , binaryToBase16
    , numberToBE
    , base16ToBinary
    , iso8601
    , omit
    , isJsonEncodedObject
    , safeInteger
    , sum
    , omitZero
    , implodeParams
    , extractParams
    , json
    , merge
    , binaryConcat
    , hash
    , ecdsa
    , arrayConcat
    , encode
    , urlencode
    , hmac
    , numberToString
    , parseTimeframe
    , safeInteger2
    , safeStringLower
    , parse8601
    , yyyymmdd
    , safeStringUpper
    , safeTimestamp
    , binaryConcatArray
    , uuidv1
    , numberToLE
    , ymdhms
    , stringToBase64
    , decode
    , uuid22
    , safeIntegerProduct2
    , safeIntegerProduct
    , safeStringLower2
    , yymmdd
    , base58ToBinary
    , binaryToBase58
    , safeTimestamp2
    , rawencode
    , keysort
    , inArray
    , isEmpty
    , ordered
    , filterBy
    , uuid16
    , safeFloat
    , base64ToBinary
    , safeStringUpper2
    , urlencodeWithArrayRepeat
    , microseconds
    , binaryToBase64
    , strip
    , toArray
    , safeFloatN
    , safeIntegerN
    , safeIntegerProductN
    , safeTimestampN
    , safeValueN
    , safeStringN
    , safeStringLowerN
    , safeStringUpperN
    , urlencodeNested
    , parseDate
    , ymd
    , base64ToString
    , crc32
    , TRUNCATE
    , ROUND
    , DECIMAL_PLACES
    , NO_PADDING
    , TICK_SIZE
    , SIGNIFICANT_DIGITS
} = functions

import {
    keys as keysFunc,
    values as valuesFunc,
    inArray as inArrayFunc,
    vwap as vwapFunc
} from './functions.js'
// import exceptions from "./errors.js"

 import { // eslint-disable-line object-curly-newline
    ExchangeError
    , BadSymbol
    , NullResponse
    , InvalidAddress
    , InvalidOrder
    , NotSupported
    , BadResponse
    , AuthenticationError
    , DDoSProtection
    , RequestTimeout
    , NetworkError
    , ExchangeNotAvailable
    , ArgumentsRequired
    , RateLimitExceeded,
    BadRequest} from "./errors.js"

import { Precise } from './Precise.js'

//-----------------------------------------------------------------------------
import WsClient from './ws/WsClient.js';
import { createFuture, Future } from './ws/Future.js';
import { OrderBook as WsOrderBook, IndexedOrderBook, CountedOrderBook } from './ws/OrderBook.js';

// ----------------------------------------------------------------------------
//
import { axolotl } from './functions/crypto.js';
// import types
import { Market, Trade, Fee, Ticker, OHLCV, OHLCVC, Order, OrderBook, Balance, Balances, Dictionary, Transaction, DepositAddressResponse, Currency, MinMax, IndexType, Int, OrderType, OrderSide, Position, FundingRateHistory, OpenInterest, Liquidation, OrderRequest, FundingHistory, MarginMode, Tickers, Greeks, Str, Num, MarketInterface, CurrencyInterface, Account } from './types.js';
export {Market, Trade, Fee, Ticker, OHLCV, OHLCVC, Order, OrderBook, Balance, Balances, Dictionary, Transaction, DepositAddressResponse, Currency, MinMax, IndexType, Int, OrderType, OrderSide, Position, FundingRateHistory, Liquidation, FundingHistory, Greeks } from './types.js'

// ----------------------------------------------------------------------------
// move this elsewhere
import { ArrayCache, ArrayCacheByTimestamp, ArrayCacheBySymbolById, ArrayCacheBySymbolBySide } from './ws/Cache.js'
import totp from './functions/totp.js';

// ----------------------------------------------------------------------------
/**
 * @class Exchange
 */
export default class Exchange {
    options: {
        [key: string]: any;
    }

    api = undefined

    // PROXY & USER-AGENTS (see "examples/proxy-usage" file for explanation)
    proxy: any // maintained for backwards compatibility, no-one should use it from now on
    proxyUrl: string;
    proxy_url: string;
    proxyUrlCallback: any;
    proxy_url_callback: any;
    httpProxy: string;
    http_proxy: string;
    httpProxyCallback: any;
    http_proxy_callback: any;
    httpsProxy: string;
    https_proxy: string;
    httpsProxyCallback: any;
    https_proxy_callback: any;
    socksProxy: string;
    socks_proxy: string;
    socksProxyCallback: any;
    socks_proxy_callback: any;
    userAgent: { 'User-Agent': string } | false = undefined;
    user_agent: { 'User-Agent': string } | false = undefined;
    wsProxy: string;
    ws_proxy: string;
    wssProxy: string;
    wss_proxy: string;
    //
    userAgents: any = {
        'chrome': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
        'chrome39': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
        'chrome100': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36',
    };
    headers: any = {};
    forcedProxy = '';
    origin = '*' // CORS origin
    //
    agent = undefined; // maintained for backwards compatibility
    termId: string = undefined; // only for OKX
    nodeHttpModuleLoaded = false;
    httpAgent = undefined;
    httpsAgent = undefined;

    minFundingAddressLength = 1 // used in checkAddress
    substituteCommonCurrencyCodes = true  // reserved
    quoteJsonNumbers = true // treat numbers in json as quoted precise strings
    number: (numberString: string) => number = Number // or String (a pointer to a function)
    handleContentTypeApplicationZip = false

    // whether fees should be summed by currency code
    reduceFees = true

    // do not delete this line, it is needed for users to be able to define their own fetchImplementation
    fetchImplementation: any
    AbortError: any
    FetchError: any

    validateServerSsl = true
    validateClientSsl = false

    timeout       = 10000 // milliseconds
    verbose       = false
    twofa         = undefined // two-factor authentication (2FA)

    apiKey: string;
    secret: string;
    uid: string;
    login:string;
    password: string;
    privateKey: string;// a "0x"-prefixed hexstring private key for a wallet
    walletAddress: string; // a wallet address "0x"-prefixed hexstring
    token: string; // reserved for HTTP auth in some cases

    balance      = {}
    orderbooks   = {}
    tickers      = {}
    orders       = undefined
    triggerOrders = undefined
    trades: any
    transactions = {}
    ohlcvs: any
    myTrades: any
    positions: any
    urls: {
        logo?: string;
        api?: string | Dictionary<string>;
        test?: string | Dictionary<string>;
        www?: string;
        doc?: string[];
        api_management?: string;
        fees?: string;
        referral?: string;
    };

    requiresWeb3 = false
    requiresEddsa = false
    precision: {
        amount: number | undefined,
        price: number | undefined
    };

    enableLastJsonResponse = true
    enableLastHttpResponse = true
    enableLastResponseHeaders = true
    last_http_response    = undefined
    last_json_response    = undefined
    last_response_headers = undefined
    last_request_headers  = undefined
    last_request_body     = undefined
    last_request_url      = undefined
    last_request_path     = undefined

    id: string = undefined

    markets: Dictionary<any> = undefined
    has: Dictionary<boolean | 'emulated'>

    status = undefined

    requiredCredentials: {
        apiKey: boolean;
        secret: boolean;
        uid: boolean;
        login: boolean;
        password: boolean;
        twofa: boolean;
        privateKey: boolean;
        walletAddress: boolean;
        token: boolean;
    };
    rateLimit: number = undefined; // milliseconds
    tokenBucket = undefined
    throttler = undefined
    enableRateLimit: boolean = undefined;

    httpExceptions = undefined

    limits: {
        amount?: MinMax,
        cost?: MinMax,
        leverage?: MinMax,
        price?: MinMax,
    };
    fees: object;
    markets_by_id: Dictionary<any> = undefined;
    symbols: string[] = undefined;
    ids: string[] = undefined;
    currencies: Dictionary<Currency> = undefined;

    baseCurrencies = undefined
    quoteCurrencies = undefined
    currencies_by_id = undefined
    codes = undefined

    reloadingMarkets = undefined
    marketsLoading = undefined

    accounts = undefined
    accountsById = undefined

    commonCurrencies = undefined

    hostname: string = undefined;

    precisionMode: number = undefined;
    paddingMode = undefined

    exceptions = {}
    timeframes: Dictionary<number | string> = {}

    version: string = undefined;

    marketsByAltname = undefined

    name:string = undefined

    lastRestRequestTimestamp:number;

    targetAccount = undefined

    stablePairs = {}

    // WS/PRO options
    clients = {}
    newUpdates = true
    streaming = {}

    deepExtend = deepExtend
    isNode = isNode
    keys = keysFunc
    values = valuesFunc
    extend = extend
    clone = clone
    flatten = flatten
    unique = unique
    indexBy = indexBy
    sortBy = sortBy
    sortBy2 = sortBy2
    groupBy = groupBy
    aggregate = aggregate
    uuid = uuid
    unCamelCase = unCamelCase
    precisionFromString = precisionFromString
    capitalize = capitalize
    now = now
    decimalToPrecision = decimalToPrecision
    safeValue = safeValue
    safeValue2 = safeValue2
    safeString = safeString
    safeString2 = safeString2
    safeFloat = safeFloat
    safeFloat2 = safeFloat2
    seconds = seconds
    milliseconds = milliseconds
    binaryToBase16 = binaryToBase16
    numberToBE = numberToBE
    base16ToBinary = base16ToBinary
    iso8601 = iso8601
    omit = omit
    isJsonEncodedObject = isJsonEncodedObject
    safeInteger = safeInteger
    sum = sum
    omitZero = omitZero
    implodeParams = implodeParams
    extractParams = extractParams
    json = json
    vwap = vwapFunc
    merge = merge
    binaryConcat = binaryConcat
    hash = hash
    arrayConcat = arrayConcat
    encode = encode
    urlencode = urlencode
    hmac = hmac
    numberToString = numberToString
    parseTimeframe = parseTimeframe
    safeInteger2 = safeInteger2
    safeStringLower = safeStringLower
    parse8601 = parse8601
    yyyymmdd = yyyymmdd
    safeStringUpper = safeStringUpper
    safeTimestamp = safeTimestamp
    binaryConcatArray = binaryConcatArray
    uuidv1 = uuidv1
    numberToLE = numberToLE
    ymdhms = ymdhms
    yymmdd = yymmdd
    stringToBase64 = stringToBase64
    decode = decode
    uuid22 = uuid22
    safeIntegerProduct2 = safeIntegerProduct2
    safeIntegerProduct = safeIntegerProduct
    binaryToBase58 = binaryToBase58
    base58ToBinary = base58ToBinary
    base64ToBinary = base64ToBinary
    safeTimestamp2 = safeTimestamp2
    rawencode = rawencode
    keysort = keysort
    inArray = inArray
    safeStringLower2 = safeStringLower2
    safeStringUpper2 = safeStringUpper2
    isEmpty = isEmpty
    ordered = ordered
    filterBy = filterBy
    uuid16 = uuid16
    urlencodeWithArrayRepeat = urlencodeWithArrayRepeat
    microseconds = microseconds
    binaryToBase64 = binaryToBase64
    strip = strip
    toArray = toArray
    safeFloatN = safeFloatN
    safeIntegerN = safeIntegerN
    safeIntegerProductN = safeIntegerProductN
    safeTimestampN = safeTimestampN
    safeValueN = safeValueN
    safeStringN = safeStringN
    safeStringLowerN = safeStringLowerN
    safeStringUpperN = safeStringUpperN
    urlencodeNested = urlencodeNested
    parseDate = parseDate
    ymd = ymd
    base64ToString = base64ToString
    crc32 = crc32

    describe () {
        return {
            'id': undefined,
            'name': undefined,
            'countries': undefined,
            'enableRateLimit': true,
            'rateLimit': 2000, // milliseconds = seconds * 1000
            'certified': false, // if certified by the CCXT dev team
            'pro': false, // if it is integrated with CCXT Pro for WebSocket support
            'alias': false, // whether this exchange is an alias to another exchange
            'has': {
                'publicAPI': true,
                'privateAPI': true,
                'CORS': undefined,
                'spot': undefined,
                'margin': undefined,
                'swap': undefined,
                'future': undefined,
                'option': undefined,
                'addMargin': undefined,
                'cancelAllOrders': undefined,
                'cancelOrder': true,
                'cancelOrders': undefined,
                'closeAllPositions': undefined,
                'closePosition': undefined,
                'createDepositAddress': undefined,
                'createLimitOrder': true,
                'createMarketOrder': true,
                'createOrder': true,
                'createMarketBuyOrderWithCost': undefined,
                'createMarketOrderWithCost': undefined,
                'createMarketSellOrderWithCost': undefined,
                'createOrders': undefined,
                'createPostOnlyOrder': undefined,
                'createReduceOnlyOrder': undefined,
                'createStopOrder': undefined,
                'createStopLimitOrder': undefined,
                'createStopMarketOrder': undefined,
                'createOrderWs': undefined,
                'editOrderWs': undefined,
                'fetchOpenOrdersWs': undefined,
                'fetchOrderWs': undefined,
                'cancelOrderWs': undefined,
                'cancelOrdersWs': undefined,
                'cancelAllOrdersWs': undefined,
                'fetchTradesWs': undefined,
                'fetchBalanceWs': undefined,
                'editOrder': 'emulated',
                'fetchAccounts': undefined,
                'fetchBalance': true,
                'fetchBidsAsks': undefined,
                'fetchBorrowInterest': undefined,
                'fetchBorrowRateHistory': undefined,
                'fetchCanceledOrders': undefined,
                'fetchClosedOrder': undefined,
                'fetchClosedOrders': undefined,
                'fetchCrossBorrowRate': undefined,
                'fetchCrossBorrowRates': undefined,
                'fetchCurrencies': 'emulated',
                'fetchDeposit': undefined,
                'fetchDepositAddress': undefined,
                'fetchDepositAddresses': undefined,
                'fetchDepositAddressesByNetwork': undefined,
                'fetchDeposits': undefined,
                'fetchDepositsWithdrawals': undefined,
                'fetchTransactionFee': undefined,
                'fetchTransactionFees': undefined,
                'fetchFundingHistory': undefined,
                'fetchFundingRate': undefined,
                'fetchFundingRateHistory': undefined,
                'fetchFundingRates': undefined,
                'fetchIndexOHLCV': undefined,
                'fetchIsolatedBorrowRate': undefined,
                'fetchIsolatedBorrowRates': undefined,
                'fetchL2OrderBook': true,
                'fetchLastPrices': undefined,
                'fetchLedger': undefined,
                'fetchLedgerEntry': undefined,
                'fetchLeverageTiers': undefined,
                'fetchMarketLeverageTiers': undefined,
                'fetchMarkets': true,
                'fetchMarkOHLCV': undefined,
                'fetchMyTrades': undefined,
                'fetchOHLCV': undefined,
                'fetchOpenInterest': undefined,
                'fetchOpenInterestHistory': undefined,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': undefined,
                'fetchOrder': undefined,
                'fetchOrderBook': true,
                'fetchOrderBooks': undefined,
                'fetchOrders': undefined,
                'fetchOrderTrades': undefined,
                'fetchPermissions': undefined,
                'fetchPosition': undefined,
                'fetchPositions': undefined,
                'fetchPositionsForSymbol': undefined,
                'fetchPositionsRisk': undefined,
                'fetchPremiumIndexOHLCV': undefined,
                'fetchStatus': 'emulated',
                'fetchTicker': true,
                'fetchTickers': undefined,
                'fetchTime': undefined,
                'fetchTrades': true,
                'fetchTradingFee': undefined,
                'fetchTradingFees': undefined,
                'fetchTradingLimits': undefined,
                'fetchTransactions': undefined,
                'fetchTransfers': undefined,
                'fetchWithdrawAddresses': undefined,
                'fetchWithdrawal': undefined,
                'fetchWithdrawals': undefined,
                'reduceMargin': undefined,
                'setLeverage': undefined,
                'setMargin': undefined,
                'setMarginMode': undefined,
                'setPositionMode': undefined,
                'signIn': undefined,
                'transfer': undefined,
                'withdraw': undefined,
                'watchOrderBook': undefined,
                'watchOrders': undefined,
                'watchMyTrades': undefined,
                'watchTickers': undefined,
                'watchTicker': undefined,
                'watchTrades': undefined,
                'watchTradesForSymbols': undefined,
                'watchOrderBookForSymbols': undefined,
                'watchOHLCVForSymbols': undefined,
                'watchBalance': undefined,
                'watchOHLCV': undefined,
            },
            'urls': {
                'logo': undefined,
                'api': undefined,
                'www': undefined,
                'doc': undefined,
                'fees': undefined,
            },
            'api': undefined,
            'requiredCredentials': {
                'apiKey':     true,
                'secret':     true,
                'uid':        false,
                'login':      false,
                'password':   false,
                'twofa':      false, // 2-factor authentication (one-time password key)
                'privateKey': false, // a "0x"-prefixed hexstring private key for a wallet
                'walletAddress': false, // the wallet address "0x"-prefixed hexstring
                'token':      false, // reserved for HTTP auth in some cases
            },
            'markets': undefined, // to be filled manually or by fetchMarkets
            'currencies': {}, // to be filled manually or by fetchMarkets
            'timeframes': undefined, // redefine if the exchange has.fetchOHLCV
            'fees': {
                'trading': {
                    'tierBased': undefined,
                    'percentage': undefined,
                    'taker': undefined,
                    'maker': undefined,
                },
                'funding': {
                    'tierBased': undefined,
                    'percentage': undefined,
                    'withdraw': {},
                    'deposit': {},
                },
            },
            'status': {
                'status': 'ok',
                'updated': undefined,
                'eta': undefined,
                'url': undefined,
            },
            'exceptions': undefined,
            'httpExceptions': {
                '422': ExchangeError,
                '418': DDoSProtection,
                '429': RateLimitExceeded,
                '404': ExchangeNotAvailable,
                '409': ExchangeNotAvailable,
                '410': ExchangeNotAvailable,
                '451': ExchangeNotAvailable,
                '500': ExchangeNotAvailable,
                '501': ExchangeNotAvailable,
                '502': ExchangeNotAvailable,
                '520': ExchangeNotAvailable,
                '521': ExchangeNotAvailable,
                '522': ExchangeNotAvailable,
                '525': ExchangeNotAvailable,
                '526': ExchangeNotAvailable,
                '400': ExchangeNotAvailable,
                '403': ExchangeNotAvailable,
                '405': ExchangeNotAvailable,
                '503': ExchangeNotAvailable,
                '530': ExchangeNotAvailable,
                '408': RequestTimeout,
                '504': RequestTimeout,
                '401': AuthenticationError,
                '407': AuthenticationError,
                '511': AuthenticationError,
            },
            'commonCurrencies': { // gets extended/overwritten in subclasses
                'XBT': 'BTC',
                'BCC': 'BCH',
                'BCHSV': 'BSV',
            },
            'precisionMode': DECIMAL_PLACES,
            'paddingMode': NO_PADDING,
            'limits': {
                'leverage': { 'min': undefined, 'max': undefined },
                'amount': { 'min': undefined, 'max': undefined },
                'price': { 'min': undefined, 'max': undefined },
                'cost': { 'min': undefined, 'max': undefined },
            },
        } // return
    } // describe ()

    constructor (userConfig = {}) {
        Object.assign (this, functions)
        //
        //     if (isNode) {
        //         this.nodeVersion = process.version.match (/\d+\.\d+\.\d+/)[0]
        //         this.userAgent = {
        //             'User-Agent': 'ccxt/' + (Exchange as any).ccxtVersion +
        //                 ' (+https://github.com/ccxt/ccxt)' +
        //                 ' Node.js/' + this.nodeVersion + ' (JavaScript)'
        //         }
        //     }
        //
        this.options = this.getDefaultOptions(); // exchange-specific options, if any
        // fetch implementation options (JS only)
        // http properties
        this.headers = {}
        // prepended to URL, like https://proxy.com/https://exchange.com/api...
        this.forcedProxy = ''
        this.origin = '*' // CORS origin
        // underlying properties
        this.minFundingAddressLength = 1 // used in checkAddress
        this.substituteCommonCurrencyCodes = true  // reserved
        this.quoteJsonNumbers = true // treat numbers in json as quoted precise strings
        this.number = Number // or String (a pointer to a function)
        this.handleContentTypeApplicationZip = false
        // whether fees should be summed by currency code
        this.reduceFees = true
        // do not delete this line, it is needed for users to be able to define their own fetchImplementation
        this.fetchImplementation = undefined
        this.validateServerSsl = true
        this.validateClientSsl = false
        // default property values
        this.timeout       = 10000 // milliseconds
        this.verbose       = false
        this.twofa         = undefined // two-factor authentication (2FA)
        // default credentials
        this.apiKey        = undefined
        this.secret        = undefined
        this.uid           = undefined
        this.login         = undefined
        this.password      = undefined
        this.privateKey    = undefined // a "0x"-prefixed hexstring private key for a wallet
        this.walletAddress = undefined // a wallet address "0x"-prefixed hexstring
        this.token         = undefined // reserved for HTTP auth in some cases
        // placeholders for cached data
        this.balance      = {}
        this.orderbooks   = {}
        this.tickers      = {}
        this.orders       = undefined
        this.trades       = {}
        this.transactions = {}
        this.ohlcvs       = {}
        this.myTrades     = undefined
        this.positions    = undefined
        // web3 and cryptography flags
        this.requiresWeb3 = false
        this.requiresEddsa = false
        // response handling flags and properties
        this.lastRestRequestTimestamp = 0
        this.enableLastJsonResponse = true
        this.enableLastHttpResponse = true
        this.enableLastResponseHeaders = true
        this.last_http_response    = undefined
        this.last_json_response    = undefined
        this.last_response_headers = undefined
        this.last_request_headers  = undefined
        this.last_request_body     = undefined
        this.last_request_url      = undefined
        this.last_request_path     = undefined
        // camelCase and snake_notation support
        const unCamelCaseProperties = (obj = this) => {
            if (obj !== null) {
                const ownPropertyNames = Object.getOwnPropertyNames (obj)
                for (let i = 0; i < ownPropertyNames.length; i++) {
                    const k = ownPropertyNames[i]
                    this[unCamelCase (k)] = this[k]
                }
                unCamelCaseProperties (Object.getPrototypeOf (obj))
            }
        }
        unCamelCaseProperties ()
        // merge constructor overrides to this instance
        const configEntries = Object.entries (this.describe ()).concat (Object.entries (userConfig))
        for (let i = 0; i < configEntries.length; i++) {
            const [property, value] = configEntries[i]
            if (value && Object.getPrototypeOf (value) === Object.prototype) {
                this[property] = this.deepExtend (this[property], value)
            } else {
                this[property] = value
            }
        }
        // http client options
        const agentOptions = {
            'keepAlive': true,
        }
        // ssl options
        if (!this.validateServerSsl) {
            agentOptions['rejectUnauthorized'] = false;
        }
        // generate old metainfo interface
        const hasKeys = Object.keys (this.has)
        for (let i = 0; i < hasKeys.length; i++) {
            const k = hasKeys[i]
            this['has' + this.capitalize (k)] = !!this.has[k] // converts 'emulated' to true
        }
        // generate implicit api
        if (this.api) {
            this.defineRestApi (this.api, 'request')
        }
        // init the request rate limiter
        this.initRestRateLimiter ()
        // init predefined markets if any
        if (this.markets) {
            this.setMarkets (this.markets)
        }
        this.newUpdates = ((this.options as any).newUpdates !== undefined) ? (this.options as any).newUpdates : true;

        this.afterConstruct ();
    }

    encodeURIComponent (...args) {
        // @ts-expect-error
        return encodeURIComponent (...args)
    }

    checkRequiredVersion (requiredVersion, error = true) {
        let result = true
        const [ major1, minor1, patch1 ] = requiredVersion.split ('.')
            , [ major2, minor2, patch2 ] = (Exchange as any).ccxtVersion.split ('.')
            , intMajor1 = this.parseToInt (major1)
            , intMinor1 = this.parseToInt (minor1)
            , intPatch1 = this.parseToInt (patch1)
            , intMajor2 = this.parseToInt (major2)
            , intMinor2 = this.parseToInt (minor2)
            , intPatch2 = this.parseToInt (patch2)
        if (intMajor1 > intMajor2) {
            result = false
        }
        if (intMajor1 === intMajor2) {
            if (intMinor1 > intMinor2) {
                result = false
            } else if (intMinor1 === intMinor2 && intPatch1 > intPatch2) {
                result = false
            }
        }
        if (!result) {
            if (error) {
                throw new NotSupported ('Your current version of CCXT is ' + (Exchange as any).ccxtVersion + ', a newer version ' + requiredVersion + ' is required, please, upgrade your version of CCXT')
            } else {
                return error
            }
        }
        return result
    }

    checkAddress (address) {
        if (address === undefined) {
            throw new InvalidAddress (this.id + ' address is undefined')
        }
        // check the address is not the same letter like 'aaaaa' nor too short nor has a space
        if ((this.unique (address).length === 1) || address.length < this.minFundingAddressLength || address.includes (' ')) {
            throw new InvalidAddress (this.id + ' address is invalid or has less than ' + this.minFundingAddressLength.toString () + ' characters: "' + this.json (address) + '"')
        }
        return address
    }

    initRestRateLimiter () {
        if (this.rateLimit === undefined) {
            throw new Error (this.id + '.rateLimit property is not configured');
        }
        this.tokenBucket = this.extend ({
            delay: 0.001,
            capacity: 1,
            cost: 1,
            maxCapacity: 1000,
            refillRate: (this.rateLimit > 0) ? 1 / this.rateLimit : Number.MAX_VALUE,
        }, this.tokenBucket);
        this.throttler = new Throttler (this.tokenBucket);
    }

    throttle (cost = undefined, path = undefined, customExpireInterval = undefined, customPriority = undefined) {
        return this.throttler.customThrottle (cost, path, customExpireInterval, customPriority);
    }

    defineRestApiEndpoint (methodName, uppercaseMethod, lowercaseMethod, camelcaseMethod, path, paths, config = {}) {
        const splitPath = path.split (/[^a-zA-Z0-9]/)
        const camelcaseSuffix  = splitPath.map (this.capitalize).join ('')
        const underscoreSuffix = splitPath.map ((x) => x.trim ().toLowerCase ()).filter ((x) => x.length > 0).join ('_')
        const camelcasePrefix = [ paths[0] ].concat (paths.slice (1).map (this.capitalize)).join ('')
        const underscorePrefix = [ paths[0] ].concat (paths.slice (1).map ((x) => x.trim ()).filter ((x) => x.length > 0)).join ('_')
        const camelcase  = camelcasePrefix + camelcaseMethod + this.capitalize (camelcaseSuffix)
        const underscore = underscorePrefix + '_' + lowercaseMethod + '_' + underscoreSuffix
        const typeArgument = (paths.length > 1) ? paths : paths[0]
        // handle call costs here
        const partial = async (params = {}, context = {}) => this[methodName] (path, typeArgument, uppercaseMethod, params, undefined, undefined, config, context)
        // const partial = async (params) => this[methodName] (path, typeArgument, uppercaseMethod, params || {})
        this[camelcase]  = partial
        this[underscore] = partial
    }

    defineRestApi (api, methodName, paths = []) {
        const keys = Object.keys (api)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const value = api[key]
            const uppercaseMethod = key.toUpperCase ()
            const lowercaseMethod = key.toLowerCase ()
            const camelcaseMethod = this.capitalize (lowercaseMethod)
            if (Array.isArray (value)) {
                for (let k = 0; k < value.length; k++) {
                    const path = value[k].trim ()
                    this.defineRestApiEndpoint (methodName, uppercaseMethod, lowercaseMethod, camelcaseMethod, path, paths)
                }
            // the options HTTP method conflicts with the 'options' API url path
            // } else if (key.match (/^(?:get|post|put|delete|options|head|patch)$/i)) {
            } else if (key.match (/^(?:get|post|put|delete|head|patch)$/i)) {
                const endpoints = Object.keys (value);
                for (let j = 0; j < endpoints.length; j++) {
                    const endpoint = endpoints[j]
                    const path = endpoint.trim ()
                    const config = value[endpoint]
                    if (typeof config === 'object') {
                        this.defineRestApiEndpoint (methodName, uppercaseMethod, lowercaseMethod, camelcaseMethod, path, paths, config)
                    } else if (typeof config === 'number') {
                        this.defineRestApiEndpoint (methodName, uppercaseMethod, lowercaseMethod, camelcaseMethod, path, paths, { cost: config })
                    } else {
                        throw new NotSupported (this.id + ' defineRestApi() API format is not supported, API leafs must strings, objects or numbers');
                    }
                }
            } else {
                this.defineRestApi (value, methodName, paths.concat ([ key ]))
            }
        }
    }

    log (... args) {
        console.log (... args)
    }

    httpProxyAgentModule:any = undefined;
    httpsProxyAgentModule:any = undefined;
    socksProxyAgentModule:any = undefined;
    socksProxyAgentModuleChecked:boolean = false;
    proxyDictionaries:any = {};
    proxyModulesLoaded:boolean = false;

    async loadProxyModules () {
        this.proxyModulesLoaded = true;
        // todo: possible sync alternatives: https://stackoverflow.com/questions/51069002/convert-import-to-synchronous
        this.httpProxyAgentModule = await import (/* webpackIgnore: true */ '../static_dependencies/proxies/http-proxy-agent/index.js');
        this.httpsProxyAgentModule = await import (/* webpackIgnore: true */ '../static_dependencies/proxies/https-proxy-agent/index.js');
        if (this.socksProxyAgentModuleChecked === false) {
            this.socksProxyAgentModuleChecked = true;
            try {
                // @ts-ignore
                this.socksProxyAgentModule = await import (/* webpackIgnore: true */ 'socks-proxy-agent');
            } catch (e) {}
        }
    }

    setProxyAgents (httpProxy, httpsProxy, socksProxy) {
        let chosenAgent = undefined;
        if (httpProxy) {
            if (this.httpProxyAgentModule === undefined) {
                throw new NotSupported (this.id + ' you need to load JS proxy modules with `.loadProxyModules()` method at first to use proxies');
            }
            if (!(httpProxy in this.proxyDictionaries)) {
                this.proxyDictionaries[httpProxy] = new this.httpProxyAgentModule.HttpProxyAgent(httpProxy);
            }
            chosenAgent = this.proxyDictionaries[httpProxy];
        } else if (httpsProxy) {
            if (this.httpsProxyAgentModule === undefined) {
                throw new NotSupported (this.id + ' you need to load JS proxy modules with `.loadProxyModules()` method at first to use proxies');
            }
            if (!(httpsProxy in this.proxyDictionaries)) {
                this.proxyDictionaries[httpsProxy] = new this.httpsProxyAgentModule.HttpsProxyAgent(httpsProxy);
            }
            chosenAgent = this.proxyDictionaries[httpsProxy];
            chosenAgent.keepAlive = true;
        } else if (socksProxy) {
            if (this.socksProxyAgentModule === undefined) {
                throw new NotSupported (this.id + ' - to use SOCKS proxy with ccxt, at first you need install module "npm i socks-proxy-agent" and then initialize proxies with `.loadProxyModules()` method');
            }
            if (!(socksProxy in this.proxyDictionaries)) {
                this.proxyDictionaries[socksProxy] = new this.socksProxyAgentModule.SocksProxyAgent(socksProxy);
            }
            chosenAgent = this.proxyDictionaries[socksProxy];
        }
        return chosenAgent;
    }

    async fetch (url, method = 'GET', headers: any = undefined, body: any = undefined) {

        // load node-http(s) modules only on first call
        if (isNode) {
            if (!this.nodeHttpModuleLoaded) {
                this.nodeHttpModuleLoaded = true;
                const httpsModule = await import (/* webpackIgnore: true */'node:https')
                this.httpsAgent = new httpsModule.Agent ({ keepAlive: true });
            }
        }

        // ##### PROXY & HEADERS #####
        headers = this.extend (this.headers, headers);
        // proxy-url
        const proxyUrl = this.checkProxyUrlSettings (url, method, headers, body);
        let isHttpAgentNeeded = false;
        if (proxyUrl !== undefined) {
            // in node we need to set header to *
            if (isNode) {
                headers = this.extend ({ 'Origin': this.origin }, headers);
                if (proxyUrl.substring(0, 5) !== 'https') {
                    // for `http://` protocol proxy-urls, we need to load `http` module only on first call
                    if (!this.httpAgent) {
                        const httpModule = await import (/* webpackIgnore: true */'node:http')
                        this.httpAgent = new httpModule.Agent ();
                    }
                    isHttpAgentNeeded = true;
                }
            }
            url = proxyUrl + url;
        }
        // proxy agents
        const [ httpProxy, httpsProxy, socksProxy ] = this.checkProxySettings (url, method, headers, body);
        this.checkConflictingProxies (httpProxy || httpsProxy || socksProxy, proxyUrl);
        // if (!this.proxyModulesLoaded) {
        //     await this.loadProxyModules (); // this is needed in JS, independently whether proxy properties were set or not, we have to load them because of necessity in WS, which would happen beyond 'fetch' method (WS/etc)
        // }
        const chosenAgent = this.setProxyAgents (httpProxy, httpsProxy, socksProxy);
        // user-agent
        const userAgent = (this.userAgent !== undefined) ? this.userAgent : this.user_agent;
        if (userAgent && isNode) {
            if (typeof userAgent === 'string') {
                headers = this.extend ({ 'User-Agent': userAgent }, headers);
            } else if ((typeof userAgent === 'object') && ('User-Agent' in userAgent)) {
                headers = this.extend (userAgent, headers);
            }
        }
        // set final headers
        headers = this.setHeaders (headers);
        // log
        if (this.verbose) {
            this.log ("fetch Request:\n", this.id, method, url, "\nRequestHeaders:\n", headers, "\nRequestBody:\n", body, "\n")
        }
        // end of proxies & headers

        if (this.fetchImplementation === undefined) {
            if (isNode) {
                const module = await import (/* webpackIgnore: true */'../static_dependencies/node-fetch/index.js')
                if (this.agent === undefined) {
                    this.agent = this.httpsAgent;
                }
                this.AbortError = module.AbortError
                this.fetchImplementation = module.default
                this.FetchError = module.FetchError
            } else {
                this.fetchImplementation = self.fetch
                this.AbortError = DOMException
                this.FetchError = TypeError
            }
        }
        // fetchImplementation cannot be called on this. in browsers:
        // TypeError Failed to execute 'fetch' on 'Window': Illegal invocation
        const fetchImplementation = this.fetchImplementation;
        const params = { method, headers, body, timeout: this.timeout };
        if (this.agent) {
            params['agent'] = this.agent;
        }
        // override agent, if needed
        if (isHttpAgentNeeded) {
            // if proxyUrl is being used, so we don't overwrite `this.agent` itself
            params['agent'] = this.httpAgent;
        } else if (chosenAgent) {
            // if http(s)Proxy is being used
            params['agent'] = chosenAgent;
        }
        const controller = new AbortController ()
        params['signal'] = controller.signal
        const timeout = setTimeout (() => {
            controller.abort ()
        }, this.timeout)
        try {
            const response = await fetchImplementation (url, params)
            clearTimeout (timeout)
            return this.handleRestResponse (response, url, method, headers, body);
        } catch (e) {
            if (e instanceof this.AbortError) {
                throw new RequestTimeout (this.id + ' ' + method + ' ' + url + ' request timed out (' + this.timeout + ' ms)');
            } else if (e instanceof this.FetchError) {
                throw new NetworkError (this.id + ' ' + method + ' ' + url + ' fetch failed');
            }
            throw e
        }
    }

    parseJson (jsonString) {
        try {
            if (this.isJsonEncodedObject (jsonString)) {
                return JSON.parse (this.onJsonResponse (jsonString))
            }
        } catch (e) {
            // SyntaxError
            return undefined
        }
    }

    getResponseHeaders (response) {
        const result = {}
        response.headers.forEach ((value, key) => {
            key = key.split ('-').map ((word) => this.capitalize (word)).join ('-')
            result[key] = value
        })
        return result
    }

    handleRestResponse (response, url, method = 'GET', requestHeaders = undefined, requestBody = undefined) {
        const responseHeaders = this.getResponseHeaders (response)
        if (this.handleContentTypeApplicationZip && (responseHeaders['Content-Type'] === 'application/zip')) {
            const responseBuffer = response.buffer ();
            if (this.enableLastResponseHeaders) {
                this.last_response_headers = responseHeaders
            }
            if (this.enableLastHttpResponse) {
                this.last_http_response = responseBuffer
            }
            if (this.verbose) {
                this.log ("handleRestResponse:\n", this.id, method, url, response.status, response.statusText, "\nResponseHeaders:\n", responseHeaders, "ZIP redacted", "\n")
            }
            // no error handler needed, because it would not be a zip response in case of an error
            return responseBuffer;
        }
        return response.text ().then ((responseBody) => {
            const bodyText = this.onRestResponse (response.status, response.statusText, url, method, responseHeaders, responseBody, requestHeaders, requestBody);
            const json = this.parseJson (bodyText)
            if (this.enableLastResponseHeaders) {
                this.last_response_headers = responseHeaders
            }
            if (this.enableLastHttpResponse) {
                this.last_http_response = responseBody
            }
            if (this.enableLastJsonResponse) {
                this.last_json_response = json
            }
            if (this.verbose) {
                this.log ("handleRestResponse:\n", this.id, method, url, response.status, response.statusText, "\nResponseHeaders:\n", responseHeaders, "\nResponseBody:\n", responseBody, "\n")
            }
            const skipFurtherErrorHandling = this.handleErrors (response.status, response.statusText, url, method, responseHeaders, responseBody, json, requestHeaders, requestBody)
            if (!skipFurtherErrorHandling) {
                this.handleHttpStatusCode (response.status, response.statusText, url, method, responseBody)
            }
            return json || responseBody
        })
    }

    onRestResponse (statusCode, statusText, url, method, responseHeaders, responseBody, requestHeaders, requestBody) {
        return responseBody.trim ()
    }

    onJsonResponse (responseBody) {
        return this.quoteJsonNumbers ? responseBody.replace (/":([+.0-9eE-]+)([,}])/g, '":"$1"$2') : responseBody;
    }

    async loadMarketsHelper (reload = false, params = {}) {
        if (!reload && this.markets) {
            if (!this.markets_by_id) {
                return this.setMarkets (this.markets)
            }
            return this.markets
        }
        let currencies = undefined
        // only call if exchange API provides endpoint (true), thus avoid emulated versions ('emulated')
        if (this.has['fetchCurrencies'] === true) {
            currencies = await this.fetchCurrencies ()
        }
        const markets = await this.fetchMarkets (params)
        return this.setMarkets (markets, currencies)
    }

    loadMarkets (reload = false, params = {}): Promise<Dictionary<Market>> {
        // this method is async, it returns a promise
        if ((reload && !this.reloadingMarkets) || !this.marketsLoading) {
            this.reloadingMarkets = true
            this.marketsLoading = this.loadMarketsHelper (reload, params).then ((resolved) => {
                this.reloadingMarkets = false
                return resolved
            }, (error) => {
                this.reloadingMarkets = false
                throw error
            })
        }
        return this.marketsLoading
    }

    fetchCurrencies (params = {}) {
        // markets are returned as a list
        // currencies are returned as a dict
        // this is for historical reasons
        // and may be changed for consistency later
        return new Promise ((resolve, reject) => resolve (this.currencies));
    }

    fetchMarkets (params = {}): Promise<Market[]> {
        // markets are returned as a list
        // currencies are returned as a dict
        // this is for historical reasons
        // and may be changed for consistency later
        return new Promise ((resolve, reject) => resolve (Object.values (this.markets)))
    }

    checkRequiredDependencies () {
        return
    }

    parseNumber (value, d: number = undefined): number {
        if (value === undefined) {
            return d
        } else {
            try {
                return this.number (value)
            } catch (e) {
                return d
            }
        }
    }

    checkOrderArguments (market, type, side, amount, price, params) {
        if (price === undefined) {
            if (type === 'limit') {
                  throw new ArgumentsRequired (this.id + ' createOrder() requires a price argument for a limit order');
            }
        }
        if (amount <= 0) {
            throw new ArgumentsRequired (this.id + ' createOrder() amount should be above 0');
        }
    }

    handleHttpStatusCode (code, reason, url, method, body) {
        const codeAsString = code.toString ();
        if (codeAsString in this.httpExceptions) {
            const ErrorClass = this.httpExceptions[codeAsString];
            throw new ErrorClass (this.id + ' ' + method + ' ' + url + ' ' + codeAsString + ' ' + reason + ' ' + body);
        }
    }

    remove0xPrefix (hexData) {
        if (hexData.slice (0, 2) === '0x') {
            return hexData.slice (2);
        } else {
            return hexData;
        }
    }

    spawn (method, ... args): Future {
        const future = createFuture ()
        method.apply (this, args).then (future.resolve).catch (future.reject)
        return future
    }

    delay (timeout, method, ... args) {
        setTimeout (() => {
            this.spawn (method, ... args)
        }, timeout);
    }

    // -----------------------------------------------------------------------
    // -----------------------------------------------------------------------
    // WS/PRO methods

    orderBook (snapshot = {}, depth = Number.MAX_SAFE_INTEGER) {
        return new WsOrderBook (snapshot, depth);
    }

    indexedOrderBook (snapshot = {}, depth = Number.MAX_SAFE_INTEGER) {
        return new IndexedOrderBook (snapshot, depth);
    }

    countedOrderBook (snapshot = {}, depth = Number.MAX_SAFE_INTEGER) {
        return new CountedOrderBook (snapshot, depth);
    }

    handleMessage (client, message) {} // stub to override

    // ping (client) {} // stub to override

    client (url): WsClient {
        this.clients = this.clients || {};
        if (!this.clients[url]) {
            const onMessage = this.handleMessage.bind (this);
            const onError = this.onError.bind (this);
            const onClose = this.onClose.bind (this);
            const onConnected = this.onConnected.bind (this);
            // decide client type here: ws / signalr / socketio
            const wsOptions = this.safeValue (this.options, 'ws', {});
            // proxy agents
            const [ httpProxy, httpsProxy, socksProxy ] = this.checkWsProxySettings ();
            const chosenAgent = this.setProxyAgents (httpProxy, httpsProxy, socksProxy);
            const finalAgent = chosenAgent ? chosenAgent : this.agent;
            //
            const options = this.deepExtend (this.streaming, {
                'log': this.log ? this.log.bind (this) : this.log,
                'ping': (this as any).ping ? (this as any).ping.bind (this) : (this as any).ping,
                'verbose': this.verbose,
                'throttler': new Throttler (this.tokenBucket),
                // add support for proxies
                'options': {
                    'agent': finalAgent,
                }
            }, wsOptions);
            this.clients[url] = new WsClient (url, onMessage, onError, onClose, onConnected, options);
        }
        return this.clients[url];
    }

    watch (url, messageHash, message = undefined, subscribeHash = undefined, subscription = undefined) {
        //
        // Without comments the code of this method is short and easy:
        //
        //     const client = this.client (url)
        //     const backoffDelay = 0
        //     const future = client.future (messageHash)
        //     const connected = client.connect (backoffDelay)
        //     connected.then (() => {
        //         if (message && !client.subscriptions[subscribeHash]) {
        //             client.subscriptions[subscribeHash] = true
        //             client.send (message)
        //         }
        //     }).catch ((error) => {})
        //     return future
        //
        // The following is a longer version of this method with comments
        //
        const client = this.client (url) as WsClient;
        // todo: calculate the backoff using the clients cache
        const backoffDelay = 0;
        //
        //  watchOrderBook ---- future ----+---------------+----→ user
        //                                 |               |
        //                                 ↓               ↑
        //                                 |               |
        //                              connect ......→ resolve
        //                                 |               |
        //                                 ↓               ↑
        //                                 |               |
        //                             subscribe -----→ receive
        //
        if ((subscribeHash === undefined) && (messageHash in client.futures)) {
            return client.futures[messageHash];
        }
        const future = client.future (messageHash);
        // read and write subscription, this is done before connecting the client
        // to avoid race conditions when other parts of the code read or write to the client.subscriptions
        const clientSubscription = client.subscriptions[subscribeHash];
        if (!clientSubscription) {
            client.subscriptions[subscribeHash] = subscription || true;
        }
        // we intentionally do not use await here to avoid unhandled exceptions
        // the policy is to make sure that 100% of promises are resolved or rejected
        // either with a call to client.resolve or client.reject with
        //  a proper exception class instance
        const connected = client.connect (backoffDelay);
        // the following is executed only if the catch-clause does not
        // catch any connection-level exceptions from the client
        // (connection established successfully)
        if (!clientSubscription) {
            connected.then (() => {
                    const options = this.safeValue (this.options, 'ws');
                    const cost = this.safeValue (options, 'cost', 1);
                    if (message) {
                        if (this.enableRateLimit && client.throttle) {
                            // add cost here |
                            //               |
                            //               V
                            client.throttle (cost).then (() => {
                                client.send (message);
                            }).catch ((e) => {
                                delete client.subscriptions[subscribeHash];
                                future.reject (e);
                            });
                        } else {
                            client.send (message)
                            .catch ((e) => {
                                delete client.subscriptions[subscribeHash];
                                future.reject (e);
                            });
                        }
                    }
                }).catch ((e)=> {
                    delete client.subscriptions[subscribeHash];
                    future.reject (e);
            });
        }
        return future;
    }

    onConnected (client, message = undefined) {
        // for user hooks
        // console.log ('Connected to', client.url)
    }

    onError (client, error) {
        if ((client.url in this.clients) && (this.clients[client.url].error)) {
            delete this.clients[client.url];
        }
    }

    onClose (client, error) {
        if (client.error) {
            // connection closed due to an error, do nothing
        } else {
            // server disconnected a working connection
            if (this.clients[client.url]) {
                delete this.clients[client.url];
            }
        }
    }

    async close () {
        const clients = Object.values (this.clients || {});
        const closedClients = [];
        for (let i = 0; i < clients.length; i++) {
            const client = clients[i] as WsClient;
            delete this.clients[client.url];
            closedClients.push(client.close ());
        }
        return Promise.all (closedClients);
    }

    async loadOrderBook (client, messageHash, symbol, limit = undefined, params = {}) {
        if (!(symbol in this.orderbooks)) {
            client.reject (new ExchangeError (this.id + ' loadOrderBook() orderbook is not initiated'), messageHash);
            return;
        }
        const maxRetries = this.handleOption ('watchOrderBook', 'snapshotMaxRetries', 3);
        let tries = 0;
        try {
            const stored = this.orderbooks[symbol];
            while (tries < maxRetries) {
                const cache = stored.cache;
                const orderBook = await this.fetchRestOrderBookSafe (symbol, limit, params);
                const index = this.getCacheIndex (orderBook, cache);
                if (index >= 0) {
                    stored.reset (orderBook);
                    this.handleDeltas (stored, cache.slice (index));
                    stored.cache.length = 0;
                    client.resolve (stored, messageHash);
                    return;
                }
                tries++;
            }
            client.reject (new ExchangeError (this.id + ' nonce is behind the cache after ' + maxRetries.toString () + ' tries.'), messageHash);
            delete this.clients[client.url];
        } catch (e) {
            client.reject (e, messageHash);
            await this.loadOrderBook (client, messageHash, symbol, limit, params);
        }
    }

    convertToBigInt(value: string) {
        return BigInt(value); // used on XT
    }

    stringToCharsArray (value) {
        return value.split ('');
    }

    valueIsDefined(value){
        return value !== undefined && value !== null;
    }

    arraySlice(array, first, second = undefined) {
        if (second === undefined) {
            return array.slice(first);
        }
        return array.slice(first, second);
    }

    getProperty (obj, property, defaultValue = undefined) {
        return (property in obj ? obj[property] : defaultValue);
    }

    setProperty (obj, property, defaultValue = undefined) {
        obj[property] = defaultValue;
    }

    axolotl(payload, hexKey, ed25519) {
        return axolotl(payload, hexKey, ed25519);
    }

    /* eslint-enable */
    // ------------------------------------------------------------------------

    // ########################################################################
    // ########################################################################
    // ########################################################################
    // ########################################################################
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########        ########################        ########################
    // ########        ########################        ########################
    // ########        ########################        ########################
    // ########        ########################        ########################
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########                        ########                        ########
    // ########################################################################
    // ########################################################################
    // ########################################################################
    // ########################################################################
    // ########        ########        ########                        ########
    // ########        ########        ########                        ########
    // ########        ########        ########                        ########
    // ########        ########        ########                        ########
    // ################        ########################        ################
    // ################        ########################        ################
    // ################        ########################        ################
    // ################        ########################        ################
    // ########        ########        ################        ################
    // ########        ########        ################        ################
    // ########        ########        ################        ################
    // ########        ########        ################        ################
    // ########################################################################
    // ########################################################################
    // ########################################################################
    // ########################################################################

    // ------------------------------------------------------------------------
    // METHODS BELOW THIS LINE ARE TRANSPILED FROM JAVASCRIPT TO PYTHON AND PHP

    handleDeltas (orderbook, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta (orderbook, deltas[i]);
        }
    }

    handleDelta (bookside, delta) {
        throw new NotSupported (this.id + ' handleDelta not supported yet');
    }

    getCacheIndex (orderbook, deltas) {
        // return the first index of the cache that can be applied to the orderbook or -1 if not possible
        return -1;
    }

    findTimeframe (timeframe, timeframes = undefined) {
        if (timeframes === undefined) {
            timeframes = this.timeframes;
        }
        const keys = Object.keys (timeframes);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (timeframes[key] === timeframe) {
                return key;
            }
        }
        return undefined;
    }

    checkProxyUrlSettings (url = undefined, method = undefined, headers = undefined, body = undefined) {
        const usedProxies = [];
        let proxyUrl = undefined;
        if (this.proxyUrl !== undefined) {
            usedProxies.push ('proxyUrl');
            proxyUrl = this.proxyUrl;
        }
        if (this.proxy_url !== undefined) {
            usedProxies.push ('proxy_url');
            proxyUrl = this.proxy_url;
        }
        if (this.proxyUrlCallback !== undefined) {
            usedProxies.push ('proxyUrlCallback');
            proxyUrl = this.proxyUrlCallback (url, method, headers, body);
        }
        if (this.proxy_url_callback !== undefined) {
            usedProxies.push ('proxy_url_callback');
            proxyUrl = this.proxy_url_callback (url, method, headers, body);
        }
        // backwards-compatibility
        if (this.proxy !== undefined) {
            usedProxies.push ('proxy');
            if (typeof this.proxy === 'function') {
                proxyUrl = this.proxy (url, method, headers, body);
            } else {
                proxyUrl = this.proxy;
            }
        }
        const length = usedProxies.length;
        if (length > 1) {
            const joinedProxyNames = usedProxies.join (',');
            throw new ExchangeError (this.id + ' you have multiple conflicting proxy_url settings (' + joinedProxyNames + '), please use only one from : proxyUrl, proxy_url, proxyUrlCallback, proxy_url_callback');
        }
        return proxyUrl;
    }

    checkProxySettings (url = undefined, method = undefined, headers = undefined, body = undefined) {
        const usedProxies = [];
        let httpProxy = undefined;
        let httpsProxy = undefined;
        let socksProxy = undefined;
        // httpProxy
        if (this.httpProxy !== undefined) {
            usedProxies.push ('httpProxy');
            httpProxy = this.httpProxy;
        }
        if (this.http_proxy !== undefined) {
            usedProxies.push ('http_proxy');
            httpProxy = this.http_proxy;
        }
        if (this.httpProxyCallback !== undefined) {
            usedProxies.push ('httpProxyCallback');
            httpProxy = this.httpProxyCallback (url, method, headers, body);
        }
        if (this.http_proxy_callback !== undefined) {
            usedProxies.push ('http_proxy_callback');
            httpProxy = this.http_proxy_callback (url, method, headers, body);
        }
        // httpsProxy
        if (this.httpsProxy !== undefined) {
            usedProxies.push ('httpsProxy');
            httpsProxy = this.httpsProxy;
        }
        if (this.https_proxy !== undefined) {
            usedProxies.push ('https_proxy');
            httpsProxy = this.https_proxy;
        }
        if (this.httpsProxyCallback !== undefined) {
            usedProxies.push ('httpsProxyCallback');
            httpsProxy = this.httpsProxyCallback (url, method, headers, body);
        }
        if (this.https_proxy_callback !== undefined) {
            usedProxies.push ('https_proxy_callback');
            httpsProxy = this.https_proxy_callback (url, method, headers, body);
        }
        // socksProxy
        if (this.socksProxy !== undefined) {
            usedProxies.push ('socksProxy');
            socksProxy = this.socksProxy;
        }
        if (this.socks_proxy !== undefined) {
            usedProxies.push ('socks_proxy');
            socksProxy = this.socks_proxy;
        }
        if (this.socksProxyCallback !== undefined) {
            usedProxies.push ('socksProxyCallback');
            socksProxy = this.socksProxyCallback (url, method, headers, body);
        }
        if (this.socks_proxy_callback !== undefined) {
            usedProxies.push ('socks_proxy_callback');
            socksProxy = this.socks_proxy_callback (url, method, headers, body);
        }
        // check
        const length = usedProxies.length;
        if (length > 1) {
            const joinedProxyNames = usedProxies.join (',');
            throw new ExchangeError (this.id + ' you have multiple conflicting settings (' + joinedProxyNames + '), please use only one from: httpProxy, httpsProxy, httpProxyCallback, httpsProxyCallback, socksProxy, socksProxyCallback');
        }
        return [ httpProxy, httpsProxy, socksProxy ];
    }

    checkWsProxySettings () {
        const usedProxies = [];
        let wsProxy = undefined;
        let wssProxy = undefined;
        // wsProxy
        if (this.wsProxy !== undefined) {
            usedProxies.push ('wsProxy');
            wsProxy = this.wsProxy;
        }
        if (this.ws_proxy !== undefined) {
            usedProxies.push ('ws_proxy');
            wsProxy = this.ws_proxy;
        }
        // wsProxy
        if (this.wssProxy !== undefined) {
            usedProxies.push ('wssProxy');
            wssProxy = this.wssProxy;
        }
        if (this.wss_proxy !== undefined) {
            usedProxies.push ('wss_proxy');
            wssProxy = this.wss_proxy;
        }
        // check
        const length = usedProxies.length;
        if (length > 1) {
            const joinedProxyNames = usedProxies.join (',');
            throw new ExchangeError (this.id + ' you have multiple conflicting settings (' + joinedProxyNames + '), please use only one from: wsProxy, wssProxy');
        }
        return [ wsProxy, wssProxy ];
    }

    checkConflictingProxies (proxyAgentSet, proxyUrlSet) {
        if (proxyAgentSet && proxyUrlSet) {
            throw new ExchangeError (this.id + ' you have multiple conflicting proxy settings, please use only one from : proxyUrl, httpProxy, httpsProxy, socksProxy');
        }
    }

    findMessageHashes (client, element: string): string[] {
        const result = [];
        const messageHashes = Object.keys (client.futures);
        for (let i = 0; i < messageHashes.length; i++) {
            const messageHash = messageHashes[i];
            if (messageHash.indexOf (element) >= 0) {
                result.push (messageHash);
            }
        }
        return result;
    }

    filterByLimit (array: object[], limit: Int = undefined, key: IndexType = 'timestamp'): any {
        if (this.valueIsDefined (limit)) {
            const arrayLength = array.length;
            if (arrayLength > 0) {
                let ascending = true;
                if ((key in array[0])) {
                    const first = array[0][key];
                    const last = array[arrayLength - 1][key];
                    if (first !== undefined && last !== undefined) {
                        ascending = first <= last;  // true if array is sorted in ascending order based on 'timestamp'
                    }
                }
                array = ascending ? this.arraySlice (array, -limit) : this.arraySlice (array, 0, limit);
            }
        }
        return array;
    }

    filterBySinceLimit (array: object[], since: Int = undefined, limit: Int = undefined, key: IndexType = 'timestamp', tail = false): any {
        const sinceIsDefined = this.valueIsDefined (since);
        const parsedArray = this.toArray (array) as any;
        let result = parsedArray;
        if (sinceIsDefined) {
            result = [ ];
            for (let i = 0; i < parsedArray.length; i++) {
                const entry = parsedArray[i];
                const value = this.safeValue (entry, key);
                if (value && (value >= since)) {
                    result.push (entry);
                }
            }
        }
        if (tail && limit !== undefined) {
            return this.arraySlice (result, -limit);
        }
        return this.filterByLimit (result, limit, key);
    }

    filterByValueSinceLimit (array: object[], field: IndexType, value = undefined, since: Int = undefined, limit: Int = undefined, key = 'timestamp', tail = false): any {
        const valueIsDefined = this.valueIsDefined (value);
        const sinceIsDefined = this.valueIsDefined (since);
        const parsedArray = this.toArray (array) as any;
        let result = parsedArray;
        // single-pass filter for both symbol and since
        if (valueIsDefined || sinceIsDefined) {
            result = [ ];
            for (let i = 0; i < parsedArray.length; i++) {
                const entry = parsedArray[i];
                const entryFiledEqualValue = entry[field] === value;
                const firstCondition = valueIsDefined ? entryFiledEqualValue : true;
                const entryKeyValue = this.safeValue (entry, key);
                const entryKeyGESince = (entryKeyValue) && since && (entryKeyValue >= since);
                const secondCondition = sinceIsDefined ? entryKeyGESince : true;
                if (firstCondition && secondCondition) {
                    result.push (entry);
                }
            }
        }
        if (tail && limit !== undefined) {
            return this.arraySlice (result, -limit);
        }
        return this.filterByLimit (result, limit, key);
    }

    setSandboxMode (enabled) {
        if (enabled) {
            if ('test' in this.urls) {
                if (typeof this.urls['api'] === 'string') {
                    this.urls['apiBackup'] = this.urls['api'];
                    this.urls['api'] = this.urls['test'];
                } else {
                    this.urls['apiBackup'] = this.clone (this.urls['api']);
                    this.urls['api'] = this.clone (this.urls['test']);
                }
            } else {
                throw new NotSupported (this.id + ' does not have a sandbox URL');
            }
        } else if ('apiBackup' in this.urls) {
            if (typeof this.urls['api'] === 'string') {
                this.urls['api'] = this.urls['apiBackup'] as any;
            } else {
                this.urls['api'] = this.clone (this.urls['apiBackup']);
            }
            const newUrls = this.omit (this.urls, 'apiBackup');
            this.urls = newUrls;
        }
    }

    sign (path, api: any = 'public', method = 'GET', params = {}, headers: any = undefined, body: any = undefined) {
        return {};
    }

    async fetchAccounts (params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchAccounts() is not supported yet');
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' fetchTrades() is not supported yet');
    }

    async fetchTradesWs (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' fetchTradesWs() is not supported yet');
    }

    async watchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' watchTrades() is not supported yet');
    }

    async watchTradesForSymbols (symbols: string[], since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' watchTradesForSymbols() is not supported yet');
    }

    async watchMyTradesForSymbols (symbols: string[], since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' watchMyTradesForSymbols() is not supported yet');
    }

    async watchOrdersForSymbols (symbols: string[], since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' watchOrdersForSymbols() is not supported yet');
    }

    async watchOHLCVForSymbols (symbolsAndTimeframes: string[][], since: Int = undefined, limit: Int = undefined, params = {}): Promise<Dictionary<Dictionary<OHLCV[]>>> {
        throw new NotSupported (this.id + ' watchOHLCVForSymbols() is not supported yet');
    }

    async watchOrderBookForSymbols (symbols: string[], limit: Int = undefined, params = {}): Promise<OrderBook> {
        throw new NotSupported (this.id + ' watchOrderBookForSymbols() is not supported yet');
    }

    async fetchDepositAddresses (codes: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchDepositAddresses() is not supported yet');
    }

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        throw new NotSupported (this.id + ' fetchOrderBook() is not supported yet');
    }

    async fetchMarginMode (symbol: string = undefined, params = {}): Promise<MarginMode> {
        throw new NotSupported (this.id + ' fetchMarginMode() is not supported yet');
    }

    async fetchRestOrderBookSafe (symbol, limit = undefined, params = {}) {
        const fetchSnapshotMaxRetries = this.handleOption ('watchOrderBook', 'maxRetries', 3);
        for (let i = 0; i < fetchSnapshotMaxRetries; i++) {
            try {
                const orderBook = await this.fetchOrderBook (symbol, limit, params);
                return orderBook;
            } catch (e) {
                if ((i + 1) === fetchSnapshotMaxRetries) {
                    throw e;
                }
            }
        }
        return undefined;
    }

    async watchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        throw new NotSupported (this.id + ' watchOrderBook() is not supported yet');
    }

    async fetchTime (params = {}): Promise<Int> {
        throw new NotSupported (this.id + ' fetchTime() is not supported yet');
    }

    async fetchTradingLimits (symbols: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchTradingLimits() is not supported yet');
    }

    parseMarket (market): Market {
        throw new NotSupported (this.id + ' parseMarket() is not supported yet');
    }

    parseMarkets (markets): Market[] {
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseTicker (ticker: object, market: Market = undefined): Ticker {
        throw new NotSupported (this.id + ' parseTicker() is not supported yet');
    }

    parseDepositAddress (depositAddress, currency: Currency = undefined) {
        throw new NotSupported (this.id + ' parseDepositAddress() is not supported yet');
    }

    parseTrade (trade: object, market: Market = undefined): Trade {
        throw new NotSupported (this.id + ' parseTrade() is not supported yet');
    }

    parseTransaction (transaction, currency: Currency = undefined) {
        throw new NotSupported (this.id + ' parseTransaction() is not supported yet');
    }

    parseTransfer (transfer, currency: Currency = undefined) {
        throw new NotSupported (this.id + ' parseTransfer() is not supported yet');
    }

    parseAccount (account) {
        throw new NotSupported (this.id + ' parseAccount() is not supported yet');
    }

    parseLedgerEntry (item, currency: Currency = undefined) {
        throw new NotSupported (this.id + ' parseLedgerEntry() is not supported yet');
    }

    parseOrder (order, market: Market = undefined): Order {
        throw new NotSupported (this.id + ' parseOrder() is not supported yet');
    }

    async fetchCrossBorrowRates (params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchCrossBorrowRates() is not supported yet');
    }

    async fetchIsolatedBorrowRates (params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchIsolatedBorrowRates() is not supported yet');
    }

    parseMarketLeverageTiers (info, market: Market = undefined) {
        throw new NotSupported (this.id + ' parseMarketLeverageTiers() is not supported yet');
    }

    async fetchLeverageTiers (symbols: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchLeverageTiers() is not supported yet');
    }

    parsePosition (position, market: Market = undefined) {
        throw new NotSupported (this.id + ' parsePosition() is not supported yet');
    }

    parseFundingRateHistory (info, market: Market = undefined): FundingRateHistory {
        throw new NotSupported (this.id + ' parseFundingRateHistory() is not supported yet');
    }

    parseBorrowInterest (info, market: Market = undefined) {
        throw new NotSupported (this.id + ' parseBorrowInterest() is not supported yet');
    }

    parseWsTrade (trade, market: Market = undefined): Trade {
        throw new NotSupported (this.id + ' parseWsTrade() is not supported yet');
    }

    parseWsOrder (order, market: Market = undefined): Order {
        throw new NotSupported (this.id + ' parseWsOrder() is not supported yet');
    }

    parseWsOrderTrade (trade, market: Market = undefined): Trade {
        throw new NotSupported (this.id + ' parseWsOrderTrade() is not supported yet');
    }

    parseWsOHLCV (ohlcv, market: Market = undefined): OHLCV {
        return this.parseOHLCV (ohlcv, market);
    }

    async fetchFundingRates (symbols: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchFundingRates() is not supported yet');
    }

    async transfer (code: string, amount, fromAccount, toAccount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' transfer() is not supported yet');
    }

    async withdraw (code: string, amount, address, tag = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' withdraw() is not supported yet');
    }

    async createDepositAddress (code: string, params = {}): Promise<DepositAddressResponse> {
        throw new NotSupported (this.id + ' createDepositAddress() is not supported yet');
    }

    async setLeverage (leverage, symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' setLeverage() is not supported yet');
    }

    parseToInt (number) {
        // Solve Common parseInt misuse ex: parseInt ((since / 1000).toString ())
        // using a number as parameter which is not valid in ts
        const stringifiedNumber = number.toString ();
        const convertedNumber = parseFloat (stringifiedNumber) as any;
        return parseInt (convertedNumber);
    }

    parseToNumeric (number) {
        const stringVersion = this.numberToString (number); // this will convert 1.0 and 1 to "1" and 1.1 to "1.1"
        // keep this in mind:
        // in JS: 1 == 1.0 is true;  1 === 1.0 is true
        // in Python: 1 == 1.0 is true
        // in PHP 1 == 1.0 is true, but 1 === 1.0 is false
        if (stringVersion.indexOf ('.') >= 0) {
            return parseFloat (stringVersion);
        }
        return parseInt (stringVersion);
    }

    isRoundNumber (value) {
        // this method is similar to isInteger, but this is more loyal and does not check for types.
        // i.e. isRoundNumber(1.000) returns true, while isInteger(1.000) returns false
        const res = this.parseToNumeric ((value % 1));
        return res === 0;
    }

    afterConstruct () {
        this.createNetworksByIdObject ();
    }

    createNetworksByIdObject () {
        // automatically generate network-id-to-code mappings
        const networkIdsToCodesGenerated = this.invertFlatStringDictionary (this.safeValue (this.options, 'networks', {})); // invert defined networks dictionary
        this.options['networksById'] = this.extend (networkIdsToCodesGenerated, this.safeValue (this.options, 'networksById', {})); // support manually overriden "networksById" dictionary too
    }

    getDefaultOptions () {
        return {
            'networkCodeReplacements': {
                'ETH': { 'ERC20': 'ETH' },
                'TRX': { 'TRC20': 'TRX' },
                'CRO': { 'CRC20': 'CRONOS' },
            },
        };
    }

    safeLedgerEntry (entry: object, currency: Currency = undefined) {
        currency = this.safeCurrency (undefined, currency);
        let direction = this.safeString (entry, 'direction');
        let before = this.safeString (entry, 'before');
        let after = this.safeString (entry, 'after');
        const amount = this.safeString (entry, 'amount');
        if (amount !== undefined) {
            if (before === undefined && after !== undefined) {
                before = Precise.stringSub (after, amount);
            } else if (before !== undefined && after === undefined) {
                after = Precise.stringAdd (before, amount);
            }
        }
        if (before !== undefined && after !== undefined) {
            if (direction === undefined) {
                if (Precise.stringGt (before, after)) {
                    direction = 'out';
                }
                if (Precise.stringGt (after, before)) {
                    direction = 'in';
                }
            }
        }
        const fee = this.safeValue (entry, 'fee');
        if (fee !== undefined) {
            fee['cost'] = this.safeNumber (fee, 'cost');
        }
        const timestamp = this.safeInteger (entry, 'timestamp');
        return {
            'id': this.safeString (entry, 'id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'direction': direction,
            'account': this.safeString (entry, 'account'),
            'referenceId': this.safeString (entry, 'referenceId'),
            'referenceAccount': this.safeString (entry, 'referenceAccount'),
            'type': this.safeString (entry, 'type'),
            'currency': currency['code'],
            'amount': this.parseNumber (amount),
            'before': this.parseNumber (before),
            'after': this.parseNumber (after),
            'status': this.safeString (entry, 'status'),
            'fee': fee,
            'info': entry,
        };
    }

    safeCurrencyStructure (currency: object) {
        return this.extend ({
            'info': undefined,
            'id': undefined,
            'numericId': undefined,
            'code': undefined,
            'precision': undefined,
            'type': undefined,
            'name': undefined,
            'active': undefined,
            'deposit': undefined,
            'withdraw': undefined,
            'fee': undefined,
            'fees': {},
            'networks': {},
            'limits': {
                'deposit': {
                    'min': undefined,
                    'max': undefined,
                },
                'withdraw': {
                    'min': undefined,
                    'max': undefined,
                },
            },
        }, currency);
    }

    safeMarketStructure (market = undefined): MarketInterface {
        const cleanStructure = {
            'id': undefined,
            'lowercaseId': undefined,
            'symbol': undefined,
            'base': undefined,
            'quote': undefined,
            'settle': undefined,
            'baseId': undefined,
            'quoteId': undefined,
            'settleId': undefined,
            'type': undefined,
            'spot': undefined,
            'margin': undefined,
            'swap': undefined,
            'future': undefined,
            'option': undefined,
            'index': undefined,
            'active': undefined,
            'contract': undefined,
            'linear': undefined,
            'inverse': undefined,
            'subType': undefined,
            'taker': undefined,
            'maker': undefined,
            'contractSize': undefined,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': undefined,
                'price': undefined,
                'cost': undefined,
                'base': undefined,
                'quote': undefined,
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': undefined,
        };
        if (market !== undefined) {
            const result = this.extend (cleanStructure, market);
            // set undefined swap/future/etc
            if (result['spot']) {
                if (result['contract'] === undefined) {
                    result['contract'] = false;
                }
                if (result['swap'] === undefined) {
                    result['swap'] = false;
                }
                if (result['future'] === undefined) {
                    result['future'] = false;
                }
                if (result['option'] === undefined) {
                    result['option'] = false;
                }
                if (result['index'] === undefined) {
                    result['index'] = false;
                }
            }
            return result;
        }
        return cleanStructure;
    }

    setMarkets (markets, currencies = undefined) {
        const values = [];
        this.markets_by_id = {};
        // handle marketId conflicts
        // we insert spot markets first
        const marketValues = this.sortBy (this.toArray (markets), 'spot', true, true);
        for (let i = 0; i < marketValues.length; i++) {
            const value = marketValues[i];
            if (value['id'] in this.markets_by_id) {
                (this.markets_by_id[value['id']] as any).push (value);
            } else {
                this.markets_by_id[value['id']] = [ value ] as any;
            }
            const market = this.deepExtend (this.safeMarketStructure (), {
                'precision': this.precision,
                'limits': this.limits,
            }, this.fees['trading'], value);
            if (market['linear']) {
                market['subType'] = 'linear';
            } else if (market['inverse']) {
                market['subType'] = 'inverse';
            } else {
                market['subType'] = undefined;
            }
            values.push (market);
        }
        this.markets = this.indexBy (values, 'symbol') as any;
        const marketsSortedBySymbol = this.keysort (this.markets);
        const marketsSortedById = this.keysort (this.markets_by_id);
        this.symbols = Object.keys (marketsSortedBySymbol);
        this.ids = Object.keys (marketsSortedById);
        if (currencies !== undefined) {
            // currencies is always undefined when called in constructor but not when called from loadMarkets
            this.currencies = this.deepExtend (this.currencies, currencies);
        } else {
            let baseCurrencies = [];
            let quoteCurrencies = [];
            for (let i = 0; i < values.length; i++) {
                const market = values[i];
                const defaultCurrencyPrecision = (this.precisionMode === DECIMAL_PLACES) ? 8 : this.parseNumber ('1e-8');
                const marketPrecision = this.safeValue (market, 'precision', {});
                if ('base' in market) {
                    const currency = this.safeCurrencyStructure ({
                        'id': this.safeString2 (market, 'baseId', 'base'),
                        'numericId': this.safeInteger (market, 'baseNumericId'),
                        'code': this.safeString (market, 'base'),
                        'precision': this.safeValue2 (marketPrecision, 'base', 'amount', defaultCurrencyPrecision),
                    });
                    baseCurrencies.push (currency);
                }
                if ('quote' in market) {
                    const currency = this.safeCurrencyStructure ({
                        'id': this.safeString2 (market, 'quoteId', 'quote'),
                        'numericId': this.safeInteger (market, 'quoteNumericId'),
                        'code': this.safeString (market, 'quote'),
                        'precision': this.safeValue2 (marketPrecision, 'quote', 'price', defaultCurrencyPrecision),
                    });
                    quoteCurrencies.push (currency);
                }
            }
            baseCurrencies = this.sortBy (baseCurrencies, 'code', false, '');
            quoteCurrencies = this.sortBy (quoteCurrencies, 'code', false, '');
            this.baseCurrencies = this.indexBy (baseCurrencies, 'code');
            this.quoteCurrencies = this.indexBy (quoteCurrencies, 'code');
            const allCurrencies = this.arrayConcat (baseCurrencies, quoteCurrencies);
            const groupedCurrencies = this.groupBy (allCurrencies, 'code');
            const codes = Object.keys (groupedCurrencies);
            const resultingCurrencies = [];
            for (let i = 0; i < codes.length; i++) {
                const code = codes[i];
                const groupedCurrenciesCode = this.safeValue (groupedCurrencies, code, []);
                let highestPrecisionCurrency = this.safeValue (groupedCurrenciesCode, 0);
                for (let j = 1; j < groupedCurrenciesCode.length; j++) {
                    const currentCurrency = groupedCurrenciesCode[j];
                    if (this.precisionMode === TICK_SIZE) {
                        highestPrecisionCurrency = (currentCurrency['precision'] < highestPrecisionCurrency['precision']) ? currentCurrency : highestPrecisionCurrency;
                    } else {
                        highestPrecisionCurrency = (currentCurrency['precision'] > highestPrecisionCurrency['precision']) ? currentCurrency : highestPrecisionCurrency;
                    }
                }
                resultingCurrencies.push (highestPrecisionCurrency);
            }
            const sortedCurrencies = this.sortBy (resultingCurrencies, 'code');
            this.currencies = this.deepExtend (this.currencies, this.indexBy (sortedCurrencies, 'code'));
        }
        this.currencies_by_id = this.indexBy (this.currencies, 'id');
        const currenciesSortedByCode = this.keysort (this.currencies);
        this.codes = Object.keys (currenciesSortedByCode);
        return this.markets;
    }

    safeBalance (balance: object): Balances {
        const balances = this.omit (balance, [ 'info', 'timestamp', 'datetime', 'free', 'used', 'total' ]);
        const codes = Object.keys (balances);
        balance['free'] = {};
        balance['used'] = {};
        balance['total'] = {};
        const debtBalance = {};
        for (let i = 0; i < codes.length; i++) {
            const code = codes[i];
            let total = this.safeString (balance[code], 'total');
            let free = this.safeString (balance[code], 'free');
            let used = this.safeString (balance[code], 'used');
            const debt = this.safeString (balance[code], 'debt');
            if ((total === undefined) && (free !== undefined) && (used !== undefined)) {
                total = Precise.stringAdd (free, used);
            }
            if ((free === undefined) && (total !== undefined) && (used !== undefined)) {
                free = Precise.stringSub (total, used);
            }
            if ((used === undefined) && (total !== undefined) && (free !== undefined)) {
                used = Precise.stringSub (total, free);
            }
            balance[code]['free'] = this.parseNumber (free);
            balance[code]['used'] = this.parseNumber (used);
            balance[code]['total'] = this.parseNumber (total);
            balance['free'][code] = balance[code]['free'];
            balance['used'][code] = balance[code]['used'];
            balance['total'][code] = balance[code]['total'];
            if (debt !== undefined) {
                balance[code]['debt'] = this.parseNumber (debt);
                debtBalance[code] = balance[code]['debt'];
            }
        }
        const debtBalanceArray = Object.keys (debtBalance);
        const length = debtBalanceArray.length;
        if (length) {
            balance['debt'] = debtBalance;
        }
        return balance as any;
    }

    safeOrder (order: object, market: Market = undefined): Order {
        // parses numbers as strings
        // * it is important pass the trades as unparsed rawTrades
        let amount = this.omitZero (this.safeString (order, 'amount'));
        let remaining = this.safeString (order, 'remaining');
        let filled = this.safeString (order, 'filled');
        let cost = this.safeString (order, 'cost');
        let average = this.omitZero (this.safeString (order, 'average'));
        let price = this.omitZero (this.safeString (order, 'price'));
        let lastTradeTimeTimestamp = this.safeInteger (order, 'lastTradeTimestamp');
        let symbol = this.safeString (order, 'symbol');
        let side = this.safeString (order, 'side');
        const status = this.safeString (order, 'status');
        const parseFilled = (filled === undefined);
        const parseCost = (cost === undefined);
        const parseLastTradeTimeTimestamp = (lastTradeTimeTimestamp === undefined);
        const fee = this.safeValue (order, 'fee');
        const parseFee = (fee === undefined);
        const parseFees = this.safeValue (order, 'fees') === undefined;
        const parseSymbol = symbol === undefined;
        const parseSide = side === undefined;
        const shouldParseFees = parseFee || parseFees;
        const fees = this.safeValue (order, 'fees', []);
        let trades = [];
        if (parseFilled || parseCost || shouldParseFees) {
            const rawTrades = this.safeValue (order, 'trades', trades);
            const oldNumber = this.number;
            // we parse trades as strings here!
            (this as any).number = String;
            const firstTrade = this.safeValue (rawTrades, 0);
            // parse trades if they haven't already been parsed
            const tradesAreParsed = ((firstTrade !== undefined) && ('info' in firstTrade) && ('id' in firstTrade));
            if (!tradesAreParsed) {
                trades = this.parseTrades (rawTrades, market);
            } else {
                trades = rawTrades;
            }
            this.number = oldNumber;
            let tradesLength = 0;
            const isArray = Array.isArray (trades);
            if (isArray) {
                tradesLength = trades.length;
            }
            if (isArray && (tradesLength > 0)) {
                // move properties that are defined in trades up into the order
                if (order['symbol'] === undefined) {
                    order['symbol'] = trades[0]['symbol'];
                }
                if (order['side'] === undefined) {
                    order['side'] = trades[0]['side'];
                }
                if (order['type'] === undefined) {
                    order['type'] = trades[0]['type'];
                }
                if (order['id'] === undefined) {
                    order['id'] = trades[0]['order'];
                }
                if (parseFilled) {
                    filled = '0';
                }
                if (parseCost) {
                    cost = '0';
                }
                for (let i = 0; i < trades.length; i++) {
                    const trade = trades[i];
                    const tradeAmount = this.safeString (trade, 'amount');
                    if (parseFilled && (tradeAmount !== undefined)) {
                        filled = Precise.stringAdd (filled, tradeAmount);
                    }
                    const tradeCost = this.safeString (trade, 'cost');
                    if (parseCost && (tradeCost !== undefined)) {
                        cost = Precise.stringAdd (cost, tradeCost);
                    }
                    if (parseSymbol) {
                        symbol = this.safeString (trade, 'symbol');
                    }
                    if (parseSide) {
                        side = this.safeString (trade, 'side');
                    }
                    const tradeTimestamp = this.safeValue (trade, 'timestamp');
                    if (parseLastTradeTimeTimestamp && (tradeTimestamp !== undefined)) {
                        if (lastTradeTimeTimestamp === undefined) {
                            lastTradeTimeTimestamp = tradeTimestamp;
                        } else {
                            lastTradeTimeTimestamp = Math.max (lastTradeTimeTimestamp, tradeTimestamp);
                        }
                    }
                    if (shouldParseFees) {
                        const tradeFees = this.safeValue (trade, 'fees');
                        if (tradeFees !== undefined) {
                            for (let j = 0; j < tradeFees.length; j++) {
                                const tradeFee = tradeFees[j];
                                fees.push (this.extend ({}, tradeFee));
                            }
                        } else {
                            const tradeFee = this.safeValue (trade, 'fee');
                            if (tradeFee !== undefined) {
                                fees.push (this.extend ({}, tradeFee));
                            }
                        }
                    }
                }
            }
        }
        if (shouldParseFees) {
            const reducedFees = this.reduceFees ? this.reduceFeesByCurrency (fees) : fees;
            const reducedLength = reducedFees.length;
            for (let i = 0; i < reducedLength; i++) {
                reducedFees[i]['cost'] = this.safeNumber (reducedFees[i], 'cost');
                if ('rate' in reducedFees[i]) {
                    reducedFees[i]['rate'] = this.safeNumber (reducedFees[i], 'rate');
                }
            }
            if (!parseFee && (reducedLength === 0)) {
                // copy fee to avoid modification by reference
                const feeCopy = this.deepExtend (fee);
                feeCopy['cost'] = this.safeNumber (feeCopy, 'cost');
                if ('rate' in feeCopy) {
                    feeCopy['rate'] = this.safeNumber (feeCopy, 'rate');
                }
                reducedFees.push (feeCopy);
            }
            order['fees'] = reducedFees;
            if (parseFee && (reducedLength === 1)) {
                order['fee'] = reducedFees[0];
            }
        }
        if (amount === undefined) {
            // ensure amount = filled + remaining
            if (filled !== undefined && remaining !== undefined) {
                amount = Precise.stringAdd (filled, remaining);
            } else if (status === 'closed') {
                amount = filled;
            }
        }
        if (filled === undefined) {
            if (amount !== undefined && remaining !== undefined) {
                filled = Precise.stringSub (amount, remaining);
            } else if (status === 'closed' && amount !== undefined) {
                filled = amount;
            }
        }
        if (remaining === undefined) {
            if (amount !== undefined && filled !== undefined) {
                remaining = Precise.stringSub (amount, filled);
            } else if (status === 'closed') {
                remaining = '0';
            }
        }
        // ensure that the average field is calculated correctly
        const inverse = this.safeValue (market, 'inverse', false);
        const contractSize = this.numberToString (this.safeValue (market, 'contractSize', 1));
        // inverse
        // price = filled * contract size / cost
        //
        // linear
        // price = cost / (filled * contract size)
        if (average === undefined) {
            if ((filled !== undefined) && (cost !== undefined) && Precise.stringGt (filled, '0')) {
                const filledTimesContractSize = Precise.stringMul (filled, contractSize);
                if (inverse) {
                    average = Precise.stringDiv (filledTimesContractSize, cost);
                } else {
                    average = Precise.stringDiv (cost, filledTimesContractSize);
                }
            }
        }
        // similarly
        // inverse
        // cost = filled * contract size / price
        //
        // linear
        // cost = filled * contract size * price
        const costPriceExists = (average !== undefined) || (price !== undefined);
        if (parseCost && (filled !== undefined) && costPriceExists) {
            let multiplyPrice = undefined;
            if (average === undefined) {
                multiplyPrice = price;
            } else {
                multiplyPrice = average;
            }
            // contract trading
            const filledTimesContractSize = Precise.stringMul (filled, contractSize);
            if (inverse) {
                cost = Precise.stringDiv (filledTimesContractSize, multiplyPrice);
            } else {
                cost = Precise.stringMul (filledTimesContractSize, multiplyPrice);
            }
        }
        // support for market orders
        const orderType = this.safeValue (order, 'type');
        const emptyPrice = (price === undefined) || Precise.stringEquals (price, '0');
        if (emptyPrice && (orderType === 'market')) {
            price = average;
        }
        // we have trades with string values at this point so we will mutate them
        for (let i = 0; i < trades.length; i++) {
            const entry = trades[i];
            entry['amount'] = this.safeNumber (entry, 'amount');
            entry['price'] = this.safeNumber (entry, 'price');
            entry['cost'] = this.safeNumber (entry, 'cost');
            const tradeFee = this.safeValue (entry, 'fee', {});
            tradeFee['cost'] = this.safeNumber (tradeFee, 'cost');
            if ('rate' in tradeFee) {
                tradeFee['rate'] = this.safeNumber (tradeFee, 'rate');
            }
            entry['fee'] = tradeFee;
        }
        let timeInForce = this.safeString (order, 'timeInForce');
        let postOnly = this.safeValue (order, 'postOnly');
        // timeInForceHandling
        if (timeInForce === undefined) {
            if (this.safeString (order, 'type') === 'market') {
                timeInForce = 'IOC';
            }
            // allow postOnly override
            if (postOnly) {
                timeInForce = 'PO';
            }
        } else if (postOnly === undefined) {
            // timeInForce is not undefined here
            postOnly = timeInForce === 'PO';
        }
        const timestamp = this.safeInteger (order, 'timestamp');
        const lastUpdateTimestamp = this.safeInteger (order, 'lastUpdateTimestamp');
        let datetime = this.safeString (order, 'datetime');
        if (datetime === undefined) {
            datetime = this.iso8601 (timestamp);
        }
        const triggerPrice = this.parseNumber (this.safeString2 (order, 'triggerPrice', 'stopPrice'));
        const takeProfitPrice = this.parseNumber (this.safeString (order, 'takeProfitPrice'));
        const stopLossPrice = this.parseNumber (this.safeString (order, 'stopLossPrice'));
        return this.extend (order, {
            'id': this.safeString (order, 'id'),
            'clientOrderId': this.safeString (order, 'clientOrderId'),
            'timestamp': timestamp,
            'datetime': datetime,
            'symbol': symbol,
            'type': this.safeString (order, 'type'),
            'side': side,
            'lastTradeTimestamp': lastTradeTimeTimestamp,
            'lastUpdateTimestamp': lastUpdateTimestamp,
            'price': this.parseNumber (price),
            'amount': this.parseNumber (amount),
            'cost': this.parseNumber (cost),
            'average': this.parseNumber (average),
            'filled': this.parseNumber (filled),
            'remaining': this.parseNumber (remaining),
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'trades': trades,
            'reduceOnly': this.safeValue (order, 'reduceOnly'),
            'stopPrice': triggerPrice,  // ! deprecated, use triggerPrice instead
            'triggerPrice': triggerPrice,
            'takeProfitPrice': takeProfitPrice,
            'stopLossPrice': stopLossPrice,
            'status': status,
            'fee': this.safeValue (order, 'fee'),
        });
    }

    parseOrders (orders: object, market: Market = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Order[] {
        //
        // the value of orders is either a dict or a list
        //
        // dict
        //
        //     {
        //         'id1': { ... },
        //         'id2': { ... },
        //         'id3': { ... },
        //         ...
        //     }
        //
        // list
        //
        //     [
        //         { 'id': 'id1', ... },
        //         { 'id': 'id2', ... },
        //         { 'id': 'id3', ... },
        //         ...
        //     ]
        //
        let results = [];
        if (Array.isArray (orders)) {
            for (let i = 0; i < orders.length; i++) {
                const order = this.extend (this.parseOrder (orders[i], market), params);
                results.push (order);
            }
        } else {
            const ids = Object.keys (orders);
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                const order = this.extend (this.parseOrder (this.extend ({ 'id': id }, orders[id]), market), params);
                results.push (order);
            }
        }
        results = this.sortBy (results, 'timestamp');
        const symbol = (market !== undefined) ? market['symbol'] : undefined;
        return this.filterBySymbolSinceLimit (results, symbol, since, limit) as Order[];
    }

    calculateFee (symbol: string, type: string, side: string, amount: number, price: number, takerOrMaker = 'taker', params = {}) {
        if (type === 'market' && takerOrMaker === 'maker') {
            throw new ArgumentsRequired (this.id + ' calculateFee() - you have provided incompatible arguments - "market" type order can not be "maker". Change either the "type" or the "takerOrMaker" argument to calculate the fee.');
        }
        const market = this.markets[symbol];
        const feeSide = this.safeString (market, 'feeSide', 'quote');
        let useQuote = undefined;
        if (feeSide === 'get') {
            // the fee is always in the currency you get
            useQuote = side === 'sell';
        } else if (feeSide === 'give') {
            // the fee is always in the currency you give
            useQuote = side === 'buy';
        } else {
            // the fee is always in feeSide currency
            useQuote = feeSide === 'quote';
        }
        let cost = this.numberToString (amount);
        let key = undefined;
        if (useQuote) {
            const priceString = this.numberToString (price);
            cost = Precise.stringMul (cost, priceString);
            key = 'quote';
        } else {
            key = 'base';
        }
        // for derivatives, the fee is in 'settle' currency
        if (!market['spot']) {
            key = 'settle';
        }
        // even if `takerOrMaker` argument was set to 'maker', for 'market' orders we should forcefully override it to 'taker'
        if (type === 'market') {
            takerOrMaker = 'taker';
        }
        const rate = this.safeString (market, takerOrMaker);
        cost = Precise.stringMul (cost, rate);
        return {
            'type': takerOrMaker,
            'currency': market[key],
            'rate': this.parseNumber (rate),
            'cost': this.parseNumber (cost),
        };
    }

    safeLiquidation (liquidation: object, market: Market = undefined): Liquidation {
        const contracts = this.safeString (liquidation, 'contracts');
        const contractSize = this.safeString (market, 'contractSize');
        const price = this.safeString (liquidation, 'price');
        let baseValue = this.safeString (liquidation, 'baseValue');
        let quoteValue = this.safeString (liquidation, 'quoteValue');
        if ((baseValue === undefined) && (contracts !== undefined) && (contractSize !== undefined) && (price !== undefined)) {
            baseValue = Precise.stringMul (contracts, contractSize);
        }
        if ((quoteValue === undefined) && (baseValue !== undefined) && (price !== undefined)) {
            quoteValue = Precise.stringMul (baseValue, price);
        }
        liquidation['contracts'] = this.parseNumber (contracts);
        liquidation['contractSize'] = this.parseNumber (contractSize);
        liquidation['price'] = this.parseNumber (price);
        liquidation['baseValue'] = this.parseNumber (baseValue);
        liquidation['quoteValue'] = this.parseNumber (quoteValue);
        return liquidation as Liquidation;
    }

    safeTrade (trade: object, market: Market = undefined): Trade {
        const amount = this.safeString (trade, 'amount');
        const price = this.safeString (trade, 'price');
        let cost = this.safeString (trade, 'cost');
        if (cost === undefined) {
            // contract trading
            const contractSize = this.safeString (market, 'contractSize');
            let multiplyPrice = price;
            if (contractSize !== undefined) {
                const inverse = this.safeValue (market, 'inverse', false);
                if (inverse) {
                    multiplyPrice = Precise.stringDiv ('1', price);
                }
                multiplyPrice = Precise.stringMul (multiplyPrice, contractSize);
            }
            cost = Precise.stringMul (multiplyPrice, amount);
        }
        const parseFee = this.safeValue (trade, 'fee') === undefined;
        const parseFees = this.safeValue (trade, 'fees') === undefined;
        const shouldParseFees = parseFee || parseFees;
        const fees = [];
        const fee = this.safeValue (trade, 'fee');
        if (shouldParseFees) {
            const reducedFees = this.reduceFees ? this.reduceFeesByCurrency (fees) : fees;
            const reducedLength = reducedFees.length;
            for (let i = 0; i < reducedLength; i++) {
                reducedFees[i]['cost'] = this.safeNumber (reducedFees[i], 'cost');
                if ('rate' in reducedFees[i]) {
                    reducedFees[i]['rate'] = this.safeNumber (reducedFees[i], 'rate');
                }
            }
            if (!parseFee && (reducedLength === 0)) {
                // copy fee to avoid modification by reference
                const feeCopy = this.deepExtend (fee);
                feeCopy['cost'] = this.safeNumber (feeCopy, 'cost');
                if ('rate' in feeCopy) {
                    feeCopy['rate'] = this.safeNumber (feeCopy, 'rate');
                }
                reducedFees.push (feeCopy);
            }
            if (parseFees) {
                trade['fees'] = reducedFees;
            }
            if (parseFee && (reducedLength === 1)) {
                trade['fee'] = reducedFees[0];
            }
            const tradeFee = this.safeValue (trade, 'fee');
            if (tradeFee !== undefined) {
                tradeFee['cost'] = this.safeNumber (tradeFee, 'cost');
                if ('rate' in tradeFee) {
                    tradeFee['rate'] = this.safeNumber (tradeFee, 'rate');
                }
                trade['fee'] = tradeFee;
            }
        }
        trade['amount'] = this.parseNumber (amount);
        trade['price'] = this.parseNumber (price);
        trade['cost'] = this.parseNumber (cost);
        return trade as Trade;
    }

    invertFlatStringDictionary (dict) {
        const reversed = {};
        const keys = Object.keys (dict);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = dict[key];
            if (typeof value === 'string') {
                reversed[value] = key;
            }
        }
        return reversed;
    }

    reduceFeesByCurrency (fees) {
        //
        // this function takes a list of fee structures having the following format
        //
        //     string = true
        //
        //     [
        //         { 'currency': 'BTC', 'cost': '0.1' },
        //         { 'currency': 'BTC', 'cost': '0.2'  },
        //         { 'currency': 'BTC', 'cost': '0.2', 'rate': '0.00123' },
        //         { 'currency': 'BTC', 'cost': '0.4', 'rate': '0.00123' },
        //         { 'currency': 'BTC', 'cost': '0.5', 'rate': '0.00456' },
        //         { 'currency': 'USDT', 'cost': '12.3456' },
        //     ]
        //
        //     string = false
        //
        //     [
        //         { 'currency': 'BTC', 'cost': 0.1 },
        //         { 'currency': 'BTC', 'cost': 0.2 },
        //         { 'currency': 'BTC', 'cost': 0.2, 'rate': 0.00123 },
        //         { 'currency': 'BTC', 'cost': 0.4, 'rate': 0.00123 },
        //         { 'currency': 'BTC', 'cost': 0.5, 'rate': 0.00456 },
        //         { 'currency': 'USDT', 'cost': 12.3456 },
        //     ]
        //
        // and returns a reduced fee list, where fees are summed per currency and rate (if any)
        //
        //     string = true
        //
        //     [
        //         { 'currency': 'BTC', 'cost': '0.4'  },
        //         { 'currency': 'BTC', 'cost': '0.6', 'rate': '0.00123' },
        //         { 'currency': 'BTC', 'cost': '0.5', 'rate': '0.00456' },
        //         { 'currency': 'USDT', 'cost': '12.3456' },
        //     ]
        //
        //     string  = false
        //
        //     [
        //         { 'currency': 'BTC', 'cost': 0.3  },
        //         { 'currency': 'BTC', 'cost': 0.6, 'rate': 0.00123 },
        //         { 'currency': 'BTC', 'cost': 0.5, 'rate': 0.00456 },
        //         { 'currency': 'USDT', 'cost': 12.3456 },
        //     ]
        //
        const reduced = {};
        for (let i = 0; i < fees.length; i++) {
            const fee = fees[i];
            const feeCurrencyCode = this.safeString (fee, 'currency');
            if (feeCurrencyCode !== undefined) {
                const rate = this.safeString (fee, 'rate');
                const cost = this.safeValue (fee, 'cost');
                if (Precise.stringEq (cost, '0')) {
                    // omit zero cost fees
                    continue;
                }
                if (!(feeCurrencyCode in reduced)) {
                    reduced[feeCurrencyCode] = {};
                }
                const rateKey = (rate === undefined) ? '' : rate;
                if (rateKey in reduced[feeCurrencyCode]) {
                    reduced[feeCurrencyCode][rateKey]['cost'] = Precise.stringAdd (reduced[feeCurrencyCode][rateKey]['cost'], cost);
                } else {
                    reduced[feeCurrencyCode][rateKey] = {
                        'currency': feeCurrencyCode,
                        'cost': cost,
                    };
                    if (rate !== undefined) {
                        reduced[feeCurrencyCode][rateKey]['rate'] = rate;
                    }
                }
            }
        }
        let result = [];
        const feeValues = Object.values (reduced);
        for (let i = 0; i < feeValues.length; i++) {
            const reducedFeeValues = Object.values (feeValues[i]);
            result = this.arrayConcat (result, reducedFeeValues);
        }
        return result;
    }

    safeTicker (ticker: object, market: Market = undefined): Ticker {
        let open = this.omitZero (this.safeString (ticker, 'open'));
        let close = this.omitZero (this.safeString (ticker, 'close'));
        let last = this.omitZero (this.safeString (ticker, 'last'));
        let change = this.omitZero (this.safeString (ticker, 'change'));
        let percentage = this.omitZero (this.safeString (ticker, 'percentage'));
        let average = this.omitZero (this.safeString (ticker, 'average'));
        let vwap = this.omitZero (this.safeString (ticker, 'vwap'));
        const baseVolume = this.safeString (ticker, 'baseVolume');
        const quoteVolume = this.safeString (ticker, 'quoteVolume');
        if (vwap === undefined) {
            vwap = Precise.stringDiv (this.omitZero (quoteVolume), baseVolume);
        }
        if ((last !== undefined) && (close === undefined)) {
            close = last;
        } else if ((last === undefined) && (close !== undefined)) {
            last = close;
        }
        if ((last !== undefined) && (open !== undefined)) {
            if (change === undefined) {
                change = Precise.stringSub (last, open);
            }
            if (average === undefined) {
                average = Precise.stringDiv (Precise.stringAdd (last, open), '2');
            }
        }
        if ((percentage === undefined) && (change !== undefined) && (open !== undefined) && Precise.stringGt (open, '0')) {
            percentage = Precise.stringMul (Precise.stringDiv (change, open), '100');
        }
        if ((change === undefined) && (percentage !== undefined) && (open !== undefined)) {
            change = Precise.stringDiv (Precise.stringMul (percentage, open), '100');
        }
        if ((open === undefined) && (last !== undefined) && (change !== undefined)) {
            open = Precise.stringSub (last, change);
        }
        // timestamp and symbol operations don't belong in safeTicker
        // they should be done in the derived classes
        return this.extend (ticker, {
            'bid': this.parseNumber (this.omitZero (this.safeNumber (ticker, 'bid'))),
            'bidVolume': this.safeNumber (ticker, 'bidVolume'),
            'ask': this.parseNumber (this.omitZero (this.safeNumber (ticker, 'ask'))),
            'askVolume': this.safeNumber (ticker, 'askVolume'),
            'high': this.parseNumber (this.omitZero (this.safeString (ticker, 'high'))),
            'low': this.parseNumber (this.omitZero (this.safeNumber (ticker, 'low'))),
            'open': this.parseNumber (this.omitZero (this.parseNumber (open))),
            'close': this.parseNumber (this.omitZero (this.parseNumber (close))),
            'last': this.parseNumber (this.omitZero (this.parseNumber (last))),
            'change': this.parseNumber (change),
            'percentage': this.parseNumber (percentage),
            'average': this.parseNumber (average),
            'vwap': this.parseNumber (vwap),
            'baseVolume': this.parseNumber (baseVolume),
            'quoteVolume': this.parseNumber (quoteVolume),
            'previousClose': this.safeNumber (ticker, 'previousClose'),
        });
    }

    async fetchBorrowRate (code: string, amount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchBorrowRate is deprecated, please use fetchCrossBorrowRate or fetchIsolatedBorrowRate instead');
    }

    async repayCrossMargin (code: string, amount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' repayCrossMargin is not support yet');
    }

    async repayIsolatedMargin (symbol: string, code: string, amount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' repayIsolatedMargin is not support yet');
    }

    async borrowCrossMargin (code: string, amount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' borrowCrossMargin is not support yet');
    }

    async borrowIsolatedMargin (symbol: string, code: string, amount, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' borrowIsolatedMargin is not support yet');
    }

    async borrowMargin (code: string, amount, symbol: Str = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' borrowMargin is deprecated, please use borrowCrossMargin or borrowIsolatedMargin instead');
    }

    async repayMargin (code: string, amount, symbol: Str = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' repayMargin is deprecated, please use repayCrossMargin or repayIsolatedMargin instead');
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        let message = '';
        if (this.has['fetchTrades']) {
            message = '. If you want to build OHLCV candles from trade executions data, visit https://github.com/ccxt/ccxt/tree/master/examples/ and see "build-ohlcv-bars" file';
        }
        throw new NotSupported (this.id + ' fetchOHLCV() is not supported yet' + message);
    }

    async watchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        throw new NotSupported (this.id + ' watchOHLCV() is not supported yet');
    }

    convertTradingViewToOHLCV (ohlcvs, timestamp = 't', open = 'o', high = 'h', low = 'l', close = 'c', volume = 'v', ms = false) {
        const result = [];
        const timestamps = this.safeValue (ohlcvs, timestamp, []);
        const opens = this.safeValue (ohlcvs, open, []);
        const highs = this.safeValue (ohlcvs, high, []);
        const lows = this.safeValue (ohlcvs, low, []);
        const closes = this.safeValue (ohlcvs, close, []);
        const volumes = this.safeValue (ohlcvs, volume, []);
        for (let i = 0; i < timestamps.length; i++) {
            result.push ([
                ms ? this.safeInteger (timestamps, i) : this.safeTimestamp (timestamps, i),
                this.safeValue (opens, i),
                this.safeValue (highs, i),
                this.safeValue (lows, i),
                this.safeValue (closes, i),
                this.safeValue (volumes, i),
            ]);
        }
        return result;
    }

    convertOHLCVToTradingView (ohlcvs, timestamp = 't', open = 'o', high = 'h', low = 'l', close = 'c', volume = 'v', ms = false) {
        const result = {};
        result[timestamp] = [];
        result[open] = [];
        result[high] = [];
        result[low] = [];
        result[close] = [];
        result[volume] = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            const ts = ms ? ohlcvs[i][0] : this.parseToInt (ohlcvs[i][0] / 1000);
            result[timestamp].push (ts);
            result[open].push (ohlcvs[i][1]);
            result[high].push (ohlcvs[i][2]);
            result[low].push (ohlcvs[i][3]);
            result[close].push (ohlcvs[i][4]);
            result[volume].push (ohlcvs[i][5]);
        }
        return result;
    }

    async fetchWebEndpoint (method, endpointMethod, returnAsJson, startRegex = undefined, endRegex = undefined) {
        let errorMessage = '';
        const options = this.safeValue (this.options, method, {});
        const muteOnFailure = this.safeValue (options, 'webApiMuteFailure', true);
        try {
            // if it was not explicitly disabled, then don't fetch
            if (this.safeValue (options, 'webApiEnable', true) !== true) {
                return undefined;
            }
            const maxRetries = this.safeValue (options, 'webApiRetries', 10);
            let response = undefined;
            let retry = 0;
            while (retry < maxRetries) {
                try {
                    response = await this[endpointMethod] ({});
                    break;
                } catch (e) {
                    retry = retry + 1;
                    if (retry === maxRetries) {
                        throw e;
                    }
                }
            }
            let content = response;
            if (startRegex !== undefined) {
                const splitted_by_start = content.split (startRegex);
                content = splitted_by_start[1]; // we need second part after start
            }
            if (endRegex !== undefined) {
                const splitted_by_end = content.split (endRegex);
                content = splitted_by_end[0]; // we need first part after start
            }
            if (returnAsJson && (typeof content === 'string')) {
                const jsoned = this.parseJson (content.trim ()); // content should be trimmed before json parsing
                if (jsoned) {
                    return jsoned; // if parsing was not successfull, exception should be thrown
                } else {
                    throw new BadResponse ('could not parse the response into json');
                }
            } else {
                return content;
            }
        } catch (e) {
            errorMessage = this.id + ' ' + method + '() failed to fetch correct data from website. Probably webpage markup has been changed, breaking the page custom parser.';
        }
        if (muteOnFailure) {
            return undefined;
        } else {
            throw new BadResponse (errorMessage);
        }
    }

    marketIds (symbols) {
        if (symbols === undefined) {
            return symbols;
        }
        const result = [];
        for (let i = 0; i < symbols.length; i++) {
            result.push (this.marketId (symbols[i]));
        }
        return result;
    }

    marketSymbols (symbols, type: string = undefined, allowEmpty = true, sameTypeOnly = false, sameSubTypeOnly = false) {
        if (symbols === undefined) {
            if (!allowEmpty) {
                throw new ArgumentsRequired (this.id + ' empty list of symbols is not supported');
            }
            return symbols;
        }
        const symbolsLength = symbols.length;
        if (symbolsLength === 0) {
            if (!allowEmpty) {
                throw new ArgumentsRequired (this.id + ' empty list of symbols is not supported');
            }
            return symbols;
        }
        const result = [];
        let marketType = undefined;
        let isLinearSubType = undefined;
        for (let i = 0; i < symbols.length; i++) {
            const market = this.market (symbols[i]);
            if (sameTypeOnly && (marketType !== undefined)) {
                if (market['type'] !== marketType) {
                    throw new BadRequest (this.id + ' symbols must be of the same type, either ' + marketType + ' or ' + market['type'] + '.');
                }
            }
            if (sameSubTypeOnly && (isLinearSubType !== undefined)) {
                if (market['linear'] !== isLinearSubType) {
                    throw new BadRequest (this.id + ' symbols must be of the same subType, either linear or inverse.');
                }
            }
            if (type !== undefined && market['type'] !== type) {
                throw new BadRequest (this.id + ' symbols must be of the same type ' + type + '. If the type is incorrect you can change it in options or the params of the request');
            }
            marketType = market['type'];
            if (!market['spot']) {
                isLinearSubType = market['linear'];
            }
            const symbol = this.safeString (market, 'symbol', symbols[i]);
            result.push (symbol);
        }
        return result;
    }

    marketCodes (codes) {
        if (codes === undefined) {
            return codes;
        }
        const result = [];
        for (let i = 0; i < codes.length; i++) {
            result.push (this.commonCurrencyCode (codes[i]));
        }
        return result;
    }

    parseBidsAsks (bidasks, priceKey: IndexType = 0, amountKey: IndexType = 1) {
        bidasks = this.toArray (bidasks);
        const result = [];
        for (let i = 0; i < bidasks.length; i++) {
            result.push (this.parseBidAsk (bidasks[i], priceKey, amountKey));
        }
        return result;
    }

    async fetchL2OrderBook (symbol: string, limit: Int = undefined, params = {}) {
        const orderbook = await this.fetchOrderBook (symbol, limit, params);
        return this.extend (orderbook, {
            'asks': this.sortBy (this.aggregate (orderbook['asks']), 0),
            'bids': this.sortBy (this.aggregate (orderbook['bids']), 0, true),
        });
    }

    filterBySymbol (objects, symbol: string = undefined) {
        if (symbol === undefined) {
            return objects;
        }
        const result = [];
        for (let i = 0; i < objects.length; i++) {
            const objectSymbol = this.safeString (objects[i], 'symbol');
            if (objectSymbol === symbol) {
                result.push (objects[i]);
            }
        }
        return result;
    }

    parseOHLCV (ohlcv, market: Market = undefined) : OHLCV {
        if (Array.isArray (ohlcv)) {
            return [
                this.safeInteger (ohlcv, 0), // timestamp
                this.safeNumber (ohlcv, 1), // open
                this.safeNumber (ohlcv, 2), // high
                this.safeNumber (ohlcv, 3), // low
                this.safeNumber (ohlcv, 4), // close
                this.safeNumber (ohlcv, 5), // volume
            ];
        }
        return ohlcv;
    }

    networkCodeToId (networkCode, currencyCode = undefined) {
        /**
         * @ignore
         * @method
         * @name exchange#networkCodeToId
         * @description tries to convert the provided networkCode (which is expected to be an unified network code) to a network id. In order to achieve this, derived class needs to have 'options->networks' defined.
         * @param {string} networkCode unified network code
         * @param {string} currencyCode unified currency code, but this argument is not required by default, unless there is an exchange (like huobi) that needs an override of the method to be able to pass currencyCode argument additionally
         * @returns {string|undefined} exchange-specific network id
         */
        const networkIdsByCodes = this.safeValue (this.options, 'networks', {});
        let networkId = this.safeString (networkIdsByCodes, networkCode);
        // for example, if 'ETH' is passed for networkCode, but 'ETH' key not defined in `options->networks` object
        if (networkId === undefined) {
            if (currencyCode === undefined) {
                // if currencyCode was not provided, then we just set passed value to networkId
                networkId = networkCode;
            } else {
                // if currencyCode was provided, then we try to find if that currencyCode has a replacement (i.e. ERC20 for ETH)
                const networkCodeReplacements = this.safeValue (this.options, 'networkCodeReplacements', {});
                if (currencyCode in networkCodeReplacements) {
                    // if there is a replacement for the passed networkCode, then we use it to find network-id in `options->networks` object
                    const replacementObject = networkCodeReplacements[currencyCode];
                    const keys = Object.keys (replacementObject);
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i];
                        const value = replacementObject[key];
                        // if value matches to provided unified networkCode, then we use it's key to find network-id in `options->networks` object
                        if (value === networkCode) {
                            networkId = key;
                            break;
                        }
                    }
                }
                // if it wasn't found, we just set the provided value to network-id
                if (networkId === undefined) {
                    networkId = networkCode;
                }
            }
        }
        return networkId;
    }

    networkIdToCode (networkId, currencyCode = undefined) {
        /**
         * @ignore
         * @method
         * @name exchange#networkIdToCode
         * @description tries to convert the provided exchange-specific networkId to an unified network Code. In order to achieve this, derived class needs to have "options['networksById']" defined.
         * @param {string} networkId exchange specific network id/title, like: TRON, Trc-20, usdt-erc20, etc
         * @param {string|undefined} currencyCode unified currency code, but this argument is not required by default, unless there is an exchange (like huobi) that needs an override of the method to be able to pass currencyCode argument additionally
         * @returns {string|undefined} unified network code
         */
        const networkCodesByIds = this.safeValue (this.options, 'networksById', {});
        let networkCode = this.safeString (networkCodesByIds, networkId, networkId);
        // replace mainnet network-codes (i.e. ERC20->ETH)
        if (currencyCode !== undefined) {
            const networkCodeReplacements = this.safeValue (this.options, 'networkCodeReplacements', {});
            if (currencyCode in networkCodeReplacements) {
                const replacementObject = this.safeValue (networkCodeReplacements, currencyCode, {});
                networkCode = this.safeString (replacementObject, networkCode, networkCode);
            }
        }
        return networkCode;
    }

    handleNetworkCodeAndParams (params) {
        const networkCodeInParams = this.safeString2 (params, 'networkCode', 'network');
        if (networkCodeInParams !== undefined) {
            params = this.omit (params, [ 'networkCode', 'network' ]);
        }
        // if it was not defined by user, we should not set it from 'defaultNetworks', because handleNetworkCodeAndParams is for only request-side and thus we do not fill it with anything. We can only use 'defaultNetworks' after parsing response-side
        return [ networkCodeInParams, params ];
    }

    handleEcidAndParams (params) {
        const ecidInParams = this.safeString2 (params, 'ecid', 'network');
        if (ecidInParams !== undefined) {
            params = this.omit (params, [ 'ecid', 'network' ]);
        }
        return [ ecidInParams, params ];
    }

    defaultNetworkCode (currencyCode) {
        let defaultNetworkCode = undefined;
        const defaultNetworks = this.safeValue (this.options, 'defaultNetworks', {});
        if (currencyCode in defaultNetworks) {
            // if currency had set its network in "defaultNetworks", use it
            defaultNetworkCode = defaultNetworks[currencyCode];
        } else {
            // otherwise, try to use the global-scope 'defaultNetwork' value (even if that network is not supported by currency, it doesn't make any problem, this will be just used "at first" if currency supports this network at all)
            const defaultNetwork = this.safeValue (this.options, 'defaultNetwork');
            if (defaultNetwork !== undefined) {
                defaultNetworkCode = defaultNetwork;
            }
        }
        return defaultNetworkCode;
    }

    selectNetworkCodeFromUnifiedNetworks (currencyCode, networkCode, indexedNetworkEntries) {
        return this.selectNetworkKeyFromNetworks (currencyCode, networkCode, indexedNetworkEntries, true);
    }

    selectNetworkIdFromRawNetworks (currencyCode, networkCode, indexedNetworkEntries) {
        return this.selectNetworkKeyFromNetworks (currencyCode, networkCode, indexedNetworkEntries, false);
    }

    selectNetworkKeyFromNetworks (currencyCode, networkCode, indexedNetworkEntries, isIndexedByUnifiedNetworkCode = false) {
        // this method is used against raw & unparse network entries, which are just indexed by network id
        let chosenNetworkId = undefined;
        const availableNetworkIds = Object.keys (indexedNetworkEntries);
        const responseNetworksLength = availableNetworkIds.length;
        if (networkCode !== undefined) {
            if (responseNetworksLength === 0) {
                throw new NotSupported (this.id + ' - ' + networkCode + ' network did not return any result for ' + currencyCode);
            } else {
                // if networkCode was provided by user, we should check it after response, as the referenced exchange doesn't support network-code during request
                const networkId = isIndexedByUnifiedNetworkCode ? networkCode : this.networkCodeToId (networkCode, currencyCode);
                if (networkId in indexedNetworkEntries) {
                    chosenNetworkId = networkId;
                } else {
                    throw new NotSupported (this.id + ' - ' + networkId + ' network was not found for ' + currencyCode + ', use one of ' + availableNetworkIds.join (', '));
                }
            }
        } else {
            if (responseNetworksLength === 0) {
                throw new NotSupported (this.id + ' - no networks were returned for ' + currencyCode);
            } else {
                // if networkCode was not provided by user, then we try to use the default network (if it was defined in "defaultNetworks"), otherwise, we just return the first network entry
                const defaultNetworkCode = this.defaultNetworkCode (currencyCode);
                const defaultNetworkId = isIndexedByUnifiedNetworkCode ? defaultNetworkCode : this.networkCodeToId (defaultNetworkCode, currencyCode);
                chosenNetworkId = (defaultNetworkId in indexedNetworkEntries) ? defaultNetworkId : availableNetworkIds[0];
            }
        }
        return chosenNetworkId;
    }

    safeNumber2 (dictionary, key1, key2, d = undefined) {
        const value = this.safeString2 (dictionary, key1, key2);
        return this.parseNumber (value, d);
    }

    parseOrderBook (orderbook: object, symbol: string, timestamp: Int = undefined, bidsKey = 'bids', asksKey = 'asks', priceKey: IndexType = 0, amountKey: IndexType = 1): OrderBook {
        const bids = this.parseBidsAsks (this.safeValue (orderbook, bidsKey, []), priceKey, amountKey);
        const asks = this.parseBidsAsks (this.safeValue (orderbook, asksKey, []), priceKey, amountKey);
        return {
            'symbol': symbol,
            'bids': this.sortBy (bids, 0, true),
            'asks': this.sortBy (asks, 0),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'nonce': undefined,
        } as any;
    }

    parseOHLCVs (ohlcvs: object[], market: any = undefined, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined): OHLCV[] {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push (this.parseOHLCV (ohlcvs[i], market));
        }
        const sorted = this.sortBy (results, 0);
        return this.filterBySinceLimit (sorted, since, limit, 0) as any;
    }

    parseLeverageTiers (response, symbols: string[] = undefined, marketIdKey = undefined) {
        // marketIdKey should only be undefined when response is a dictionary
        symbols = this.marketSymbols (symbols);
        const tiers = {};
        for (let i = 0; i < response.length; i++) {
            const item = response[i];
            const id = this.safeString (item, marketIdKey);
            const market = this.safeMarket (id, undefined, undefined, this.safeString (this.options, 'defaultType'));
            const symbol = market['symbol'];
            const contract = this.safeValue (market, 'contract', false);
            if (contract && ((symbols === undefined) || this.inArray (symbol, symbols))) {
                tiers[symbol] = this.parseMarketLeverageTiers (item, market);
            }
        }
        return tiers;
    }

    async loadTradingLimits (symbols: string[] = undefined, reload = false, params = {}) {
        if (this.has['fetchTradingLimits']) {
            if (reload || !('limitsLoaded' in this.options)) {
                const response = await this.fetchTradingLimits (symbols);
                for (let i = 0; i < symbols.length; i++) {
                    const symbol = symbols[i];
                    this.markets[symbol] = this.deepExtend (this.markets[symbol], response[symbol]);
                }
                this.options['limitsLoaded'] = this.milliseconds ();
            }
        }
        return this.markets;
    }

    safePosition (position): Position {
        // simplified version of: /pull/12765/
        const unrealizedPnlString = this.safeString (position, 'unrealisedPnl');
        const initialMarginString = this.safeString (position, 'initialMargin');
        //
        // PERCENTAGE
        //
        const percentage = this.safeValue (position, 'percentage');
        if ((percentage === undefined) && (unrealizedPnlString !== undefined) && (initialMarginString !== undefined)) {
            // as it was done in all implementations ( aax, btcex, bybit, deribit, ftx, gate, kucoinfutures, phemex )
            const percentageString = Precise.stringMul (Precise.stringDiv (unrealizedPnlString, initialMarginString, 4), '100');
            position['percentage'] = this.parseNumber (percentageString);
        }
        // if contractSize is undefined get from market
        let contractSize = this.safeNumber (position, 'contractSize');
        const symbol = this.safeString (position, 'symbol');
        let market = undefined;
        if (symbol !== undefined) {
            market = this.safeValue (this.markets, symbol);
        }
        if (contractSize === undefined && market !== undefined) {
            contractSize = this.safeNumber (market, 'contractSize');
            position['contractSize'] = contractSize;
        }
        return position as any;
    }

    parsePositions (positions, symbols: string[] = undefined, params = {}): Position[] {
        symbols = this.marketSymbols (symbols);
        positions = this.toArray (positions);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            const position = this.extend (this.parsePosition (positions[i], undefined), params);
            result.push (position);
        }
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    parseAccounts (accounts, params = {}) {
        accounts = this.toArray (accounts);
        const result = [];
        for (let i = 0; i < accounts.length; i++) {
            const account = this.extend (this.parseAccount (accounts[i]), params);
            result.push (account);
        }
        return result;
    }

    parseTrades (trades, market: Market = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Trade[] {
        trades = this.toArray (trades);
        let result = [];
        for (let i = 0; i < trades.length; i++) {
            const trade = this.extend (this.parseTrade (trades[i], market), params);
            result.push (trade);
        }
        result = this.sortBy2 (result, 'timestamp', 'id');
        const symbol = (market !== undefined) ? market['symbol'] : undefined;
        return this.filterBySymbolSinceLimit (result, symbol, since, limit) as Trade[];
    }

    parseTransactions (transactions, currency: Currency = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        transactions = this.toArray (transactions);
        let result = [];
        for (let i = 0; i < transactions.length; i++) {
            const transaction = this.extend (this.parseTransaction (transactions[i], currency), params);
            result.push (transaction);
        }
        result = this.sortBy (result, 'timestamp');
        const code = (currency !== undefined) ? currency['code'] : undefined;
        return this.filterByCurrencySinceLimit (result, code, since, limit);
    }

    parseTransfers (transfers, currency: Currency = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        transfers = this.toArray (transfers);
        let result = [];
        for (let i = 0; i < transfers.length; i++) {
            const transfer = this.extend (this.parseTransfer (transfers[i], currency), params);
            result.push (transfer);
        }
        result = this.sortBy (result, 'timestamp');
        const code = (currency !== undefined) ? currency['code'] : undefined;
        return this.filterByCurrencySinceLimit (result, code, since, limit);
    }

    parseLedger (data, currency: Currency = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        let result = [];
        const arrayData = this.toArray (data);
        for (let i = 0; i < arrayData.length; i++) {
            const itemOrItems = this.parseLedgerEntry (arrayData[i], currency);
            if (Array.isArray (itemOrItems)) {
                for (let j = 0; j < itemOrItems.length; j++) {
                    result.push (this.extend (itemOrItems[j], params));
                }
            } else {
                result.push (this.extend (itemOrItems, params));
            }
        }
        result = this.sortBy (result, 'timestamp');
        const code = (currency !== undefined) ? currency['code'] : undefined;
        return this.filterByCurrencySinceLimit (result, code, since, limit);
    }

    nonce () {
        return this.seconds ();
    }

    setHeaders (headers) {
        return headers;
    }

    marketId (symbol: string): string {
        const market = this.market (symbol);
        if (market !== undefined) {
            return market['id'];
        }
        return symbol;
    }

    symbol (symbol: string): string {
        const market = this.market (symbol);
        return this.safeString (market, 'symbol', symbol);
    }

    resolvePath (path, params) {
        return [
            this.implodeParams (path, params),
            this.omit (params, this.extractParams (path)),
        ];
    }

    filterByArray (objects, key: IndexType, values = undefined, indexed = true) {
        objects = this.toArray (objects);
        // return all of them if no values were passed
        if (values === undefined || !values) {
            return indexed ? this.indexBy (objects, key) : objects;
        }
        const results = [];
        for (let i = 0; i < objects.length; i++) {
            if (this.inArray (objects[i][key], values)) {
                results.push (objects[i]);
            }
        }
        return indexed ? this.indexBy (results, key) : results;
    }

    isUsingForcedProxy (params = undefined, api = undefined) {
        return false;
    }

    async fetch2 (path, api: any = 'public', method = 'GET', params = {}, headers: any = undefined, body: any = undefined, config = {}) {
        if (this.enableRateLimit) {
            let customExpireInterval = undefined;
            let customPriority = undefined;
            if ('customExpireInterval' in params) {
                customExpireInterval = params['customExpireInterval'];
                params = this.omit (params, 'customExpireInterval');
            }
            if ('customPriority' in params) {
                customPriority = params['customPriority'];
                params = this.omit (params, 'customPriority');
            }
            const cost = this.calculateRateLimiterCost (api, method, path, params, config);
            await this.throttle (cost, path, customExpireInterval, customPriority);
        }
        this.lastRestRequestTimestamp = this.milliseconds ();
        const forcedProxy = this.isUsingForcedProxy (params, api) ? this.forcedProxy : '';
        const request = this.sign (path, api, method, params, headers, body);
        this.last_request_headers = request['headers'];
        this.last_request_body = request['body'];
        this.last_request_url = request['url'];
        return await this.fetch (forcedProxy + request['url'], request['method'], request['headers'], request['body']);
    }

    async request (path, api: any = 'public', method = 'GET', params = {}, headers: any = undefined, body: any = undefined, config = {}) {
        return await this.fetch2 (path, api, method, params, headers, body, config);
    }

    async loadAccounts (reload = false, params = {}) {
        if (reload) {
            this.accounts = await this.fetchAccounts (params);
        } else {
            if (this.accounts) {
                return this.accounts;
            } else {
                this.accounts = await this.fetchAccounts (params);
            }
        }
        this.accountsById = this.indexBy (this.accounts, 'id') as any;
        return this.accounts;
    }

    buildOHLCVC (trades: Trade[], timeframe: string = '1m', since: number = 0, limit: number = 2147483647): OHLCVC[] {
        // given a sorted arrays of trades (recent last) and a timeframe builds an array of OHLCV candles
        // note, default limit value (2147483647) is max int32 value
        const ms = this.parseTimeframe (timeframe) * 1000;
        const ohlcvs = [];
        const i_timestamp = 0;
        // const open = 1;
        const i_high = 2;
        const i_low = 3;
        const i_close = 4;
        const i_volume = 5;
        const i_count = 6;
        const tradesLength = trades.length;
        const oldest = Math.min (tradesLength, limit);
        for (let i = 0; i < oldest; i++) {
            const trade = trades[i];
            const ts = trade['timestamp'];
            if (ts < since) {
                continue;
            }
            const openingTime = Math.floor (ts / ms) * ms; // shift to the edge of m/h/d (but not M)
            if (openingTime < since) { // we don't need bars, that have opening time earlier than requested
                continue;
            }
            const ohlcv_length = ohlcvs.length;
            const candle = ohlcv_length - 1;
            if ((candle === -1) || (openingTime >= this.sum (ohlcvs[candle][i_timestamp], ms))) {
                // moved to a new timeframe -> create a new candle from opening trade
                ohlcvs.push ([
                    openingTime, // timestamp
                    trade['price'], // O
                    trade['price'], // H
                    trade['price'], // L
                    trade['price'], // C
                    trade['amount'], // V
                    1, // count
                ]);
            } else {
                // still processing the same timeframe -> update opening trade
                ohlcvs[candle][i_high] = Math.max (ohlcvs[candle][i_high], trade['price']);
                ohlcvs[candle][i_low] = Math.min (ohlcvs[candle][i_low], trade['price']);
                ohlcvs[candle][i_close] = trade['price'];
                ohlcvs[candle][i_volume] = this.sum (ohlcvs[candle][i_volume], trade['amount']);
                ohlcvs[candle][i_count] = this.sum (ohlcvs[candle][i_count], 1);
            }
        }
        return ohlcvs;
    }

    parseTradingViewOHLCV (ohlcvs, market = undefined, timeframe = '1m', since: Int = undefined, limit: Int = undefined) {
        const result = this.convertTradingViewToOHLCV (ohlcvs);
        return this.parseOHLCVs (result, market, timeframe, since, limit);
    }

    async editLimitBuyOrder (id, symbol, amount, price = undefined, params = {}) {
        return await this.editLimitOrder (id, symbol, 'buy', amount, price, params);
    }

    async editLimitSellOrder (id, symbol, amount, price = undefined, params = {}) {
        return await this.editLimitOrder (id, symbol, 'sell', amount, price, params);
    }

    async editLimitOrder (id, symbol, side, amount, price = undefined, params = {}) {
        return await this.editOrder (id, symbol, 'limit', side, amount, price, params);
    }

    async editOrder (id: string, symbol, type, side, amount = undefined, price = undefined, params = {}): Promise<Order> {
        await this.cancelOrder (id, symbol);
        return await this.createOrder (symbol, type, side, amount, price, params);
    }

    async editOrderWs (id: string, symbol: string, type: OrderType, side: OrderSide, amount: number, price: number = undefined, params = {}): Promise<Order> {
        await this.cancelOrderWs (id, symbol);
        return await this.createOrderWs (symbol, type, side, amount, price, params);
    }

    async fetchPermissions (params = {}) {
        throw new NotSupported (this.id + ' fetchPermissions() is not supported yet');
    }

    async fetchPosition (symbol: string, params = {}): Promise<Position> {
        throw new NotSupported (this.id + ' fetchPosition() is not supported yet');
    }

    async watchPosition (symbol: string = undefined, params = {}): Promise<Position> {
        throw new NotSupported (this.id + ' watchPosition() is not supported yet');
    }

    async watchPositions (symbols: string[] = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Position[]> {
        throw new NotSupported (this.id + ' watchPositions() is not supported yet');
    }

    async watchPositionForSymbols (symbols: string[] = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Position[]> {
        return await this.watchPositions (symbols, since, limit, params);
    }

    async fetchPositionsForSymbol (symbol: string, params = {}): Promise<Position[]> {
        /**
         * @method
         * @name exchange#fetchPositionsForSymbol
         * @description fetches all open positions for specific symbol, unlike fetchPositions (which is designed to work with multiple symbols) so this method might be preffered for one-market position, because of less rate-limit consumption and speed
         * @param {string} symbol unified market symbol
         * @param {object} params extra parameters specific to the endpoint
         * @returns {object[]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure} with maximum 3 items - possible one position for "one-way" mode, and possible two positions (long & short) for "two-way" (a.k.a. hedge) mode
         */
        throw new NotSupported (this.id + ' fetchPositionsForSymbol() is not supported yet');
    }

    async fetchPositions (symbols: string[] = undefined, params = {}): Promise<Position[]> {
        throw new NotSupported (this.id + ' fetchPositions() is not supported yet');
    }

    async fetchPositionsRisk (symbols: string[] = undefined, params = {}): Promise<Position[]> {
        throw new NotSupported (this.id + ' fetchPositionsRisk() is not supported yet');
    }

    async fetchBidsAsks (symbols: string[] = undefined, params = {}): Promise<Dictionary<Ticker>> {
        throw new NotSupported (this.id + ' fetchBidsAsks() is not supported yet');
    }

    parseBidAsk (bidask, priceKey: IndexType = 0, amountKey: IndexType = 1) {
        const price = this.safeNumber (bidask, priceKey);
        const amount = this.safeNumber (bidask, amountKey);
        return [ price, amount ];
    }

    safeCurrency (currencyId: Str, currency: Currency = undefined): CurrencyInterface {
        if ((currencyId === undefined) && (currency !== undefined)) {
            return currency;
        }
        if ((this.currencies_by_id !== undefined) && (currencyId in this.currencies_by_id) && (this.currencies_by_id[currencyId] !== undefined)) {
            return this.currencies_by_id[currencyId];
        }
        let code = currencyId;
        if (currencyId !== undefined) {
            code = this.commonCurrencyCode (currencyId.toUpperCase ());
        }
        return {
            'id': currencyId,
            'code': code,
            'precision': undefined,
        };
    }

    safeMarket (marketId: Str, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): MarketInterface {
        const result = this.safeMarketStructure ({
            'symbol': marketId,
            'marketId': marketId,
        });
        if (marketId !== undefined) {
            if ((this.markets_by_id !== undefined) && (marketId in this.markets_by_id)) {
                const markets = this.markets_by_id[marketId];
                const numMarkets = markets.length;
                if (numMarkets === 1) {
                    return markets[0];
                } else {
                    if (marketType === undefined) {
                        if (market === undefined) {
                            throw new ArgumentsRequired (this.id + ' safeMarket() requires a fourth argument for ' + marketId + ' to disambiguate between different markets with the same market id');
                        } else {
                            marketType = market['type'];
                        }
                    }
                    for (let i = 0; i < markets.length; i++) {
                        const currentMarket = markets[i];
                        if (currentMarket[marketType]) {
                            return currentMarket;
                        }
                    }
                }
            } else if (delimiter !== undefined) {
                const parts = marketId.split (delimiter);
                const partsLength = parts.length;
                if (partsLength === 2) {
                    result['baseId'] = this.safeString (parts, 0);
                    result['quoteId'] = this.safeString (parts, 1);
                    result['base'] = this.safeCurrencyCode (result['baseId']);
                    result['quote'] = this.safeCurrencyCode (result['quoteId']);
                    result['symbol'] = result['base'] + '/' + result['quote'];
                    return result;
                } else {
                    return result;
                }
            }
        }
        if (market !== undefined) {
            return market;
        }
        return result;
    }

    checkRequiredCredentials (error = true) {
        const keys = Object.keys (this.requiredCredentials);
        if (this.token) return true;
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this.requiredCredentials[key] && !this[key]) {
                if (error) {
                    throw new AuthenticationError (this.id + ' requires "' + key + '" credential');
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    oath () {
        if (this.twofa !== undefined) {
            return totp (this.twofa);
        } else {
            throw new ExchangeError (this.id + ' exchange.twofa has not been set for 2FA Two-Factor Authentication');
        }
    }

    async fetchBalance (params = {}): Promise<Balances> {
        throw new NotSupported (this.id + ' fetchBalance() is not supported yet');
    }

    async fetchBalanceWs (params = {}): Promise<Balances> {
        throw new NotSupported (this.id + ' fetchBalanceWs() is not supported yet');
    }

    parseBalance (response): Balances {
        throw new NotSupported (this.id + ' parseBalance() is not supported yet');
    }

    async watchBalance (params = {}): Promise<Balances> {
        throw new NotSupported (this.id + ' watchBalance() is not supported yet');
    }

    async fetchPartialBalance (part, params = {}) {
        const balance = await this.fetchBalance (params);
        return balance[part];
    }

    async fetchFreeBalance (params = {}) {
        return await this.fetchPartialBalance ('free', params);
    }

    async fetchUsedBalance (params = {}) {
        return await this.fetchPartialBalance ('used', params);
    }

    async fetchTotalBalance (params = {}) {
        return await this.fetchPartialBalance ('total', params);
    }

    async fetchStatus (params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchStatus() is not supported yet');
    }

    async fetchFundingFee (code: string, params = {}) {
        const warnOnFetchFundingFee = this.safeValue (this.options, 'warnOnFetchFundingFee', true);
        if (warnOnFetchFundingFee) {
            throw new NotSupported (this.id + ' fetchFundingFee() method is deprecated, it will be removed in July 2022, please, use fetchTransactionFee() or set exchange.options["warnOnFetchFundingFee"] = false to suppress this warning');
        }
        return await this.fetchTransactionFee (code, params);
    }

    async fetchFundingFees (codes: string[] = undefined, params = {}) {
        const warnOnFetchFundingFees = this.safeValue (this.options, 'warnOnFetchFundingFees', true);
        if (warnOnFetchFundingFees) {
            throw new NotSupported (this.id + ' fetchFundingFees() method is deprecated, it will be removed in July 2022. Please, use fetchTransactionFees() or set exchange.options["warnOnFetchFundingFees"] = false to suppress this warning');
        }
        return await this.fetchTransactionFees (codes, params);
    }

    async fetchTransactionFee (code: string, params = {}) {
        if (!this.has['fetchTransactionFees']) {
            throw new NotSupported (this.id + ' fetchTransactionFee() is not supported yet');
        }
        return await this.fetchTransactionFees ([ code ], params);
    }

    async fetchTransactionFees (codes: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchTransactionFees() is not supported yet');
    }

    async fetchDepositWithdrawFees (codes: string[] = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchDepositWithdrawFees() is not supported yet');
    }

    async fetchDepositWithdrawFee (code: string, params = {}) {
        if (!this.has['fetchDepositWithdrawFees']) {
            throw new NotSupported (this.id + ' fetchDepositWithdrawFee() is not supported yet');
        }
        const fees = await this.fetchDepositWithdrawFees ([ code ], params);
        return this.safeValue (fees, code);
    }

    getSupportedMapping (key, mapping = {}) {
        if (key in mapping) {
            return mapping[key];
        } else {
            throw new NotSupported (this.id + ' ' + key + ' does not have a value in mapping');
        }
    }

    async fetchCrossBorrowRate (code: string, params = {}) {
        await this.loadMarkets ();
        if (!this.has['fetchBorrowRates']) {
            throw new NotSupported (this.id + ' fetchCrossBorrowRate() is not supported yet');
        }
        const borrowRates = await this.fetchCrossBorrowRates (params);
        const rate = this.safeValue (borrowRates, code);
        if (rate === undefined) {
            throw new ExchangeError (this.id + ' fetchCrossBorrowRate() could not find the borrow rate for currency code ' + code);
        }
        return rate;
    }

    async fetchIsolatedBorrowRate (symbol: string, params = {}) {
        await this.loadMarkets ();
        if (!this.has['fetchBorrowRates']) {
            throw new NotSupported (this.id + ' fetchIsolatedBorrowRate() is not supported yet');
        }
        const borrowRates = await this.fetchIsolatedBorrowRates (params);
        const rate = this.safeValue (borrowRates, symbol);
        if (rate === undefined) {
            throw new ExchangeError (this.id + ' fetchIsolatedBorrowRate() could not find the borrow rate for market symbol ' + symbol);
        }
        return rate;
    }

    handleOptionAndParams (params, methodName, optionName, defaultValue = undefined) {
        // This method can be used to obtain method specific properties, i.e: this.handleOptionAndParams (params, 'fetchPosition', 'marginMode', 'isolated')
        const defaultOptionName = 'default' + this.capitalize (optionName); // we also need to check the 'defaultXyzWhatever'
        // check if params contain the key
        let value = this.safeValue2 (params, optionName, defaultOptionName);
        if (value !== undefined) {
            params = this.omit (params, [ optionName, defaultOptionName ]);
        } else {
            // check if exchange has properties for this method
            const exchangeWideMethodOptions = this.safeValue (this.options, methodName);
            if (exchangeWideMethodOptions !== undefined) {
                // check if the option is defined inside this method's props
                value = this.safeValue2 (exchangeWideMethodOptions, optionName, defaultOptionName);
            }
            if (value === undefined) {
                // if it's still undefined, check if global exchange-wide option exists
                value = this.safeValue2 (this.options, optionName, defaultOptionName);
            }
            // if it's still undefined, use the default value
            value = (value !== undefined) ? value : defaultValue;
        }
        return [ value, params ];
    }

    handleOption (methodName, optionName, defaultValue = undefined) {
        // eslint-disable-next-line no-unused-vars
        const [ result, empty ] = this.handleOptionAndParams ({}, methodName, optionName, defaultValue);
        return result;
    }

    handleMarketTypeAndParams (methodName: string, market: Market = undefined, params = {}): any {
        const defaultType = this.safeString2 (this.options, 'defaultType', 'type', 'spot');
        const methodOptions = this.safeValue (this.options, methodName);
        let methodType = defaultType;
        if (methodOptions !== undefined) {
            if (typeof methodOptions === 'string') {
                methodType = methodOptions;
            } else {
                methodType = this.safeString2 (methodOptions, 'defaultType', 'type', methodType);
            }
        }
        const marketType = (market === undefined) ? methodType : market['type'];
        const type = this.safeString2 (params, 'defaultType', 'type', marketType);
        params = this.omit (params, [ 'defaultType', 'type' ]);
        return [ type, params ];
    }

    handleSubTypeAndParams (methodName, market = undefined, params = {}, defaultValue = undefined) {
        let subType = undefined;
        // if set in params, it takes precedence
        const subTypeInParams = this.safeString2 (params, 'subType', 'defaultSubType');
        // avoid omitting if it's not present
        if (subTypeInParams !== undefined) {
            subType = subTypeInParams;
            params = this.omit (params, [ 'subType', 'defaultSubType' ]);
        } else {
            // at first, check from market object
            if (market !== undefined) {
                if (market['linear']) {
                    subType = 'linear';
                } else if (market['inverse']) {
                    subType = 'inverse';
                }
            }
            // if it was not defined in market object
            if (subType === undefined) {
                const values = this.handleOptionAndParams (undefined, methodName, 'subType', defaultValue); // no need to re-test params here
                subType = values[0];
            }
        }
        return [ subType, params ];
    }

    handleMarginModeAndParams (methodName, params = {}, defaultValue = undefined) {
        /**
         * @ignore
         * @method
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Array} the marginMode in lowercase as specified by params["marginMode"], params["defaultMarginMode"] this.options["marginMode"] or this.options["defaultMarginMode"]
         */
        return this.handleOptionAndParams (params, methodName, 'marginMode', defaultValue);
    }

    throwExactlyMatchedException (exact, string, message) {
        if (string in exact) {
            throw new exact[string] (message);
        }
    }

    throwBroadlyMatchedException (broad, string, message) {
        const broadKey = this.findBroadlyMatchedKey (broad, string);
        if (broadKey !== undefined) {
            throw new broad[broadKey] (message);
        }
    }

    findBroadlyMatchedKey (broad, string) {
        // a helper for matching error strings exactly vs broadly
        const keys = Object.keys (broad);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (string !== undefined) { // #issues/12698
                if (string.indexOf (key) >= 0) {
                    return key;
                }
            }
        }
        return undefined;
    }

    handleErrors (statusCode, statusText, url, method, responseHeaders, responseBody, response, requestHeaders, requestBody) {
        // it is a stub method that must be overrided in the derived exchange classes
        // throw new NotSupported (this.id + ' handleErrors() not implemented yet');
        return undefined;
    }

    calculateRateLimiterCost (api, method, path, params, config = {}) {
        return this.safeValue (config, 'cost', 1);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        if (this.has['fetchTickers']) {
            await this.loadMarkets ();
            const market = this.market (symbol);
            symbol = market['symbol'];
            const tickers = await this.fetchTickers ([ symbol ], params);
            const ticker = this.safeValue (tickers, symbol);
            if (ticker === undefined) {
                throw new NullResponse (this.id + ' fetchTickers() could not find a ticker for ' + symbol);
            } else {
                return ticker;
            }
        } else {
            throw new NotSupported (this.id + ' fetchTicker() is not supported yet');
        }
    }

    async watchTicker (symbol: string, params = {}): Promise<Ticker> {
        throw new NotSupported (this.id + ' watchTicker() is not supported yet');
    }

    async fetchTickers (symbols: string[] = undefined, params = {}): Promise<Tickers> {
        throw new NotSupported (this.id + ' fetchTickers() is not supported yet');
    }

    async fetchOrderBooks (symbols: string[] = undefined, limit: Int = undefined, params = {}): Promise<Dictionary<OrderBook>> {
        throw new NotSupported (this.id + ' fetchOrderBooks() is not supported yet');
    }

    async watchTickers (symbols: string[] = undefined, params = {}): Promise<Dictionary<Ticker>> {
        throw new NotSupported (this.id + ' watchTickers() is not supported yet');
    }

    async fetchOrder (id: string, symbol: string = undefined, params = {}): Promise<Order> {
        throw new NotSupported (this.id + ' fetchOrder() is not supported yet');
    }

    async fetchOrderWs (id: string, symbol: string = undefined, params = {}): Promise<Order> {
        throw new NotSupported (this.id + ' fetchOrderWs() is not supported yet');
    }

    async fetchOrderStatus (id: string, symbol: string = undefined, params = {}): Promise<string> {
        // TODO: TypeScript: change method signature by replacing
        // Promise<string> with Promise<Order['status']>.
        const order = await this.fetchOrder (id, symbol, params);
        return order['status'];
    }

    async fetchUnifiedOrder (order, params = {}): Promise<Order> {
        return await this.fetchOrder (this.safeValue (order, 'id'), this.safeValue (order, 'symbol'), params);
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount, price = undefined, params = {}): Promise<Order> {
        throw new NotSupported (this.id + ' createOrder() is not supported yet');
    }

    async createMarketOrderWithCost (symbol: string, side: OrderSide, cost, params = {}) {
        /**
         * @method
         * @name createMarketOrderWithCost
         * @description create a market order by providing the symbol, side and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} side 'buy' or 'sell'
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (this.options['createMarketOrderWithCost'] || (this.options['createMarketBuyOrderWithCost'] && this.options['createMarketSellOrderWithCost'])) {
            return await this.createOrder (symbol, 'market', side, cost, 1, params);
        }
        throw new NotSupported (this.id + ' createMarketOrderWithCost() is not supported yet');
    }

    async createMarketBuyOrderWithCost (symbol: string, cost, params = {}): Promise<Order> {
        /**
         * @method
         * @name createMarketBuyOrderWithCost
         * @description create a market buy order by providing the symbol and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (this.options['createMarketBuyOrderRequiresPrice'] || this.options['createMarketBuyOrderWithCost']) {
            return await this.createOrder (symbol, 'market', 'buy', cost, 1, params);
        }
        throw new NotSupported (this.id + ' createMarketBuyOrderWithCost() is not supported yet');
    }

    async createMarketSellOrderWithCost (symbol: string, cost, params = {}): Promise<Order> {
        /**
         * @method
         * @name createMarketSellOrderWithCost
         * @description create a market sell order by providing the symbol and cost
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        if (this.options['createMarketSellOrderRequiresPrice'] || this.options['createMarketSellOrderWithCost']) {
            return await this.createOrder (symbol, 'market', 'sell', cost, 1, params);
        }
        throw new NotSupported (this.id + ' createMarketSellOrderWithCost() is not supported yet');
    }

    async createOrders (orders: OrderRequest[], params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' createOrders() is not supported yet');
    }

    async createOrderWs (symbol: string, type: OrderType, side: OrderSide, amount: number, price: number = undefined, params = {}): Promise<Order> {
        throw new NotSupported (this.id + ' createOrderWs() is not supported yet');
    }

    async cancelOrder (id: string, symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' cancelOrder() is not supported yet');
    }

    async cancelOrderWs (id: string, symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' cancelOrderWs() is not supported yet');
    }

    async cancelOrdersWs (ids: string[], symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' cancelOrdersWs() is not supported yet');
    }

    async cancelAllOrders (symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' cancelAllOrders() is not supported yet');
    }

    async cancelAllOrdersWs (symbol: string = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' cancelAllOrdersWs() is not supported yet');
    }

    async cancelUnifiedOrder (order, params = {}) {
        return this.cancelOrder (this.safeValue (order, 'id'), this.safeValue (order, 'symbol'), params);
    }

    async fetchOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' fetchOrders() is not supported yet');
    }

    async fetchOrderTrades (id: string, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' fetchOrderTrades() is not supported yet');
    }

    async watchOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' watchOrders() is not supported yet');
    }

    async fetchOpenOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' fetchOpenOrders() is not supported yet');
    }

    async fetchOpenOrdersWs (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' fetchOpenOrdersWs() is not supported yet');
    }

    async fetchClosedOrders (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        throw new NotSupported (this.id + ' fetchClosedOrders() is not supported yet');
    }

    async fetchMyTrades (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' fetchMyTrades() is not supported yet');
    }

    async fetchMyLiquidations (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Liquidation[]> {
        throw new NotSupported (this.id + ' fetchMyLiquidations() is not supported yet');
    }

    async fetchLiquidations (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Liquidation[]> {
        throw new NotSupported (this.id + ' fetchLiquidations() is not supported yet');
    }

    async fetchMyTradesWs (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' fetchMyTradesWs() is not supported yet');
    }

    async watchMyTrades (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        throw new NotSupported (this.id + ' watchMyTrades() is not supported yet');
    }

    async fetchOHLCVWs (symbol: string, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        throw new NotSupported (this.id + ' fetchOHLCVWs() is not supported yet');
    }

    async fetchGreeks (symbol: string, params = {}): Promise<Greeks> {
        throw new NotSupported (this.id + ' fetchGreeks() is not supported yet');
    }

    async fetchDepositsWithdrawals (code: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<any> {
        /**
         * @method
         * @name exchange#fetchDepositsWithdrawals
         * @description fetch history of deposits and withdrawals
         * @param {string} [code] unified currency code for the currency of the deposit/withdrawals, default is undefined
         * @param {int} [since] timestamp in ms of the earliest deposit/withdrawal, default is undefined
         * @param {int} [limit] max number of deposit/withdrawals to return, default is undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        throw new NotSupported (this.id + ' fetchDepositsWithdrawals() is not supported yet');
    }

    async fetchDeposits (code: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchDeposits() is not supported yet');
    }

    async fetchWithdrawals (code: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchWithdrawals() is not supported yet');
    }

    async fetchOpenInterest (symbol: string, params = {}): Promise<OpenInterest> {
        throw new NotSupported (this.id + ' fetchOpenInterest() is not supported yet');
    }

    async fetchFundingRateHistory (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<FundingRateHistory[]> {
        throw new NotSupported (this.id + ' fetchFundingRateHistory() is not supported yet');
    }

    async fetchFundingHistory (symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<FundingHistory[]> {
        throw new NotSupported (this.id + ' fetchFundingHistory() is not supported yet');
    }

    async closePosition (symbol: string, side: OrderSide = undefined, params = {}): Promise<Order> {
        throw new NotSupported (this.id + ' closePositions() is not supported yet');
    }

    async closeAllPositions (params = {}): Promise<Position[]> {
        throw new NotSupported (this.id + ' closeAllPositions() is not supported yet');
    }

    parseLastPrice (price, market: Market = undefined): any {
        throw new NotSupported (this.id + ' parseLastPrice() is not supported yet');
    }

    async fetchDepositAddress (code: string, params = {}) {
        if (this.has['fetchDepositAddresses']) {
            const depositAddresses = await this.fetchDepositAddresses ([ code ], params);
            const depositAddress = this.safeValue (depositAddresses, code);
            if (depositAddress === undefined) {
                throw new InvalidAddress (this.id + ' fetchDepositAddress() could not find a deposit address for ' + code + ', make sure you have created a corresponding deposit address in your wallet on the exchange website');
            } else {
                return depositAddress;
            }
        } else {
            throw new NotSupported (this.id + ' fetchDepositAddress() is not supported yet');
        }
    }

    account (): Account {
        return {
            'free': undefined,
            'used': undefined,
            'total': undefined,
        };
    }

    commonCurrencyCode (currency: string) {
        if (!this.substituteCommonCurrencyCodes) {
            return currency;
        }
        return this.safeString (this.commonCurrencies, currency, currency);
    }

    currency (code) {
        if (this.currencies === undefined) {
            throw new ExchangeError (this.id + ' currencies not loaded');
        }
        if (typeof code === 'string') {
            if (code in this.currencies) {
                return this.currencies[code];
            } else if (code in this.currencies_by_id) {
                return this.currencies_by_id[code];
            }
        }
        throw new ExchangeError (this.id + ' does not have currency code ' + code);
    }

    market (symbol: string): MarketInterface {
        if (this.markets === undefined) {
            throw new ExchangeError (this.id + ' markets not loaded');
        }
        if (symbol in this.markets) {
            return this.markets[symbol];
        } else if (symbol in this.markets_by_id) {
            const markets = this.markets_by_id[symbol];
            const defaultType = this.safeString2 (this.options, 'defaultType', 'defaultSubType', 'spot');
            for (let i = 0; i < markets.length; i++) {
                const market = markets[i];
                if (market[defaultType]) {
                    return market;
                }
            }
            return markets[0];
        }
        throw new BadSymbol (this.id + ' does not have market symbol ' + symbol);
    }

    handleWithdrawTagAndParams (tag, params): any {
        if (typeof tag === 'object') {
            params = this.extend (tag, params);
            tag = undefined;
        }
        if (tag === undefined) {
            tag = this.safeString (params, 'tag');
            if (tag !== undefined) {
                params = this.omit (params, 'tag');
            }
        }
        return [ tag, params ];
    }

    async createLimitOrder (symbol: string, side: OrderSide, amount, price, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'limit', side, amount, price, params);
    }

    async createMarketOrder (symbol: string, side: OrderSide, amount, price = undefined, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'market', side, amount, price, params);
    }

    async createLimitBuyOrder (symbol: string, amount, price, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'limit', 'buy', amount, price, params);
    }

    async createLimitSellOrder (symbol: string, amount, price, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'limit', 'sell', amount, price, params);
    }

    async createMarketBuyOrder (symbol: string, amount, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'market', 'buy', amount, undefined, params);
    }

    async createMarketSellOrder (symbol: string, amount, params = {}): Promise<Order> {
        return await this.createOrder (symbol, 'market', 'sell', amount, undefined, params);
    }

    costToPrecision (symbol: string, cost) {
        const market = this.market (symbol);
        return this.decimalToPrecision (cost, TRUNCATE, market['precision']['price'], this.precisionMode, this.paddingMode);
    }

    priceToPrecision (symbol: string, price): string {
        const market = this.market (symbol);
        const result = this.decimalToPrecision (price, ROUND, market['precision']['price'], this.precisionMode, this.paddingMode);
        if (result === '0') {
            throw new InvalidOrder (this.id + ' price of ' + market['symbol'] + ' must be greater than minimum price precision of ' + this.numberToString (market['precision']['price']));
        }
        return result;
    }

    amountToPrecision (symbol: string, amount) {
        const market = this.market (symbol);
        const result = this.decimalToPrecision (amount, TRUNCATE, market['precision']['amount'], this.precisionMode, this.paddingMode);
        if (result === '0') {
            throw new InvalidOrder (this.id + ' amount of ' + market['symbol'] + ' must be greater than minimum amount precision of ' + this.numberToString (market['precision']['amount']));
        }
        return result;
    }

    feeToPrecision (symbol: string, fee) {
        const market = this.market (symbol);
        return this.decimalToPrecision (fee, ROUND, market['precision']['price'], this.precisionMode, this.paddingMode);
    }

    currencyToPrecision (code: string, fee, networkCode = undefined) {
        const currency = this.currencies[code];
        let precision = this.safeValue (currency, 'precision');
        if (networkCode !== undefined) {
            const networks = this.safeValue (currency, 'networks', {});
            const networkItem = this.safeValue (networks, networkCode, {});
            precision = this.safeValue (networkItem, 'precision', precision);
        }
        if (precision === undefined) {
            return this.forceString (fee);
        } else {
            return this.decimalToPrecision (fee, TRUNCATE, precision, this.precisionMode, this.paddingMode);
        }
    }

    forceString (value) {
        if (typeof value !== 'string') {
            return this.numberToString (value);
        }
        return value;
    }

    isTickPrecision () {
        return this.precisionMode === TICK_SIZE;
    }

    isDecimalPrecision () {
        return this.precisionMode === DECIMAL_PLACES;
    }

    isSignificantPrecision () {
        return this.precisionMode === SIGNIFICANT_DIGITS;
    }

    safeNumber (obj: object, key: IndexType, defaultNumber: number = undefined): Num {
        const value = this.safeString (obj, key);
        return this.parseNumber (value, defaultNumber);
    }

    safeNumberN (obj: object, arr: IndexType[], defaultNumber: number = undefined): Num {
        const value = this.safeStringN (obj, arr);
        return this.parseNumber (value, defaultNumber);
    }

    parsePrecision (precision?: string) {
        /**
         * @ignore
         * @method
         * @param {string} precision The number of digits to the right of the decimal
         * @returns {string} a string number equal to 1e-precision
         */
        if (precision === undefined) {
            return undefined;
        }
        const precisionNumber = parseInt (precision);
        if (precisionNumber === 0) {
            return '1';
        }
        let parsedPrecision = '0.';
        for (let i = 0; i < precisionNumber - 1; i++) {
            parsedPrecision = parsedPrecision + '0';
        }
        return parsedPrecision + '1';
    }

    async loadTimeDifference (params = {}) {
        const serverTime = await this.fetchTime (params);
        const after = this.milliseconds ();
        this.options['timeDifference'] = after - serverTime;
        return this.options['timeDifference'];
    }

    implodeHostname (url: string) {
        return this.implodeParams (url, { 'hostname': this.hostname });
    }

    async fetchMarketLeverageTiers (symbol: string, params = {}) {
        if (this.has['fetchLeverageTiers']) {
            const market = this.market (symbol);
            if (!market['contract']) {
                throw new BadSymbol (this.id + ' fetchMarketLeverageTiers() supports contract markets only');
            }
            const tiers = await this.fetchLeverageTiers ([ symbol ]);
            return this.safeValue (tiers, symbol);
        } else {
            throw new NotSupported (this.id + ' fetchMarketLeverageTiers() is not supported yet');
        }
    }

    async createPostOnlyOrder (symbol: string, type: OrderType, side: OrderSide, amount, price, params = {}) {
        if (!this.has['createPostOnlyOrder']) {
            throw new NotSupported (this.id + 'createPostOnlyOrder() is not supported yet');
        }
        const query = this.extend (params, { 'postOnly': true });
        return await this.createOrder (symbol, type, side, amount, price, query);
    }

    async createReduceOnlyOrder (symbol: string, type: OrderType, side: OrderSide, amount, price, params = {}) {
        if (!this.has['createReduceOnlyOrder']) {
            throw new NotSupported (this.id + 'createReduceOnlyOrder() is not supported yet');
        }
        const query = this.extend (params, { 'reduceOnly': true });
        return await this.createOrder (symbol, type, side, amount, price, query);
    }

    async createStopOrder (symbol: string, type: OrderType, side: OrderSide, amount, price = undefined, stopPrice = undefined, params = {}) {
        if (!this.has['createStopOrder']) {
            throw new NotSupported (this.id + ' createStopOrder() is not supported yet');
        }
        if (stopPrice === undefined) {
            throw new ArgumentsRequired (this.id + ' create_stop_order() requires a stopPrice argument');
        }
        const query = this.extend (params, { 'stopPrice': stopPrice });
        return await this.createOrder (symbol, type, side, amount, price, query);
    }

    async createStopLimitOrder (symbol: string, side: OrderSide, amount, price, stopPrice, params = {}) {
        if (!this.has['createStopLimitOrder']) {
            throw new NotSupported (this.id + ' createStopLimitOrder() is not supported yet');
        }
        const query = this.extend (params, { 'stopPrice': stopPrice });
        return await this.createOrder (symbol, 'limit', side, amount, price, query);
    }

    async createStopMarketOrder (symbol: string, side: OrderSide, amount, stopPrice, params = {}) {
        if (!this.has['createStopMarketOrder']) {
            throw new NotSupported (this.id + ' createStopMarketOrder() is not supported yet');
        }
        const query = this.extend (params, { 'stopPrice': stopPrice });
        return await this.createOrder (symbol, 'market', side, amount, undefined, query);
    }

    safeCurrencyCode (currencyId: Str, currency: Currency = undefined): string {
        currency = this.safeCurrency (currencyId, currency);
        return currency['code'];
    }

    filterBySymbolSinceLimit (array, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, tail = false) {
        return this.filterByValueSinceLimit (array, 'symbol', symbol, since, limit, 'timestamp', tail);
    }

    filterByCurrencySinceLimit (array, code = undefined, since: Int = undefined, limit: Int = undefined, tail = false) {
        return this.filterByValueSinceLimit (array, 'currency', code, since, limit, 'timestamp', tail);
    }

    filterBySymbolsSinceLimit (array, symbols: string[] = undefined, since: Int = undefined, limit: Int = undefined, tail = false) {
        const result = this.filterByArray (array, 'symbol', symbols, false);
        return this.filterBySinceLimit (result, since, limit, 'timestamp', tail);
    }

    parseLastPrices (pricesData, symbols: string[] = undefined, params = {}) {
        //
        // the value of tickers is either a dict or a list
        //
        // dict
        //
        //     {
        //         'marketId1': { ... },
        //         'marketId2': { ... },
        //         ...
        //     }
        //
        // list
        //
        //     [
        //         { 'market': 'marketId1', ... },
        //         { 'market': 'marketId2', ... },
        //         ...
        //     ]
        //
        const results = [];
        if (Array.isArray (pricesData)) {
            for (let i = 0; i < pricesData.length; i++) {
                const priceData = this.extend (this.parseLastPrice (pricesData[i]), params);
                results.push (priceData);
            }
        } else {
            const marketIds = Object.keys (pricesData);
            for (let i = 0; i < marketIds.length; i++) {
                const marketId = marketIds[i];
                const market = this.safeMarket (marketId);
                const priceData = this.extend (this.parseLastPrice (pricesData[marketId], market), params);
                results.push (priceData);
            }
        }
        symbols = this.marketSymbols (symbols);
        return this.filterByArray (results, 'symbol', symbols);
    }

    parseTickers (tickers, symbols: string[] = undefined, params = {}): Dictionary<Ticker> {
        //
        // the value of tickers is either a dict or a list
        //
        // dict
        //
        //     {
        //         'marketId1': { ... },
        //         'marketId2': { ... },
        //         'marketId3': { ... },
        //         ...
        //     }
        //
        // list
        //
        //     [
        //         { 'market': 'marketId1', ... },
        //         { 'market': 'marketId2', ... },
        //         { 'market': 'marketId3', ... },
        //         ...
        //     ]
        //
        const results = [];
        if (Array.isArray (tickers)) {
            for (let i = 0; i < tickers.length; i++) {
                const ticker = this.extend (this.parseTicker (tickers[i]), params);
                results.push (ticker);
            }
        } else {
            const marketIds = Object.keys (tickers);
            for (let i = 0; i < marketIds.length; i++) {
                const marketId = marketIds[i];
                const market = this.safeMarket (marketId);
                const ticker = this.extend (this.parseTicker (tickers[marketId], market), params);
                results.push (ticker);
            }
        }
        symbols = this.marketSymbols (symbols);
        return this.filterByArray (results, 'symbol', symbols);
    }

    parseDepositAddresses (addresses, codes: string[] = undefined, indexed = true, params = {}) {
        let result = [];
        for (let i = 0; i < addresses.length; i++) {
            const address = this.extend (this.parseDepositAddress (addresses[i]), params);
            result.push (address);
        }
        if (codes !== undefined) {
            result = this.filterByArray (result, 'currency', codes, false);
        }
        if (indexed) {
            return this.indexBy (result, 'currency');
        }
        return result;
    }

    parseBorrowInterests (response, market: Market = undefined) {
        const interests = [];
        for (let i = 0; i < response.length; i++) {
            const row = response[i];
            interests.push (this.parseBorrowInterest (row, market));
        }
        return interests;
    }

    parseFundingRateHistories (response, market = undefined, since: Int = undefined, limit: Int = undefined): FundingRateHistory[] {
        const rates = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            rates.push (this.parseFundingRateHistory (entry, market));
        }
        const sorted = this.sortBy (rates, 'timestamp');
        const symbol = (market === undefined) ? undefined : market['symbol'];
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit) as FundingRateHistory[];
    }

    safeSymbol (marketId: Str, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): string {
        market = this.safeMarket (marketId, market, delimiter, marketType);
        return market['symbol'];
    }

    parseFundingRate (contract: string, market: Market = undefined) {
        throw new NotSupported (this.id + ' parseFundingRate() is not supported yet');
    }

    parseFundingRates (response, market: Market = undefined) {
        const result = {};
        for (let i = 0; i < response.length; i++) {
            const parsed = this.parseFundingRate (response[i], market);
            result[parsed['symbol']] = parsed;
        }
        return result;
    }

    isTriggerOrder (params) {
        const isTrigger = this.safeValue2 (params, 'trigger', 'stop');
        if (isTrigger) {
            params = this.omit (params, [ 'trigger', 'stop' ]);
        }
        return [ isTrigger, params ];
    }

    isPostOnly (isMarketOrder: boolean, exchangeSpecificParam, params = {}) {
        /**
         * @ignore
         * @method
         * @param {string} type Order type
         * @param {boolean} exchangeSpecificParam exchange specific postOnly
         * @param {object} [params] exchange specific params
         * @returns {boolean} true if a post only order, false otherwise
         */
        const timeInForce = this.safeStringUpper (params, 'timeInForce');
        let postOnly = this.safeValue2 (params, 'postOnly', 'post_only', false);
        // we assume timeInForce is uppercase from safeStringUpper (params, 'timeInForce')
        const ioc = timeInForce === 'IOC';
        const fok = timeInForce === 'FOK';
        const timeInForcePostOnly = timeInForce === 'PO';
        postOnly = postOnly || timeInForcePostOnly || exchangeSpecificParam;
        if (postOnly) {
            if (ioc || fok) {
                throw new InvalidOrder (this.id + ' postOnly orders cannot have timeInForce equal to ' + timeInForce);
            } else if (isMarketOrder) {
                throw new InvalidOrder (this.id + ' market orders cannot be postOnly');
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    handlePostOnly (isMarketOrder: boolean, exchangeSpecificPostOnlyOption: boolean, params: any = {}) {
        /**
         * @ignore
         * @method
         * @param {string} type Order type
         * @param {boolean} exchangeSpecificBoolean exchange specific postOnly
         * @param {object} [params] exchange specific params
         * @returns {Array}
         */
        const timeInForce = this.safeStringUpper (params, 'timeInForce');
        let postOnly = this.safeValue (params, 'postOnly', false);
        const ioc = timeInForce === 'IOC';
        const fok = timeInForce === 'FOK';
        const po = timeInForce === 'PO';
        postOnly = postOnly || po || exchangeSpecificPostOnlyOption;
        if (postOnly) {
            if (ioc || fok) {
                throw new InvalidOrder (this.id + ' postOnly orders cannot have timeInForce equal to ' + timeInForce);
            } else if (isMarketOrder) {
                throw new InvalidOrder (this.id + ' market orders cannot be postOnly');
            } else {
                if (po) {
                    params = this.omit (params, 'timeInForce');
                }
                params = this.omit (params, 'postOnly');
                return [ true, params ];
            }
        }
        return [ false, params ];
    }

    async fetchLastPrices (symbols: string[] = undefined, params = {}) {
        throw new NotSupported (this.id + ' fetchLastPrices() is not supported yet');
    }

    async fetchTradingFees (params = {}): Promise<any> {
        throw new NotSupported (this.id + ' fetchTradingFees() is not supported yet');
    }

    async fetchTradingFee (symbol: string, params = {}) {
        if (!this.has['fetchTradingFees']) {
            throw new NotSupported (this.id + ' fetchTradingFee() is not supported yet');
        }
        return await this.fetchTradingFees (params);
    }

    parseOpenInterest (interest, market: Market = undefined): OpenInterest {
        throw new NotSupported (this.id + ' parseOpenInterest () is not supported yet');
    }

    parseOpenInterests (response, market = undefined, since: Int = undefined, limit: Int = undefined): OpenInterest[] {
        const interests = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const interest = this.parseOpenInterest (entry, market);
            interests.push (interest);
        }
        const sorted = this.sortBy (interests, 'timestamp');
        const symbol = this.safeString (market, 'symbol');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit);
    }

    async fetchFundingRate (symbol: string, params = {}) {
        if (this.has['fetchFundingRates']) {
            await this.loadMarkets ();
            const market = this.market (symbol);
            symbol = market['symbol'];
            if (!market['contract']) {
                throw new BadSymbol (this.id + ' fetchFundingRate() supports contract markets only');
            }
            const rates = await this.fetchFundingRates ([ symbol ], params);
            const rate = this.safeValue (rates, symbol);
            if (rate === undefined) {
                throw new NullResponse (this.id + ' fetchFundingRate () returned no data for ' + symbol);
            } else {
                return rate;
            }
        } else {
            throw new NotSupported (this.id + ' fetchFundingRate () is not supported yet');
        }
    }

    async fetchMarkOHLCV (symbol, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name exchange#fetchMarkOHLCV
         * @description fetches historical mark price candlestick data containing the open, high, low, and close price of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {float[][]} A list of candles ordered as timestamp, open, high, low, close, undefined
         */
        if (this.has['fetchMarkOHLCV']) {
            const request = {
                'price': 'mark',
            };
            return await this.fetchOHLCV (symbol, timeframe, since, limit, this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchMarkOHLCV () is not supported yet');
        }
    }

    async fetchIndexOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name exchange#fetchIndexOHLCV
         * @description fetches historical index price candlestick data containing the open, high, low, and close price of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {} A list of candles ordered as timestamp, open, high, low, close, undefined
         */
        if (this.has['fetchIndexOHLCV']) {
            const request = {
                'price': 'index',
            };
            return await this.fetchOHLCV (symbol, timeframe, since, limit, this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchIndexOHLCV () is not supported yet');
        }
    }

    async fetchPremiumIndexOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name exchange#fetchPremiumIndexOHLCV
         * @description fetches historical premium index price candlestick data containing the open, high, low, and close price of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {float[][]} A list of candles ordered as timestamp, open, high, low, close, undefined
         */
        if (this.has['fetchPremiumIndexOHLCV']) {
            const request = {
                'price': 'premiumIndex',
            };
            return await this.fetchOHLCV (symbol, timeframe, since, limit, this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchPremiumIndexOHLCV () is not supported yet');
        }
    }

    handleTimeInForce (params = {}) {
        /**
         * @ignore
         * @method
         * * Must add timeInForce to this.options to use this method
         * @return {string} returns the exchange specific value for timeInForce
         */
        const timeInForce = this.safeStringUpper (params, 'timeInForce'); // supported values GTC, IOC, PO
        if (timeInForce !== undefined) {
            const exchangeValue = this.safeString (this.options['timeInForce'], timeInForce);
            if (exchangeValue === undefined) {
                throw new ExchangeError (this.id + ' does not support timeInForce "' + timeInForce + '"');
            }
            return exchangeValue;
        }
        return undefined;
    }

    convertTypeToAccount (account) {
        /**
         * @ignore
         * @method
         * * Must add accountsByType to this.options to use this method
         * @param {string} account key for account name in this.options['accountsByType']
         * @returns the exchange specific account name or the isolated margin id for transfers
         */
        const accountsByType = this.safeValue (this.options, 'accountsByType', {});
        const lowercaseAccount = account.toLowerCase ();
        if (lowercaseAccount in accountsByType) {
            return accountsByType[lowercaseAccount];
        } else if ((account in this.markets) || (account in this.markets_by_id)) {
            const market = this.market (account);
            return market['id'];
        } else {
            return account;
        }
    }

    checkRequiredArgument (methodName, argument, argumentName, options = []) {
        /**
         * @ignore
         * @method
         * @param {string} methodName the name of the method that the argument is being checked for
         * @param {string} argument the argument's actual value provided
         * @param {string} argumentName the name of the argument being checked (for logging purposes)
         * @param {string[]} options a list of options that the argument can be
         * @returns {undefined}
         */
        const optionsLength = options.length;
        if ((argument === undefined) || ((optionsLength > 0) && (!(this.inArray (argument, options))))) {
            const messageOptions = options.join (', ');
            let message = this.id + ' ' + methodName + '() requires a ' + argumentName + ' argument';
            if (messageOptions !== '') {
                message += ', one of ' + '(' + messageOptions + ')';
            }
            throw new ArgumentsRequired (message);
        }
    }

    checkRequiredMarginArgument (methodName: string, symbol: Str, marginMode: string) {
        /**
         * @ignore
         * @method
         * @param {string} symbol unified symbol of the market
         * @param {string} methodName name of the method that requires a symbol
         * @param {string} marginMode is either 'isolated' or 'cross'
         */
        if ((marginMode === 'isolated') && (symbol === undefined)) {
            throw new ArgumentsRequired (this.id + ' ' + methodName + '() requires a symbol argument for isolated margin');
        } else if ((marginMode === 'cross') && (symbol !== undefined)) {
            throw new ArgumentsRequired (this.id + ' ' + methodName + '() cannot have a symbol argument for cross margin');
        }
    }

    parseDepositWithdrawFees (response, codes: string[] = undefined, currencyIdKey = undefined): any {
        /**
         * @ignore
         * @method
         * @param {object[]|object} response unparsed response from the exchange
         * @param {string[]|undefined} codes the unified currency codes to fetch transactions fees for, returns all currencies when undefined
         * @param {str} currencyIdKey *should only be undefined when response is a dictionary* the object key that corresponds to the currency id
         * @returns {object} objects with withdraw and deposit fees, indexed by currency codes
         */
        const depositWithdrawFees = {};
        codes = this.marketCodes (codes);
        const isArray = Array.isArray (response);
        let responseKeys = response;
        if (!isArray) {
            responseKeys = Object.keys (response);
        }
        for (let i = 0; i < responseKeys.length; i++) {
            const entry = responseKeys[i];
            const dictionary = isArray ? entry : response[entry];
            const currencyId = isArray ? this.safeString (dictionary, currencyIdKey) : entry;
            const currency = this.safeValue (this.currencies_by_id, currencyId);
            const code = this.safeString (currency, 'code', currencyId);
            if ((codes === undefined) || (this.inArray (code, codes))) {
                depositWithdrawFees[code] = this.parseDepositWithdrawFee (dictionary, currency);
            }
        }
        return depositWithdrawFees;
    }

    parseDepositWithdrawFee (fee, currency: Currency = undefined): any {
        throw new NotSupported (this.id + ' parseDepositWithdrawFee() is not supported yet');
    }

    depositWithdrawFee (info): any {
        return {
            'info': info,
            'withdraw': {
                'fee': undefined,
                'percentage': undefined,
            },
            'deposit': {
                'fee': undefined,
                'percentage': undefined,
            },
            'networks': {},
        };
    }

    assignDefaultDepositWithdrawFees (fee, currency = undefined): any {
        /**
         * @ignore
         * @method
         * @description Takes a depositWithdrawFee structure and assigns the default values for withdraw and deposit
         * @param {object} fee A deposit withdraw fee structure
         * @param {object} currency A currency structure, the response from this.currency ()
         * @returns {object} A deposit withdraw fee structure
         */
        const networkKeys = Object.keys (fee['networks']);
        const numNetworks = networkKeys.length;
        if (numNetworks === 1) {
            fee['withdraw'] = fee['networks'][networkKeys[0]]['withdraw'];
            fee['deposit'] = fee['networks'][networkKeys[0]]['deposit'];
            return fee;
        }
        const currencyCode = this.safeString (currency, 'code');
        for (let i = 0; i < numNetworks; i++) {
            const network = networkKeys[i];
            if (network === currencyCode) {
                fee['withdraw'] = fee['networks'][networkKeys[i]]['withdraw'];
                fee['deposit'] = fee['networks'][networkKeys[i]]['deposit'];
            }
        }
        return fee;
    }

    parseIncome (info, market: Market = undefined) {
        throw new NotSupported (this.id + ' parseIncome () is not supported yet');
    }

    parseIncomes (incomes, market = undefined, since: Int = undefined, limit: Int = undefined): FundingHistory[] {
        /**
         * @ignore
         * @method
         * @description parses funding fee info from exchange response
         * @param {object[]} incomes each item describes once instance of currency being received or paid
         * @param {object} market ccxt market
         * @param {int} [since] when defined, the response items are filtered to only include items after this timestamp
         * @param {int} [limit] limits the number of items in the response
         * @returns {object[]} an array of [funding history structures]{@link https://docs.ccxt.com/#/?id=funding-history-structure}
         */
        const result = [];
        for (let i = 0; i < incomes.length; i++) {
            const entry = incomes[i];
            const parsed = this.parseIncome (entry, market);
            result.push (parsed);
        }
        const sorted = this.sortBy (result, 'timestamp');
        return this.filterBySinceLimit (sorted, since, limit);
    }

    getMarketFromSymbols (symbols: string[] = undefined) {
        if (symbols === undefined) {
            return undefined;
        }
        const firstMarket = this.safeString (symbols, 0);
        const market = this.market (firstMarket);
        return market;
    }

    parseWsOHLCVs (ohlcvs: object[], market: any = undefined, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined) {
        const results = [];
        for (let i = 0; i < ohlcvs.length; i++) {
            results.push (this.parseWsOHLCV (ohlcvs[i], market));
        }
        return results;
    }

    async fetchTransactions (code: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<any> {
        /**
         * @method
         * @name exchange#fetchTransactions
         * @deprecated
         * @description *DEPRECATED* use fetchDepositsWithdrawals instead
         * @param {string} code unified currency code for the currency of the deposit/withdrawals, default is undefined
         * @param {int} [since] timestamp in ms of the earliest deposit/withdrawal, default is undefined
         * @param {int} [limit] max number of deposit/withdrawals to return, default is undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        if (this.has['fetchDepositsWithdrawals']) {
            return await this.fetchDepositsWithdrawals (code, since, limit, params);
        } else {
            throw new NotSupported (this.id + ' fetchTransactions () is not supported yet');
        }
    }

    filterByArrayPositions (objects, key: IndexType, values = undefined, indexed = true): Position[] {
        /**
         * @ignore
         * @method
         * @description Typed wrapper for filterByArray that returns a list of positions
         */
        return this.filterByArray (objects, key, values, indexed) as Position[];
    }

    filterByArrayTickers (objects, key: IndexType, values = undefined, indexed = true): Dictionary<Ticker> {
        /**
         * @ignore
         * @method
         * @description Typed wrapper for filterByArray that returns a dictionary of tickers
         */
        return this.filterByArray (objects, key, values, indexed) as Dictionary<Ticker>;
    }

    resolvePromiseIfMessagehashMatches (client, prefix: string, symbol: string, data) {
        const messageHashes = this.findMessageHashes (client, prefix);
        for (let i = 0; i < messageHashes.length; i++) {
            const messageHash = messageHashes[i];
            const parts = messageHash.split ('::');
            const symbolsString = parts[1];
            const symbols = symbolsString.split (',');
            if (this.inArray (symbol, symbols)) {
                client.resolve (data, messageHash);
            }
        }
    }

    resolveMultipleOHLCV (client, prefix: string, symbol: string, timeframe: string, data) {
        const messageHashes = this.findMessageHashes (client, 'multipleOHLCV::');
        for (let i = 0; i < messageHashes.length; i++) {
            const messageHash = messageHashes[i];
            const parts = messageHash.split ('::');
            const symbolsAndTimeframes = parts[1];
            const splitted = symbolsAndTimeframes.split (',');
            const id = symbol + '#' + timeframe;
            if (this.inArray (id, splitted)) {
                client.resolve ([ symbol, timeframe, data ], messageHash);
            }
        }
    }

    createOHLCVObject (symbol: string, timeframe: string, data): Dictionary<Dictionary<OHLCV[]>> {
        const res = {};
        res[symbol] = {};
        res[symbol][timeframe] = data;
        return res;
    }

    handleMaxEntriesPerRequestAndParams (method: string, maxEntriesPerRequest: Int = undefined, params = {}): [Int, any] {
        let newMaxEntriesPerRequest = undefined;
        [ newMaxEntriesPerRequest, params ] = this.handleOptionAndParams (params, method, 'maxEntriesPerRequest');
        if ((newMaxEntriesPerRequest !== undefined) && (newMaxEntriesPerRequest !== maxEntriesPerRequest)) {
            maxEntriesPerRequest = newMaxEntriesPerRequest;
        }
        if (maxEntriesPerRequest === undefined) {
            maxEntriesPerRequest = 1000; // default to 1000
        }
        return [ maxEntriesPerRequest, params ];
    }

    async fetchPaginatedCallDynamic (method: string, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, params = {}, maxEntriesPerRequest: Int = undefined): Promise<any> {
        let maxCalls = undefined;
        [ maxCalls, params ] = this.handleOptionAndParams (params, method, 'paginationCalls', 10);
        let maxRetries = undefined;
        [ maxRetries, params ] = this.handleOptionAndParams (params, method, 'maxRetries', 3);
        let paginationDirection = undefined;
        [ paginationDirection, params ] = this.handleOptionAndParams (params, method, 'paginationDirection', 'backward');
        let paginationTimestamp = undefined;
        let calls = 0;
        let result = [];
        let errors = 0;
        const until = this.safeInteger2 (params, 'untill', 'till'); // do not omit it from params here
        [ maxEntriesPerRequest, params ] = this.handleMaxEntriesPerRequestAndParams (method, maxEntriesPerRequest, params);
        if ((paginationDirection === 'forward')) {
            if (since === undefined) {
                throw new ArgumentsRequired (this.id + ' pagination requires a since argument when paginationDirection set to forward');
            }
            paginationTimestamp = since;
        }
        while ((calls < maxCalls)) {
            calls += 1;
            try {
                if (paginationDirection === 'backward') {
                    // do it backwards, starting from the last
                    // UNTIL filtering is required in order to work
                    if (paginationTimestamp !== undefined) {
                        params['until'] = paginationTimestamp - 1;
                    }
                    const response = await this[method] (symbol, undefined, maxEntriesPerRequest, params);
                    const responseLength = response.length;
                    if (this.verbose) {
                        this.log ('Dynamic pagination call', calls, 'method', method, 'response length', responseLength, 'timestamp', paginationTimestamp);
                    }
                    if (responseLength === 0) {
                        break;
                    }
                    errors = 0;
                    result = this.arrayConcat (result, response);
                    const firstElement = this.safeValue (response, 0);
                    paginationTimestamp = this.safeInteger2 (firstElement, 'timestamp', 0);
                    if ((since !== undefined) && (paginationTimestamp <= since)) {
                        break;
                    }
                } else {
                    // do it forwards, starting from the since
                    const response = await this[method] (symbol, paginationTimestamp, maxEntriesPerRequest, params);
                    const responseLength = response.length;
                    if (this.verbose) {
                        this.log ('Dynamic pagination call', calls, 'method', method, 'response length', responseLength, 'timestamp', paginationTimestamp);
                    }
                    if (responseLength === 0) {
                        break;
                    }
                    errors = 0;
                    result = this.arrayConcat (result, response);
                    const last = this.safeValue (response, responseLength - 1);
                    paginationTimestamp = this.safeInteger (last, 'timestamp') - 1;
                    if ((until !== undefined) && (paginationTimestamp >= until)) {
                        break;
                    }
                }
            } catch (e) {
                errors += 1;
                if (errors > maxRetries) {
                    throw e;
                }
            }
        }
        const uniqueResults = this.removeRepeatedElementsFromArray (result);
        const key = (method === 'fetchOHLCV') ? 0 : 'timestamp';
        return this.filterBySinceLimit (uniqueResults, since, limit, key);
    }

    async safeDeterministicCall (method: string, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, timeframe: string = undefined, params = {}) {
        let maxRetries = undefined;
        [ maxRetries, params ] = this.handleOptionAndParams (params, method, 'maxRetries', 3);
        let errors = 0;
        try {
            if (timeframe && method !== 'fetchFundingRateHistory') {
                return await this[method] (symbol, timeframe, since, limit, params);
            } else {
                return await this[method] (symbol, since, limit, params);
            }
        } catch (e) {
            if (e instanceof RateLimitExceeded) {
                throw e; // if we are rate limited, we should not retry and fail fast
            }
            errors += 1;
            if (errors > maxRetries) {
                throw e;
            }
        }
    }

    async fetchPaginatedCallDeterministic (method: string, symbol: string = undefined, since: Int = undefined, limit: Int = undefined, timeframe: string = undefined, params = {}, maxEntriesPerRequest = undefined): Promise<any> {
        let maxCalls = undefined;
        [ maxCalls, params ] = this.handleOptionAndParams (params, method, 'paginationCalls', 10);
        [ maxEntriesPerRequest, params ] = this.handleMaxEntriesPerRequestAndParams (method, maxEntriesPerRequest, params);
        const current = this.milliseconds ();
        const tasks = [];
        const time = this.parseTimeframe (timeframe) * 1000;
        const step = time * maxEntriesPerRequest;
        let currentSince = current - (maxCalls * step) - 1;
        if (since !== undefined) {
            currentSince = Math.max (currentSince, since);
        }
        const until = this.safeInteger2 (params, 'until', 'till'); // do not omit it here
        if (until !== undefined) {
            const requiredCalls = Math.ceil ((until - since) / step);
            if (requiredCalls > maxCalls) {
                throw new BadRequest (this.id + ' the number of required calls is greater than the max number of calls allowed, either increase the paginationCalls or decrease the since-until gap. Current paginationCalls limit is ' + maxCalls.toString () + ' required calls is ' + requiredCalls.toString ());
            }
        }
        for (let i = 0; i < maxCalls; i++) {
            if ((until !== undefined) && (currentSince >= until)) {
                break;
            }
            tasks.push (this.safeDeterministicCall (method, symbol, currentSince, maxEntriesPerRequest, timeframe, params));
            currentSince = this.sum (currentSince, step) - 1;
        }
        const results = await Promise.all (tasks);
        let result = [];
        for (let i = 0; i < results.length; i++) {
            result = this.arrayConcat (result, results[i]);
        }
        const uniqueResults = this.removeRepeatedElementsFromArray (result) as any;
        const key = (method === 'fetchOHLCV') ? 0 : 'timestamp';
        return this.filterBySinceLimit (uniqueResults, since, limit, key);
    }

    async fetchPaginatedCallCursor (method: string, symbol: string = undefined, since = undefined, limit = undefined, params = {}, cursorReceived = undefined, cursorSent = undefined, cursorIncrement = undefined, maxEntriesPerRequest = undefined): Promise<any> {
        let maxCalls = undefined;
        [ maxCalls, params ] = this.handleOptionAndParams (params, method, 'paginationCalls', 10);
        let maxRetries = undefined;
        [ maxRetries, params ] = this.handleOptionAndParams (params, method, 'maxRetries', 3);
        [ maxEntriesPerRequest, params ] = this.handleMaxEntriesPerRequestAndParams (method, maxEntriesPerRequest, params);
        let cursorValue = undefined;
        let i = 0;
        let errors = 0;
        let result = [];
        while (i < maxCalls) {
            try {
                if (cursorValue !== undefined) {
                    if (cursorIncrement !== undefined) {
                        cursorValue = this.parseToInt (cursorValue) + cursorIncrement;
                    }
                    params[cursorSent] = cursorValue;
                }
                let response = undefined;
                if (method === 'fetchAccounts') {
                    response = await this[method] (params);
                } else {
                    response = await this[method] (symbol, since, maxEntriesPerRequest, params);
                }
                errors = 0;
                const responseLength = response.length;
                if (this.verbose) {
                    this.log ('Cursor pagination call', i + 1, 'method', method, 'response length', responseLength, 'cursor', cursorValue);
                }
                if (responseLength === 0) {
                    break;
                }
                result = this.arrayConcat (result, response);
                const last = this.safeValue (response, responseLength - 1);
                cursorValue = this.safeValue (last['info'], cursorReceived);
                if (cursorValue === undefined) {
                    break;
                }
                const lastTimestamp = this.safeInteger (last, 'timestamp');
                if (lastTimestamp !== undefined && lastTimestamp < since) {
                    break;
                }
            } catch (e) {
                errors += 1;
                if (errors > maxRetries) {
                    throw e;
                }
            }
            i += 1;
        }
        const sorted = this.sortCursorPaginatedResult (result);
        const key = (method === 'fetchOHLCV') ? 0 : 'timestamp';
        return this.filterBySinceLimit (sorted, since, limit, key);
    }

    async fetchPaginatedCallIncremental (method: string, symbol: string = undefined, since = undefined, limit = undefined, params = {}, pageKey = undefined, maxEntriesPerRequest = undefined): Promise<any> {
        let maxCalls = undefined;
        [ maxCalls, params ] = this.handleOptionAndParams (params, method, 'paginationCalls', 10);
        let maxRetries = undefined;
        [ maxRetries, params ] = this.handleOptionAndParams (params, method, 'maxRetries', 3);
        [ maxEntriesPerRequest, params ] = this.handleMaxEntriesPerRequestAndParams (method, maxEntriesPerRequest, params);
        let i = 0;
        let errors = 0;
        let result = [];
        while (i < maxCalls) {
            try {
                params[pageKey] = i + 1;
                const response = await this[method] (symbol, since, maxEntriesPerRequest, params);
                errors = 0;
                const responseLength = response.length;
                if (this.verbose) {
                    this.log ('Incremental pagination call', i + 1, 'method', method, 'response length', responseLength);
                }
                if (responseLength === 0) {
                    break;
                }
                result = this.arrayConcat (result, response);
            } catch (e) {
                errors += 1;
                if (errors > maxRetries) {
                    throw e;
                }
            }
            i += 1;
        }
        const sorted = this.sortCursorPaginatedResult (result);
        const key = (method === 'fetchOHLCV') ? 0 : 'timestamp';
        return this.filterBySinceLimit (sorted, since, limit, key);
    }

    sortCursorPaginatedResult (result) {
        const first = this.safeValue (result, 0);
        if (first !== undefined) {
            if ('timestamp' in first) {
                return this.sortBy (result, 'timestamp', true);
            }
            if ('id' in first) {
                return this.sortBy (result, 'id', true);
            }
        }
        return result;
    }

    removeRepeatedElementsFromArray (input) {
        const uniqueResult = {};
        for (let i = 0; i < input.length; i++) {
            const entry = input[i];
            const id = this.safeString (entry, 'id');
            if (id !== undefined) {
                if (this.safeString (uniqueResult, id) === undefined) {
                    uniqueResult[id] = entry;
                }
            } else {
                const timestamp = this.safeInteger2 (entry, 'timestamp', 0);
                if (timestamp !== undefined) {
                    if (this.safeString (uniqueResult, timestamp) === undefined) {
                        uniqueResult[timestamp] = entry;
                    }
                }
            }
        }
        const values = Object.values (uniqueResult);
        const valuesLength = values.length;
        if (valuesLength > 0) {
            return values as any;
        }
        return input;
    }

    handleUntilOption (key, request, params, multiplier = 1) {
        const until = this.safeValue2 (params, 'until', 'till');
        if (until !== undefined) {
            request[key] = this.parseToInt (until * multiplier);
            params = this.omit (params, [ 'until', 'till' ]);
        }
        return [ request, params ];
    }

    safeOpenInterest (interest, market: Market = undefined): OpenInterest {
        return this.extend (interest, {
            'symbol': this.safeString (market, 'symbol'),
            'baseVolume': this.safeNumber (interest, 'baseVolume'), // deprecated
            'quoteVolume': this.safeNumber (interest, 'quoteVolume'), // deprecated
            'openInterestAmount': this.safeNumber (interest, 'openInterestAmount'),
            'openInterestValue': this.safeNumber (interest, 'openInterestValue'),
            'timestamp': this.safeInteger (interest, 'timestamp'),
            'datetime': this.safeString (interest, 'datetime'),
            'info': this.safeValue (interest, 'info'),
        });
    }

    parseLiquidation (liquidation, market: Market = undefined): Liquidation {
        throw new NotSupported (this.id + ' parseLiquidation () is not supported yet');
    }

    parseLiquidations (liquidations, market = undefined, since: Int = undefined, limit: Int = undefined): Liquidation[] {
        /**
         * @ignore
         * @method
         * @description parses liquidation info from the exchange response
         * @param {object[]} liquidations each item describes an instance of a liquidation event
         * @param {object} market ccxt market
         * @param {int} [since] when defined, the response items are filtered to only include items after this timestamp
         * @param {int} [limit] limits the number of items in the response
         * @returns {object[]} an array of [liquidation structures]{@link https://docs.ccxt.com/#/?id=liquidation-structure}
         */
        const result = [];
        for (let i = 0; i < liquidations.length; i++) {
            const entry = liquidations[i];
            const parsed = this.parseLiquidation (entry, market);
            result.push (parsed);
        }
        const sorted = this.sortBy (result, 'timestamp');
        const symbol = this.safeString (market, 'symbol');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit);
    }

    parseGreeks (greeks, market: Market = undefined): Greeks {
        throw new NotSupported (this.id + ' parseGreeks () is not supported yet');
    }
}

export {
    Exchange,
};

