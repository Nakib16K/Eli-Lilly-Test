
const canvas = document.getElementById('chart')
const ctx = canvas.getContext('2d')
let stockList


function drawLine (start, end, style) {
  ctx.beginPath()
  ctx.strokeStyle = style || 'black'
  ctx.moveTo(...start)
  ctx.lineTo(...end)
  ctx.stroke()
}

function drawTriangle (apex1, apex2, apex3) {
  ctx.beginPath()
  ctx.moveTo(...apex1)
  ctx.lineTo(...apex2)
  ctx.lineTo(...apex3)
  ctx.fill()
}

function getData(){
  fetch('/stocks')
    .then(res => res.json())
    .then(stocks => {
      stockList = stocks.stockSymbols
      
      console.log('The list of stocks:')
        for (let i = 0; i < stockList.length; i++) {
          console.log((i+1) + '. ' + stockList[i])
          // Fetching data for each stock symbol
          fetch('/stocks/'+ stockList[i])
            .then(response => response.json())
            .then(data => {
              console.log('Stock data for '+ stockList[i] + ':')
              data.forEach(element => {
                if(element!=null){
                  console.log('Value: £' + element.value + ' and Time: ' + (new Date(element.timestamp)))
                }
              });
              drawLineChart(data, stockList[i])
            })
            .catch(error => console.log(error))
        }

      // Hiding the spinner after all data is loaded
      const spinner = document.querySelector('.spinner')
      spinner.style.display = 'none' 
    })
    .catch(error => console.log(error))
}

function drawLineChart(data, stockSymbol) {
  const minValue = Math.min(...data.map(element => element.value));
  const maxValue = Math.max(...data.map(element => element.value));

  const xStep = (canvas.width - 100) / (data.length - 1);
  const yStep = (canvas.height - 100) / (maxValue - minValue);

  // Iterating over each data point
  for (let i = 0; i < data.length - 1; i++) {
    const start = [50 + i * xStep, 550 - (data[i].value - minValue) * yStep];
    const end = [50 + (i + 1) * xStep, 550 - (data[i + 1].value - minValue) * yStep];
    drawLine(start, end, getColorForStockSymbol(stockSymbol));
  }

  // labels for the x and y axes
  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText('Time', canvas.width / 2, canvas.height - 10);
  ctx.fillText('Value', 10, canvas.height / 2);
}

function getColorForStockSymbol(stockSymbol) {
  // Defining a color mapping based on stock symbols
  const colorMap = {
    MSFT: 'red',
    AAPL: 'blue',
    FB: 'green',
    EA: 'orange',
    IBM: 'yellow'
  };
  return colorMap[stockSymbol] || 'black'; 
}

drawLine([50, 50], [50, 550])
drawTriangle([35, 50], [65, 50], [50, 35])

drawLine([50, 550], [950, 550])
drawTriangle([950, 535], [950, 565], [965, 550])

getData()