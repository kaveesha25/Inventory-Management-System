import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

interface Item {
  productId: string;
  BatchNumber: string;
  name: string;
  price: number;
  quantity: number;
  amount: number;
}

@Component({
  selector: 'app-sales-entry',
  templateUrl: './sales-entry.component.html',
  styleUrls: ['./sales-entry.component.css']
})

export class SalesEntryComponent {
  billItems: Item[] = [];
  customerName: string = 'Customer Name';
  customerAddress: string = 'Customer Address';
  customerPhone: string = 'Customer Phone';
  billNumber: string = '2020/0023';
  currentDate: Date = new Date();
  totalItems: number = 0;
  totalAmountInWords: string = '';
  billAmount: number = 0;
  discount: number = 0;
  totalAmount: number = 0;
  previousBalance: number = 0;
  grandTotal: number = 0;
  totalPaid: number = 0;
  balanceLeft: number = 0;
  comments: string = '';
  errorMessage: string = '';
  correctMessage: string ='';
  errorTimeout: any; // Variable to store the timeout instance
  UserName: String = ""
  salesCount!: number;

  ngOnInit() {
    this.getProductCount();

  }

  updateAmount(item: Item) {
    item.amount = item.price * item.quantity;
    this.calculateTotals();
  }

  calculateTotals() {
    this.totalItems = this.billItems.reduce((total, item) => total + item.quantity, 0);
    this.billAmount = this.billItems.reduce((total, item) => total + item.amount, 0);
    this.totalAmount = this.billAmount - this.discount;
    this.grandTotal = this.totalAmount + this.previousBalance;
    this.balanceLeft = this.grandTotal - this.totalPaid;
    // Calculate total amount in words here
  }


  productId: string = '';

  constructor(private productService: ProductService, private router: Router, private http: HttpClient) {}

  

  addProduct() {
    this.productService.getProductDetails(this.productId).subscribe(
      (product: any) => {
        const existingItem = this.billItems.find((item) => item.name === product.BatchNumber);

        if (existingItem) {
          // Update quantity and amount if the same product exists
          existingItem.quantity += 1;
          existingItem.amount = existingItem.price * existingItem.quantity;
        } else {
          // Add the product as a new item
          const newItem: Item = {
            productId: product.ProductID,
            BatchNumber: product.BatchNumber,
            name: product.ProductName,
            price: parseFloat(product.Price), // Assuming 'Price' is stored as a string in the database
            quantity: 1,
            amount: parseFloat(product.Price), // Assuming 'Price' is stored as a string in the database
          };
          this.billItems.push(newItem);
        }
        console.log(product.Price)
        this.calculateTotals();
        this.productId = ''; // Clear the input field after adding the product
      },
      (error) => {
        this.errorMessage = error.error.message;
        clearTimeout(this.errorTimeout);
        // Automatically remove the error message after 5 seconds
        this.errorTimeout = setTimeout(() => {
          this.errorMessage = '';
        }, 2000);
      }
    );
  }

  calculateBalance() {
    this.balanceLeft = this.grandTotal - this.totalPaid;
  }

  printReceipt() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/']);
  }

   // Function to get the count of all products
   getProductCount() {
    this.http.get<{ count: number }>('http://localhost:3000/api/sales/count')
      .subscribe(
        (response) => {
          // Update the product count in your component
          this.salesCount = response.count;
          console.log(this.salesCount)
        },
        (error) => {
          console.error('Error fetching product count:', error);
        }
      );
  }

  // getProductCount(): Observable<number> {
  //   return this.http.get<{ count: number }>('http://localhost:3000/api/sales/count')
  //     .pipe(
  //       map((response) => {
  //         // Update the product count in your component
  //         //this.salesCount = response.count;
  //         console.log(this.salesCount);
  
  //         // Return the count value
  //         return response.count;
  //       })
  //     );
  // }

   // Submit Sales Function
   submitSales() {
    this.UserName = localStorage.getItem('longUsrName') || ''; 
    // this.getProductCount()
    //console.
    const transactionID = 'T' + this.salesCount;
    const salesData = {
      TransactionID: transactionID, // You may need to generate unique IDs dynamically
      UserName: this.UserName, // Replace with the actual username
      Date: new Date().toISOString(), // Current date and time
      TotalQuantity: this.totalItems, // Assuming totalItems holds the total quantity of products
      TotalAmount: 'Rs. ' + this.totalAmount.toFixed(2), // Assuming totalAmount holds the total amount
      products: this.billItems.map((item) => ({
        ProductID: item.productId, // Replace with the actual product ID
        ProductName: item.name,
        Quantity: item.quantity,
        Price: 'Rs. ' + item.price.toFixed(2), // Assuming item.price holds the product price
      })),
    };
    // Send the sales data to the backend API
    this.http.post<any>('http://localhost:3000/addedsalesdata', salesData).subscribe(
      (response) => {
        console.log('Sales data submitted successfully!', response);


        this.correctMessage = 'Sales data submitted successfully!';
        // console.log('Sales data submitted successfully!', response);
        clearTimeout(this.errorTimeout);
        // Automatically remove the error message after 5 seconds
        this.errorTimeout = setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        // You can add any further handling or notifications for successful submission here.
      },
      (error) => {
        console.error('Error submitting sales data:', error);
        // You can handle the error and display appropriate messages here.
      }
    );

    //reduce products>>>>>>>>>>>
      // Prepare data to send to the backend API
      const reduceData = this.billItems.map((item) => ({
        BatchNumber: item.BatchNumber,
        quantity: item.quantity,
      }));
  
      console.log(reduceData);
  
      // Send the reduceData to the backend API
      this.http.post<any>('http://localhost:3000/reduceproductquantity', reduceData).subscribe(
        (response) => {
          console.log('Product quantities reduced successfully:', response);
          // You can add any further handling or notifications for successful quantity reduction here.
        },
        (error) => {
          this.errorMessage = error.error.message;
          console.error('Error reducing product quantities:', error);
          clearTimeout(this.errorTimeout);
  
          // Automatically remove the error message after 5 seconds
          this.errorTimeout = setTimeout(() => {
            this.errorMessage = '';
          }, 2000);
        }
      );
  }

  // reduceProducts() {
  //   // Prepare data to send to the backend API
  //   const reduceData = this.billItems.map((item) => ({
  //     productId: item.productId,
  //     quantity: item.quantity,
  //   }));

  //   console.log(reduceData);

  //   // Send the reduceData to the backend API
  //   this.http.post<any>('http://localhost:3000/reduceproductquantity', reduceData).subscribe(
  //     (response) => {
  //       console.log('Product quantities reduced successfully:', response);
  //       // You can add any further handling or notifications for successful quantity reduction here.
  //     },
  //     (error) => {
  //       this.errorMessage = error.error.message;
  //       console.error('Error reducing product quantities:', error);
  //       clearTimeout(this.errorTimeout);

  //       // Automatically remove the error message after 5 seconds
  //       this.errorTimeout = setTimeout(() => {
  //         this.errorMessage = '';
  //       }, 2000);
  //     }
  //   );
  // }
}
