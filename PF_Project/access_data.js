require('dotenv').config();
const { MongoClient } = require('mongodb');
const axios = require('axios');

  async function fetchStockByTickerAsArray(ticker) {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
      await client.connect();
      const database = client.db('stockData');
      const collection = database.collection('stocks');
  
      const stock = await collection.findOne({ symbol: ticker });
      
      // If stock data is found, return it as an array
      if (stock) {
        return [stock];  // Return stock data wrapped in an array
      } else {
        return [];  // Return an empty array if no stock is found
      }
    } catch (error) {
      console.error(`Error fetching stock ${ticker}:`, error);
      return [];  // Return an empty array in case of an error
    } finally {
      await client.close();
    }
  }

  async function print_info(ticker, dateKey = 'all', specific_price = 'all') {
    const array = await fetchStockByTickerAsArray(ticker);
    
    if (array.length > 0) {
      const stockData = array[0].data;  // Access the first stock object, see if it exista

      console.log("STOCK: ", ticker)
      if(dateKey == 'all'){
        if(specific_price == 'all'){
            console.log('Stock Data:', stockData);
        }
        else if(specific_price == 'open'){
            console.log('Stock Data: Opening Prices')
            for(var i in stockData){
                console.log(i, stockData[i]['1. open'])
            }
        }
        else if(specific_price == 'high'){
            console.log('Stock Data: High Prices')
            for(var i in stockData){
                console.log(i, stockData[i]['2. high'])
            }
        }
        else if(specific_price == 'low'){
            console.log('Stock Data: Low Prices')
            for(var i in stockData){
                console.log(i, stockData[i]['3. low'])
            }
        }
        else if(specific_price == 'close'){
            console.log('Stock Data: Closing Prices')
            for(var i in stockData){
                console.log(i, stockData[i]['4. close'])
            }
        }
        else if(specific_price == 'volume'){
            console.log('Stock Data: Volume')
            for(var i in stockData){
                console.log(i, stockData[i]['5. volume'])
            }
        }
        else{
            console.log("No data for specified price type")
        }
        

      }
      else {
        if (stockData[dateKey]) {
            if(specific_price == 'all'){
                console.log(`Data for ${dateKey}:`, stockData[dateKey]);
            }
            else if(specific_price == 'open'){
                console.log(`Opening Price for ${dateKey}:`, stockData[dateKey]['1. open'])
            }
            else if(specific_price == 'high'){
                console.log(`High Price for ${dateKey}:`, stockData[dateKey]['2. high'])
            }
            else if(specific_price == 'low'){
                console.log(`Low Price for ${dateKey}:`, stockData[dateKey]['3. low'])
            }
            else if(specific_price == 'close'){
                console.log(`Closing Price for ${dateKey}:`, stockData[dateKey]['4. close'])
            }
            else if(specific_price == 'volume'){
                console.log(`Volume for ${dateKey}:`, stockData[dateKey]['5. volume'])
            }
            else{
                console.log("No data for specified price type")
            }
        } 
        else {
            console.log(`No data found for ${dateKey}.`);
        }
    }}
    else {
        console.log('No data found for the given ticker.');
    }
}
  
  //Call the print_info function
  //accepts arguments (ticker, dateKey, specific_price_type)
  //dateKey = 'all' (all dates) if not specified, must be written in form 'YYYY-MM-DD'
  //specific_price_type = 'all' (all prices types) if not specified, can be 'open', 'high', 'low', 'close', or 'volume'

//print_info('ADBE','2024-08-22', 'high');
//print_info('GOOGL', '2024-05-29', 'close')
//print_info('AAPL', '2024-07-10', 'low')


