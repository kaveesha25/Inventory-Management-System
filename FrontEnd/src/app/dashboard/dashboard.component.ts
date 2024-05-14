import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Import Chart.js
declare var Chart: any;

interface Sale {
  Date: string;
  TotalAmount: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css','./sb-admin-2.min.css']
})
export class DashboardComponent implements OnInit{
  @ViewChild('barChartCanvas', { static: true }) barChartCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('lineChartCanvas', { static: true }) lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  productCount!: number;
  productsOutOfStockCount: number = 0;
  productsOverStockedCount: number = 0;
  totalInventoryValue: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // this.createBarChart();
    //this.createLineChart();
    this.loadDataAndCreateChart();
    this.getProductCount();
    this.getProductsOutOfStockCount();

  }

  // createBarChart() {
  //   const canvas = this.barChartCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }

  //   // Sample data for the bar chart
  //   const data = [20, 30, 40, 15, 25];
  //   const labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];

  //   const chartColors = ['#FF5733', '#FFC300', '#36A2EB', '#4BC0C0', '#9966FF'];

  //   const barWidth = 40;
  //   const spacing = 20;
  //   const startingX = 40;
  //   const maxHeight = 250;
  //   const maxValue = Math.max(...data);

  //   for (let i = 0; i < data.length; i++) {
  //     const barHeight = (data[i] / maxValue) * maxHeight;

  //     ctx.fillStyle = chartColors[i];
  //     ctx.fillRect(startingX + (i * (barWidth + spacing)), canvas.height - barHeight, barWidth, barHeight);

  //     // Display labels
  //     ctx.fillStyle = '#000';
  //     ctx.fillText(labels[i], startingX + (i * (barWidth + spacing)) + 10, canvas.height - 10);
  //   }
  // }


  // createLineChart() {
  //   const canvas = this.lineChartCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }

  //   // Sample data for the line chart
  //   const data = [10, 30, 15, 30, 25, 20];
  //   const labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5', 'Label 6'];

  //   const chartColors = '#FF5733';

  //   const lineWidth = 2;
  //   const startingX = 40;
  //   const maxHeight = 250;
  //   const maxValue = Math.max(...data);

  //   ctx.beginPath();
  //   ctx.moveTo(startingX, canvas.height - (data[0] / maxValue) * maxHeight);

  //   for (let i = 1; i < data.length; i++) {
  //     const x = startingX + (i * 60);
  //     const y = canvas.height - (data[i] / maxValue) * maxHeight;

  //     ctx.lineTo(x, y);
  //   }

  //   ctx.lineWidth = lineWidth;
  //   ctx.strokeStyle = chartColors;
  //   ctx.stroke();

  //   // Display labels
  //   ctx.fillStyle = '#000';
  //   for (let i = 0; i < labels.length; i++) {
  //     const x = startingX + (i * 60);
  //     const y = canvas.height - 10;

  //     ctx.fillText(labels[i], x, y);
  //   }
  // }

  // loadDataAndCreateChart() {
  //   const canvas = this.lineChartCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }

  //   // Fetch data from API
  //   this.http.get<Sale[]>('http://localhost:3000/salesdata')
  //     .subscribe((response) => {
  //       // Extract sales data and labels from the API response
  //       const salesData = response.map(sale => sale.TotalAmount);
  //       const labels = response.map(sale => sale.Date);

  //       // Parse the dates into JavaScript Date objects
  //       const parsedDates = labels.map((dateStr) => new Date(dateStr));

  //       // Convert salesData to integers
  //       const salesValues = salesData.map((amount) => {
  //         const numStr = amount.replace('Rs. ', '').replace(',', '');
  //         return parseInt(numStr, 10);
  //       });

  //       console.log(salesData)
  //       console.log(labels)
  //       console.log(salesValues)
  //       console.log(parsedDates)

  //       // Calculate max value of sales for scaling the chart
  //       const maxValue = Math.max(...salesValues);
  //       console.log(maxValue)

  //       // Set canvas dimensions
  //       canvas.width = 3900;
  //       canvas.height = 900;
  //       const startingX = 50;
  //       const maxHeight = 300;
  //       const barWidth = 20;
  //       const spacing = 30;

  //       // Draw the axes
  //       ctx.beginPath();
  //       ctx.moveTo(startingX, canvas.height - maxHeight);
  //       ctx.lineTo(startingX, canvas.height);
  //       ctx.lineTo(startingX + (barWidth + spacing) * salesData.length, canvas.height);
  //       ctx.stroke();

  //       // Draw the bars and labels
  //       for (let i = 0; i < salesData.length; i++) {
  //         const x = startingX + i * (barWidth + spacing);
  //         const barHeight = (salesValues[i] / maxValue) * maxHeight;
  //         const y = canvas.height - barHeight;

  //         ctx.fillStyle = 'blue';
  //         ctx.fillRect(x, y, barWidth, barHeight);

  //         const dateStr = parsedDates[i].toLocaleDateString();
  //         ctx.fillStyle = 'black';
  //         ctx.font = '12px Arial';
  //         ctx.fillText(dateStr, x, canvas.height - 10);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }


  // loadDataAndCreateChart() {
  //   const canvas = this.lineChartCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');
  
  //   if (!ctx) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }
  
  //   // Fetch data from API
  //   this.http.get<Sale[]>('http://localhost:3000/salesdata')
  //     .subscribe(
  //       (response) => {
  //         // Extract sales data and labels from the API response
  //         const salesData = response.map(sale => sale['TotalAmount']);
  //         const labels = response.map(sale => sale['Date']);
  
  //         // Parse the dates into JavaScript Date objects
  //         const parsedDates = labels.map((dateStr) => new Date(dateStr));
  
  //         // Convert salesData to integers
  //         const salesValues = salesData.map((amount) => {
  //           const numStr = amount.replace('Rs. ', '').replace(',', '');
  //           return parseInt(numStr, 10);
  //         });
  
  //         // Set canvas dimensions
  //         canvas.width = 800;
  //         canvas.height = 400;
  
  //         // Calculate max value of sales for scaling the chart
  //         const maxValue = Math.max(...salesValues);
  
  //         // Calculate chart properties
  //         const startingX = 50;
  //         const startingY = 50;
  //         const chartWidth = canvas.width - 2 * startingX;
  //         const chartHeight = canvas.height - 2 * startingY;
  
  //         // Draw the axes
  //         ctx.beginPath();
  //         ctx.moveTo(startingX, canvas.height - startingY);
  //         ctx.lineTo(startingX, startingY);
  //         ctx.lineTo(canvas.width - startingX, canvas.height - startingY);
  //         ctx.stroke();
  
  //         // Draw the line chart
  //         ctx.beginPath();
  //         ctx.moveTo(startingX, canvas.height - startingY);
  
  //         for (let i = 0; i < salesValues.length; i++) {
  //           const x = startingX + (i / (salesValues.length - 1)) * chartWidth;
  //           const y = canvas.height - startingY - (salesValues[i] / maxValue) * chartHeight;
  //           ctx.lineTo(x, y);
  //         }
  
  //         ctx.lineWidth = 2;
  //         ctx.strokeStyle = 'blue';
  //         ctx.stroke();
  
  //         // Display labels
  //         ctx.fillStyle = 'black';
  //         ctx.font = '12px Arial';
  //         for (let i = 0; i < parsedDates.length; i++) {
  //           const x = startingX + (i / (parsedDates.length - 1)) * chartWidth;
  //           const y = canvas.height - 10;
  //           const dateStr = parsedDates[i].toLocaleDateString();
  //           ctx.fillText(dateStr, x, y);
  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching data:', error);
  //       }
  //     );
  // }




  // loadDataAndCreateChart() {
  //   const canvas = this.lineChartCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');

  //   if (!ctx) {
  //     console.error('Could not get 2D context for canvas.');
  //     return;
  //   }

  //   // Fetch data from API
  //   this.http.get<Sale[]>('http://localhost:3000/salesdata')
  //     .subscribe((response) => {
  //       // Extract sales data and labels from the API response
  //       const salesData = response.map(sale => sale.TotalAmount);
  //       const labels = response.map(sale => sale.Date);

  //       // Parse the dates into JavaScript Date objects
  //       const parsedDates = labels.map((dateStr) => new Date(dateStr));

  //       // Convert salesData to integers
  //       const salesValues = salesData.map((amount) => {
  //         const numStr = amount.replace('Rs. ', '').replace(',', '');
  //         return parseInt(numStr, 10);
  //       });

  //       // Calculate max value of sales for scaling the chart
  //       const maxValue = Math.max(...salesValues);

  //       // Set canvas dimensions
  //       canvas.width = 900;
  //       canvas.height = 500;
  //       const chartWidth = canvas.width - 80;
  //       const chartHeight = canvas.height - 80;
  //       const startingX = 50;
  //       const startingY = 30;

  //       // Draw the axes
  //       ctx.beginPath();
  //       ctx.moveTo(startingX, canvas.height - startingY);
  //       ctx.lineTo(startingX, startingY);
  //       ctx.lineTo(canvas.width - startingX, startingY);
  //       ctx.stroke();

  //       // Draw the data points and lines
  //       ctx.strokeStyle = 'blue';
  //       ctx.beginPath();
  //       ctx.moveTo(startingX, canvas.height - startingY - (salesValues[0] / maxValue) * chartHeight);
  //       for (let i = 1; i < salesData.length; i++) {
  //         const x = startingX + (i / (salesData.length - 1)) * chartWidth;
  //         const y = canvas.height - startingY - (salesValues[i] / maxValue) * chartHeight;
  //         ctx.lineTo(x, y);
  //         ctx.stroke();
  //         ctx.beginPath();
  //         ctx.arc(x, y, 5, 0, 2 * Math.PI);
  //         ctx.fill();
  //       }
  //       const forecastLength = 975;
  //       const xValues = parsedDates.map((date, i) => i);
  //       const forecastXValues = [];
  //       for (let i = xValues.length; i < xValues.length + forecastLength; i++) {
  //         forecastXValues.push(i);
  //       }
  //       const forecastSalesValues = this.forecastSales(xValues, salesValues, forecastXValues);

  //       // Draw the forecast line
  //       ctx.strokeStyle = 'red';
  //       ctx.beginPath();
  //       ctx.moveTo(startingX + (xValues.length / (salesValues.length - 1)) * chartWidth, canvas.height - startingY - (salesValues[salesValues.length - 1] / maxValue) * chartHeight);
  //       for (let i = 0; i < forecastSalesValues.length; i++) {
  //         const x = startingX + ((xValues.length + i) / (salesData.length - 1)) * chartWidth;
  //         const y = canvas.height - startingY - (forecastSalesValues[i] / maxValue) * chartHeight;
  //         ctx.lineTo(x, y);
  //       }
  //       ctx.stroke();

  //       // Display labels for forecast data points
  //       ctx.fillStyle = 'red';
  //       for (let i = 0; i < forecastXValues.length; i++) {
  //         const x = startingX + ((xValues.length + i) / (salesData.length - 1)) * chartWidth;
  //         const y = canvas.height - 10;
  //         const dateStr = new Date(parsedDates[parsedDates.length - 1].getTime() + (forecastXValues[i] - parsedDates.length + 1) * 24 * 60 * 60 * 1000).toLocaleDateString();
  //         ctx.fillText(dateStr, x, y);
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }

  // // Helper function for linear regression and forecasting
  // forecastSales(x: number[], y: number[], forecastX: number[]): number[] {
  //   const sumX = x.reduce((a, b) => a + b, 0);
  //   const sumY = y.reduce((a, b) => a + b, 0);
  //   const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
  //   const sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);
  //   const n = x.length;

  //   const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  //   const intercept = (sumY - slope * sumX) / n;

  //   return forecastX.map(fx => slope * fx + intercept);
  // }


  loadDataAndCreateChart() {
    const canvas = this.lineChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (!ctx) {
      console.error('Could not get 2D context for canvas.');
      return;
    }
  
    // Fetch data from API
    this.http.get<Sale[]>('http://localhost:3000/salesdata').subscribe(
      (response) => {
        // Extract sales data and labels from the API response
        const salesData = response.map((sale) => sale.TotalAmount);
        const labels = response.map((sale) => sale.Date);
  
        // Parse the dates into JavaScript Date objects
        const parsedDates = labels.map((dateStr) => new Date(dateStr));
  
        // Convert salesData to integers
        const salesValues = salesData.map((amount) => {
          const numStr = amount.replace('Rs. ', '').replace(',', '');
          return parseInt(numStr, 10);
        });
  
        // Calculate the forecasted data points using simple linear regression
        const forecastLength = 15; // Specify the number of data points to forecast
        const [forecastedSalesValues, forecastedDates] = this.forecastSales(
          salesValues,
          parsedDates,
          forecastLength
        );
  
        // Combine original and forecasted sales values and dates
        const combinedSalesValues = [...salesValues, ...forecastedSalesValues];
        const combinedDates = [...parsedDates, ...forecastedDates];
  
        // Calculate max value of sales for scaling the chart
        const maxValue = Math.max(...combinedSalesValues);
  
        // Set canvas dimensions
        canvas.width = 1100;
        canvas.height = 500;
  
        // Clear the canvas before drawing the chart
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw the axes
        const startingX = 70;
        const startingY = canvas.height - 70;
        const chartWidth = canvas.width - 120;
        const chartHeight = canvas.height - 120;
  
        ctx.beginPath();
        ctx.moveTo(startingX, startingY);
        ctx.lineTo(startingX, startingY - chartHeight);
        ctx.lineTo(startingX + chartWidth, startingY - chartHeight);
        ctx.stroke();
  
        // Draw the data points
        const pointRadius = 4;
        const stepSize = chartWidth / (combinedSalesValues.length - 1);
  
        for (let i = 0; i < combinedSalesValues.length; i++) {
          const x = startingX + i * stepSize;
          const y = startingY - (combinedSalesValues[i] / maxValue) * chartHeight;
  
          ctx.beginPath();
          ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
          ctx.fillStyle = i < salesValues.length ? 'blue' : 'red'; // Original data points in blue, forecasted data points in red
          ctx.fill();
        }
  
        // Draw the lines connecting the data points
        ctx.beginPath();
        ctx.moveTo(startingX, startingY - (combinedSalesValues[0] / maxValue) * chartHeight);
  
        for (let i = 1; i < combinedSalesValues.length; i++) {
          const x = startingX + i * stepSize;
          const y = startingY - (combinedSalesValues[i] / maxValue) * chartHeight;
          ctx.lineTo(x, y);
        }
  
        ctx.strokeStyle = 'blue';
        ctx.stroke();
  
        // Display labels
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
  
        // Set the gap between x-axis labels and the graph
        const xAxisLabelGap = 35; // You can adjust this value to control the gap
  
        // Draw the x-axis labels
        for (let i = 0; i < combinedDates.length; i++) {
          const x = startingX + i * stepSize;
          const y = startingY + xAxisLabelGap; // Adjust the y-coordinate to create the gap
  
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(combinedDates[i].toLocaleDateString(), -25, 0);
          ctx.restore();
        }
  
        // Display y-axis labels
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const numYLabels = 5;
        const yStep = maxValue / numYLabels;
  
        for (let i = 0; i <= numYLabels; i++) {
          const label = (yStep * i).toFixed(2);
          const y = startingY - (yStep * i / maxValue) * chartHeight;
          ctx.fillText(label, startingX - 5, y);
        }
  
        // Add text for forecasted and actual values
        const textMargin = 8; // Adjust this value to control the gap between text and graph
  
        // Forecasted text
        ctx.fillStyle = 'red';
        ctx.fillText('Forecasted', startingX + 50, textMargin);
        // Actual Values text
        ctx.fillStyle = 'blue';
        ctx.fillText('Actual Values', startingX + 50, textMargin + 20); // Adding 20px gap from the forecasted text
  
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Function to forecast sales using simple linear regression
  forecastSales(
    salesData: number[],
    dates: Date[],
    forecastLength: number
  ): [number[], Date[]] {
    const forecastedSalesValues: number[] = [];
    const forecastedDates: Date[] = [];

    // Calculate the slope and intercept of the linear regression model
    const n = salesData.length;
    const xSum = dates.reduce((sum, date) => sum + date.getTime(), 0);
    const ySum = salesData.reduce((sum, sales) => sum + sales, 0);
    const xySum = dates.reduce((sum, date, index) => sum + date.getTime() * salesData[index], 0);
    const xSquaredSum = dates.reduce((sum, date) => sum + date.getTime() ** 2, 0);

    const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum ** 2);
    const intercept = (ySum - slope * xSum) / n;

    // Generate forecasted data points
    for (let i = 1; i <= forecastLength; i++) {
      const lastDate = dates[dates.length - 1];
      const nextDate = new Date(lastDate.getTime() + 24 * 60 * 60 * 1000 * i);
      forecastedDates.push(nextDate);

      const forecastedSales = slope * nextDate.getTime() + intercept;
      forecastedSalesValues.push(forecastedSales);
    }

    return [forecastedSalesValues, forecastedDates];
  }

  // Function to get the count of all products
  getProductCount() {
    this.http.get<{ count: number }>('http://localhost:3000/api/products/count')
      .subscribe(
        (response) => {
          // Update the product count in your component
          this.productCount = response.count;
        },
        (error) => {
          console.error('Error fetching product count:', error);
        }
      );
  }


  getProductsOutOfStockCount() {
    this.http.get<any[]>('http://localhost:3000/productsdata').subscribe(
      (response) => {
        // Filter the products with quantity 0
        const outOfStockProducts = response.filter((product) => product.Quantity < 1);
        const productsOverStocked = response.filter((product) => product.Quantity > 50);

        // Calculate the total inventory value by summing the value of all products
        const inventoryValue = response.reduce((acc, product) => {
          const numStr = product.Price.replace('Rs. ', '').replace(',', '');
          const price = parseInt(numStr, 10);
          return acc + price * product.Quantity;
        }, 0);

        // Update the totalInventoryValue property
        this.totalInventoryValue = inventoryValue;

        // Update the productsOutOfStockCount property
        this.productsOutOfStockCount = outOfStockProducts.length;
        this.productsOverStockedCount = productsOverStocked.length;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}