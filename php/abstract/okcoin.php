<?php

namespace ccxt\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class okcoin extends \ccxt\Exchange {
    public function public_get_market_tickers($params = array()) {
        return $this->request('market/tickers', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_market_ticker($params = array()) {
        return $this->request('market/ticker', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_market_books($params = array()) {
        return $this->request('market/books', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function public_get_market_candles($params = array()) {
        return $this->request('market/candles', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function public_get_market_history_candles($params = array()) {
        return $this->request('market/history-candles', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function public_get_market_trades($params = array()) {
        return $this->request('market/trades', 'public', 'GET', $params, null, null, array("cost" => 0.2));
    }
    public function public_get_market_history_trades($params = array()) {
        return $this->request('market/history-trades', 'public', 'GET', $params, null, null, array("cost" => 2));
    }
    public function public_get_market_platform_24_volume($params = array()) {
        return $this->request('market/platform-24-volume', 'public', 'GET', $params, null, null, array("cost" => 10));
    }
    public function public_get_market_open_oracle($params = array()) {
        return $this->request('market/open-oracle', 'public', 'GET', $params, null, null, array("cost" => 50));
    }
    public function public_get_market_exchange_rate($params = array()) {
        return $this->request('market/exchange-rate', 'public', 'GET', $params, null, null, array("cost" => 20));
    }
    public function public_get_public_instruments($params = array()) {
        return $this->request('public/instruments', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function public_get_public_time($params = array()) {
        return $this->request('public/time', 'public', 'GET', $params, null, null, array("cost" => 2));
    }
    public function private_get_trade_order($params = array()) {
        return $this->request('trade/order', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_get_trade_orders_pending($params = array()) {
        return $this->request('trade/orders-pending', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_get_trade_orders_history($params = array()) {
        return $this->request('trade/orders-history', 'private', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function private_get_trade_orders_history_archive($params = array()) {
        return $this->request('trade/orders-history-archive', 'private', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function private_get_trade_fills($params = array()) {
        return $this->request('trade/fills', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_get_trade_fills_history($params = array()) {
        return $this->request('trade/fills-history', 'private', 'GET', $params, null, null, array("cost" => 2.2));
    }
    public function private_get_trade_fills_archive($params = array()) {
        return $this->request('trade/fills-archive', 'private', 'GET', $params, null, null, array("cost" => 2));
    }
    public function private_get_trade_order_algo($params = array()) {
        return $this->request('trade/order-algo', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_trade_orders_algo_pending($params = array()) {
        return $this->request('trade/orders-algo-pending', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_trade_orders_algo_history($params = array()) {
        return $this->request('trade/orders-algo-history', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_otc_rfq_trade($params = array()) {
        return $this->request('otc/rfq/trade', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_otc_rfq_history($params = array()) {
        return $this->request('otc/rfq/history', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_account_balance($params = array()) {
        return $this->request('account/balance', 'private', 'GET', $params, null, null, array("cost" => 2));
    }
    public function private_get_account_bills($params = array()) {
        return $this->request('account/bills', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_account_bills_archive($params = array()) {
        return $this->request('account/bills-archive', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_account_config($params = array()) {
        return $this->request('account/config', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_account_max_size($params = array()) {
        return $this->request('account/max-size', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_account_max_avail_size($params = array()) {
        return $this->request('account/max-avail-size', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_account_trade_fee($params = array()) {
        return $this->request('account/trade-fee', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_account_max_withdrawal($params = array()) {
        return $this->request('account/max-withdrawal', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function private_get_asset_currencies($params = array()) {
        return $this->request('asset/currencies', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_balances($params = array()) {
        return $this->request('asset/balances', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_asset_valuation($params = array()) {
        return $this->request('asset/asset-valuation', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_asset_transfer_state($params = array()) {
        return $this->request('asset/transfer-state', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_asset_bills($params = array()) {
        return $this->request('asset/bills', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_deposit_lightning($params = array()) {
        return $this->request('asset/deposit-lightning', 'private', 'GET', $params, null, null, array("cost" => 5));
    }
    public function private_get_asset_deposit_address($params = array()) {
        return $this->request('asset/deposit-address', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_deposit_history($params = array()) {
        return $this->request('asset/deposit-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_withdrawal_history($params = array()) {
        return $this->request('asset/withdrawal-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_asset_deposit_withdraw_status($params = array()) {
        return $this->request('asset/deposit-withdraw-status', 'private', 'GET', $params, null, null, array("cost" => 20));
    }
    public function private_get_fiat_deposit_history($params = array()) {
        return $this->request('fiat/deposit-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_fiat_withdraw_history($params = array()) {
        return $this->request('fiat-withdraw-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_fiat_channel($params = array()) {
        return $this->request('fiat-channel', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_get_users_subaccount_list($params = array()) {
        return $this->request('users/subaccount/list', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_users_subaccount_apikey($params = array()) {
        return $this->request('users/subaccount/apiKey', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_account_subaccount_balances($params = array()) {
        return $this->request('account/subaccount/balances', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_asset_subaccount_balances($params = array()) {
        return $this->request('asset/subaccount/balances', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_get_asset_subaccount_bills($params = array()) {
        return $this->request('asset/subaccount/bills', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function private_post_trade_order($params = array()) {
        return $this->request('trade/order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_post_trade_batch_orders($params = array()) {
        return $this->request('trade/batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.06666666666666667));
    }
    public function private_post_trade_cancel_order($params = array()) {
        return $this->request('trade/cancel-order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_post_trade_cancel_batch_orders($params = array()) {
        return $this->request('trade/cancel-batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.06666666666666667));
    }
    public function private_post_trade_amend_order($params = array()) {
        return $this->request('trade/amend-order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function private_post_trade_amend_batch_orders($params = array()) {
        return $this->request('trade/amend-batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.006666666666666667));
    }
    public function private_post_trade_order_algo($params = array()) {
        return $this->request('trade/order-algo', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_trade_cancel_algos($params = array()) {
        return $this->request('trade/cancel-algos', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_trade_cancel_advance_algos($params = array()) {
        return $this->request('trade/cancel-advance-algos', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_otc_rfq_quote($params = array()) {
        return $this->request('otc/rfq/quote', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_otc_rfq_trade($params = array()) {
        return $this->request('otc/rfq/trade', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_asset_transfer($params = array()) {
        return $this->request('asset/transfer', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_asset_withdrawal($params = array()) {
        return $this->request('asset/withdrawal', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_asset_withdrawal_lightning($params = array()) {
        return $this->request('asset/withdrawal-lightning', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_asset_withdrawal_cancel($params = array()) {
        return $this->request('asset/withdrawal-cancel', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function private_post_fiat_deposit($params = array()) {
        return $this->request('fiat/deposit', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_post_fiat_cancel_deposit($params = array()) {
        return $this->request('fiat/cancel-deposit', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_post_fiat_withdrawal($params = array()) {
        return $this->request('fiat/withdrawal', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_post_fiat_cancel_withdrawal($params = array()) {
        return $this->request('fiat/cancel-withdrawal', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function private_post_asset_subaccount_transfer($params = array()) {
        return $this->request('asset/subaccount/transfer', 'private', 'POST', $params, null, null, array("cost" => 10));
    }
    public function publicGetMarketTickers($params = array()) {
        return $this->request('market/tickers', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetMarketTicker($params = array()) {
        return $this->request('market/ticker', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetMarketBooks($params = array()) {
        return $this->request('market/books', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function publicGetMarketCandles($params = array()) {
        return $this->request('market/candles', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function publicGetMarketHistoryCandles($params = array()) {
        return $this->request('market/history-candles', 'public', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function publicGetMarketTrades($params = array()) {
        return $this->request('market/trades', 'public', 'GET', $params, null, null, array("cost" => 0.2));
    }
    public function publicGetMarketHistoryTrades($params = array()) {
        return $this->request('market/history-trades', 'public', 'GET', $params, null, null, array("cost" => 2));
    }
    public function publicGetMarketPlatform24Volume($params = array()) {
        return $this->request('market/platform-24-volume', 'public', 'GET', $params, null, null, array("cost" => 10));
    }
    public function publicGetMarketOpenOracle($params = array()) {
        return $this->request('market/open-oracle', 'public', 'GET', $params, null, null, array("cost" => 50));
    }
    public function publicGetMarketExchangeRate($params = array()) {
        return $this->request('market/exchange-rate', 'public', 'GET', $params, null, null, array("cost" => 20));
    }
    public function publicGetPublicInstruments($params = array()) {
        return $this->request('public/instruments', 'public', 'GET', $params, null, null, array("cost" => 1));
    }
    public function publicGetPublicTime($params = array()) {
        return $this->request('public/time', 'public', 'GET', $params, null, null, array("cost" => 2));
    }
    public function privateGetTradeOrder($params = array()) {
        return $this->request('trade/order', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privateGetTradeOrdersPending($params = array()) {
        return $this->request('trade/orders-pending', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privateGetTradeOrdersHistory($params = array()) {
        return $this->request('trade/orders-history', 'private', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function privateGetTradeOrdersHistoryArchive($params = array()) {
        return $this->request('trade/orders-history-archive', 'private', 'GET', $params, null, null, array("cost" => 0.5));
    }
    public function privateGetTradeFills($params = array()) {
        return $this->request('trade/fills', 'private', 'GET', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privateGetTradeFillsHistory($params = array()) {
        return $this->request('trade/fills-history', 'private', 'GET', $params, null, null, array("cost" => 2.2));
    }
    public function privateGetTradeFillsArchive($params = array()) {
        return $this->request('trade/fills-archive', 'private', 'GET', $params, null, null, array("cost" => 2));
    }
    public function privateGetTradeOrderAlgo($params = array()) {
        return $this->request('trade/order-algo', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetTradeOrdersAlgoPending($params = array()) {
        return $this->request('trade/orders-algo-pending', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetTradeOrdersAlgoHistory($params = array()) {
        return $this->request('trade/orders-algo-history', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOtcRfqTrade($params = array()) {
        return $this->request('otc/rfq/trade', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetOtcRfqHistory($params = array()) {
        return $this->request('otc/rfq/history', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAccountBalance($params = array()) {
        return $this->request('account/balance', 'private', 'GET', $params, null, null, array("cost" => 2));
    }
    public function privateGetAccountBills($params = array()) {
        return $this->request('account/bills', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAccountBillsArchive($params = array()) {
        return $this->request('account/bills-archive', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAccountConfig($params = array()) {
        return $this->request('account/config', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAccountMaxSize($params = array()) {
        return $this->request('account/max-size', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAccountMaxAvailSize($params = array()) {
        return $this->request('account/max-avail-size', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAccountTradeFee($params = array()) {
        return $this->request('account/trade-fee', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAccountMaxWithdrawal($params = array()) {
        return $this->request('account/max-withdrawal', 'private', 'GET', $params, null, null, array("cost" => 4));
    }
    public function privateGetAssetCurrencies($params = array()) {
        return $this->request('asset/currencies', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetBalances($params = array()) {
        return $this->request('asset/balances', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetAssetValuation($params = array()) {
        return $this->request('asset/asset-valuation', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetAssetTransferState($params = array()) {
        return $this->request('asset/transfer-state', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetAssetBills($params = array()) {
        return $this->request('asset/bills', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetDepositLightning($params = array()) {
        return $this->request('asset/deposit-lightning', 'private', 'GET', $params, null, null, array("cost" => 5));
    }
    public function privateGetAssetDepositAddress($params = array()) {
        return $this->request('asset/deposit-address', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetDepositHistory($params = array()) {
        return $this->request('asset/deposit-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetWithdrawalHistory($params = array()) {
        return $this->request('asset/withdrawal-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetAssetDepositWithdrawStatus($params = array()) {
        return $this->request('asset/deposit-withdraw-status', 'private', 'GET', $params, null, null, array("cost" => 20));
    }
    public function privateGetFiatDepositHistory($params = array()) {
        return $this->request('fiat/deposit-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetFiatWithdrawHistory($params = array()) {
        return $this->request('fiat-withdraw-history', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetFiatChannel($params = array()) {
        return $this->request('fiat-channel', 'private', 'GET', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privateGetUsersSubaccountList($params = array()) {
        return $this->request('users/subaccount/list', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetUsersSubaccountApiKey($params = array()) {
        return $this->request('users/subaccount/apiKey', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetAccountSubaccountBalances($params = array()) {
        return $this->request('account/subaccount/balances', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetAssetSubaccountBalances($params = array()) {
        return $this->request('asset/subaccount/balances', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privateGetAssetSubaccountBills($params = array()) {
        return $this->request('asset/subaccount/bills', 'private', 'GET', $params, null, null, array("cost" => 10));
    }
    public function privatePostTradeOrder($params = array()) {
        return $this->request('trade/order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privatePostTradeBatchOrders($params = array()) {
        return $this->request('trade/batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.06666666666666667));
    }
    public function privatePostTradeCancelOrder($params = array()) {
        return $this->request('trade/cancel-order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privatePostTradeCancelBatchOrders($params = array()) {
        return $this->request('trade/cancel-batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.06666666666666667));
    }
    public function privatePostTradeAmendOrder($params = array()) {
        return $this->request('trade/amend-order', 'private', 'POST', $params, null, null, array("cost" => 0.3333333333333333));
    }
    public function privatePostTradeAmendBatchOrders($params = array()) {
        return $this->request('trade/amend-batch-orders', 'private', 'POST', $params, null, null, array("cost" => 0.006666666666666667));
    }
    public function privatePostTradeOrderAlgo($params = array()) {
        return $this->request('trade/order-algo', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostTradeCancelAlgos($params = array()) {
        return $this->request('trade/cancel-algos', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostTradeCancelAdvanceAlgos($params = array()) {
        return $this->request('trade/cancel-advance-algos', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostOtcRfqQuote($params = array()) {
        return $this->request('otc/rfq/quote', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostOtcRfqTrade($params = array()) {
        return $this->request('otc/rfq/trade', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostAssetTransfer($params = array()) {
        return $this->request('asset/transfer', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostAssetWithdrawal($params = array()) {
        return $this->request('asset/withdrawal', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostAssetWithdrawalLightning($params = array()) {
        return $this->request('asset/withdrawal-lightning', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostAssetWithdrawalCancel($params = array()) {
        return $this->request('asset/withdrawal-cancel', 'private', 'POST', $params, null, null, array("cost" => 4));
    }
    public function privatePostFiatDeposit($params = array()) {
        return $this->request('fiat/deposit', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privatePostFiatCancelDeposit($params = array()) {
        return $this->request('fiat/cancel-deposit', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privatePostFiatWithdrawal($params = array()) {
        return $this->request('fiat/withdrawal', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privatePostFiatCancelWithdrawal($params = array()) {
        return $this->request('fiat/cancel-withdrawal', 'private', 'POST', $params, null, null, array("cost" => 1.6666666666666667));
    }
    public function privatePostAssetSubaccountTransfer($params = array()) {
        return $this->request('asset/subaccount/transfer', 'private', 'POST', $params, null, null, array("cost" => 10));
    }
}