async function analytics(ticker, dateKey = 'all', specific_price, window_size) {
    final_array = []
    const array = await fetchStockByTickerAsArray(ticker);
    
    if (array.length > 0) {
      const stockData = array[0].data;  // Access the first stock object, see if it exists
      console.log("STOCK: ", ticker)
      
      function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
      }
      if(dateKey == 'all'){
        if(specific_price == 'open'){
            for(var i in stockData){
                var i_num = Number(formatDate(i))
                final_array.push([i_num, Number(stockData[i]['1. open'])])
            }
        }
        else if(specific_price == 'high'){
            for(var i in stockData){
                var i_num = Number(formatDate(i))
                final_array.push([i_num, Number(stockData[i]['2. high'])])
            }
        }
        else if(specific_price == 'low'){
            for(var i in stockData){
                var i_num = Number(formatDate(i))
                final_array.push([i_num, Number(stockData[i]['3. low'])])
            }
        }
        else if(specific_price == 'close'){
            for(var i in stockData){
                var i_num = Number(formatDate(i))
                final_array.push([i_num, Number(stockData[i]['4. close'])])
            }
        }
        else if(specific_price == 'volume'){
            for(var i in stockData){
                var i_num = Number(formatDate(i))
                final_array.push(i_num[Number(stockData[i]['5. volume'])])
            }
        }
        else{
            console.log("No data for specified price type")
        }
        

      }
      else {
        if(dateKey.length == 1){
            if (stockData[dateKey]) {
                if(specific_price == 'all'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey])]);
                }
                else if(specific_price == 'open'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey]['1. open'])])
                }
                else if(specific_price == 'high'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey]['2. high'])])
                }
                else if(specific_price == 'low'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey]['3. low'])])
                }
                else if(specific_price == 'close'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey]['4. close'])])
                }
                else if(specific_price == 'volume'){
                    final_array.push([Number(formatDate(dateKey[0])), Number(stockData[dateKey]['5. volume'])])
                }
                else{
                    console.log("No data for specified price type")
                }
        }}
        else if(dateKey.length == 2){
        var startdate = Number(formatDate(dateKey[0]));
        var enddate = Number(formatDate(dateKey[1]));
        //console.log(startdate)
            for(var i in stockData){
                var i_num = Number(formatDate(i));
                //console.log(i_num)
                if(i_num >= startdate && i_num <= enddate){
                    if(specific_price == 'open'){
                    final_array.push([i_num, Number(stockData[i]['1. open'])])
                    }
                    else if(specific_price == 'high'){
                    final_array.push([i_num, Number(stockData[i]['2. high'])])
                    }
                    else if(specific_price == 'low'){
                    final_array.push([i_num, Number(stockData[i]['3. low'])])
                    }
                    else if(specific_price == 'close'){
                    final_array.push([i_num, Number(stockData[i]['4. close'])])
                    }
                    else if(specific_price == 'volume'){
                    final_array.push([i_num, Number(stockData[i]['5. volume'])])
                    }
                    else{
                    console.log("No data for specified price type")
            }}
        } }
        else{
            console.log("invalid dateKey")
        }
    }
}
    else {
        console.log('No data found for the given ticker.');
    }
    console.log(final_array)
    //NOW HAVE AN ARRAY OF DESIRED VALUES WITHIN GIVEN DATE RANGE
    //EACH ENTRY [DATE(AS A NUMBER), PRICE VALUE]

    function maximum(array) {
        var current_max = 0
        var max_w_date = []
        for(i in array) {
            if(array[i][1] > current_max){
                var current_max = array[i][1]
                var max_w_date = array[i]
        }
            else {}
    }
        console.log("MAXIMUM: ", max_w_date)
    
    
    }

    function minimum(array) {
        var current_min = 1000000
        var min_w_date = []
        for(i in array) {
            if(array[i][1] < current_min){
                var current_min = array[i][1]
                var min_w_date = array[i]
        }
            else {}
    }
        console.log("MINIMUM: ", min_w_date)
    
    
    }

    function average_and_stdDev(array) {

        let reducerAverage = (accumulator, currentValue, currentIdx, array) => {
            let result = accumulator;
            let previousSum = result.length > 0 ? (result.pop() * currentIdx) : 0;
            result.push(currentValue);
            result.push((previousSum + currentValue) / ++currentIdx);
            return result;
        }
        let reducerStdDev =
            (accumulator, currentValue, currentIdx, array) => {
            let result = accumulator;
            let average = array[array.length-1];
            let previousSumSqr = result.length > 0 ? result.pop() : 0;
            let currentSumSqr = previousSumSqr +((currentIdx < (array.length-1)) ?(currentValue - average)*(currentValue - average) : 0);
            result.push(currentValue);
            (currentIdx < (array.length-1)) ?
            result.push(currentSumSqr) :
            result.push(Math.sqrt(currentSumSqr / (array.length-2)));
            return result;
        }
        var values = array.map(elem => elem[1])
        //console.log(values)

        let values_w_Avg = values.reduce(reducerAverage, []);
        console.log("AVERAGE: ", values_w_Avg[values_w_Avg.length - 1])

        let values_w_StdDev = values_w_Avg.reduce(reducerStdDev, []);
        console.log("STANDARD DEVIATION: ", values_w_StdDev[values_w_StdDev.length - 1])   

    }
    function analytics_for_windows(array, window_size){
        var n_wind = array.length / window_size
        const arrayRange = (start, stop, step) => 
            Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step
        );

        var range = arrayRange(0 ,n_wind - 1,1);

        for(n in range){
        
            var endrange = range[n] * window_size
            var startrange = (range[n]+1)*window_size - 1
            var current_window = array.slice((endrange), ((range[n]+1)*window_size))
            console.log("NEW WINDOW: N = ", n, "; START DATE: ", array[startrange][0], ", END DATE: ", array[endrange][0])

            maximum(current_window)
            minimum(current_window)
            average_and_stdDev(current_window)

        }}





    maximum(final_array)
    minimum(final_array)
    average_and_stdDev(final_array)
    analytics_for_windows(final_array, window_size)











    }

//analytics('NFLX',['2024-08-12', '2024-09-25'], 'high')

analytics('NFLX',['2024-06-10', '2024-09-10'], 'high', 8)

