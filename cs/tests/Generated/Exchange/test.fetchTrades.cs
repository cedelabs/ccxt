using ccxt;
namespace Tests;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class testMainClass : BaseTest
{
    async static public Task testFetchTrades(Exchange exchange, object skippedProperties, object symbol)
    {
        object method = "fetchTrades";
        object trades = await exchange.fetchTrades(symbol);
        assert(((trades is IList<object>) || (trades.GetType().IsGenericType && trades.GetType().GetGenericTypeDefinition().IsAssignableFrom(typeof(List<>)))), add(add(add(add(add(add(exchange.id, " "), method), " "), symbol), " must return an array. "), exchange.json(trades)));
        object now = exchange.milliseconds();
        for (object i = 0; isLessThan(i, getArrayLength(trades)); postFixIncrement(ref i))
        {
            testTrade(exchange, skippedProperties, method, getValue(trades, i), symbol, now);
        }
        testSharedMethods.assertTimestampOrder(exchange, method, symbol, trades);
    }

}