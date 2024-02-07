import os
import sys

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.append(root)

# ----------------------------------------------------------------------------

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

# ----------------------------------------------------------------------------
# -*- coding: utf-8 -*-

from ccxt.test.base import test_shared_methods  # noqa E402

def test_open_interest(exchange, skipped_properties, method, entry):
    format = {
        'symbol': 'BTC/USDT',
        'openInterestAmount': exchange.parse_number('3544581864.598'),
        'openInterestValue': exchange.parse_number('3544581864.598'),
        'timestamp': 1649373600000,
        'datetime': '2022-04-07T23:20:00.000Z',
        'info': {},
    }
    empty_allowed_for = ['symbol', 'timestamp', 'openInterestAmount', 'openInterestValue', 'datetime']
    test_shared_methods.assert_structure(exchange, skipped_properties, method, entry, format, empty_allowed_for)
    test_shared_methods.assert_symbol(exchange, skipped_properties, method, entry, 'symbol')
    test_shared_methods.assert_timestamp_and_datetime(exchange, skipped_properties, method, entry)
    #
    test_shared_methods.assert_greater(exchange, skipped_properties, method, entry, 'openInterestAmount', '0')
    test_shared_methods.assert_greater(exchange, skipped_properties, method, entry, 'openInterestValue', '0')
