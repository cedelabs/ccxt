<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
use React\Async;
use React\Promise;
include_once PATH_TO_CCXT . '/test/base/test_order_book.php';

function test_fetch_l2_order_book($exchange, $skipped_properties, $symbol) {
    return Async\async(function () use ($exchange, $skipped_properties, $symbol) {
        $method = 'fetchL2OrderBook';
        $order_book = Async\await($exchange->fetch_l2_order_book($symbol));
        test_order_book($exchange, $skipped_properties, $method, $order_book, $symbol);
    }) ();
}
