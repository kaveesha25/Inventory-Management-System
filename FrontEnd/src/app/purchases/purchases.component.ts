import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from './purchases.service';


interface Purchase {
  PurchaseID: string;
  ProductID: string;
  Quantity: string;
  DateofOrder: string;
  Supplier: string;
  DateReceived: string;
  Payment: string;
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css', './sb-admin-2.min.css']
})
export class PurchasesComponent implements OnInit {
  searchText: string = '';
  sortKey: string = '';
  sortAsc: boolean = true;
  data: any[] = [];
  filteredData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 16;
  message: string = '';
  purchaseForm: FormGroup; // Declare the form group
  purchaseID: string = '';

  showAddForm: boolean = false;
  newPurchase: any = {
    PurchaseID: '',
    ProductID: '',
    Quantity: '',
    DateofOrder: '',
    Supplier: '',
    DateReceived: '',
    Payment: ''
  };
  purchasesCount!:string;

  constructor(private http: HttpClient,private formBuilder: FormBuilder, private purchaseService: PurchaseService) {


    // Set the generated PurchaseID to the new purchase data
    // this.newPurchase.PurchaseID = purchaseID;
    this.getpurchasesCount();
    const purchasesCount =this.purchasesCount;
    console.log(purchasesCount)
    this.purchaseForm = this.formBuilder.group({
      PurchaseID: 'P51', // Initialize with an empty value
      ProductID: ['', Validators.required],
      BatchNumber: ['', Validators.required],  // Add validators if needed
      Quantity: ['', Validators.required],
      DateofOrder: ['', Validators.required],
      SupplierID: ['', Validators.required],
      DateReceived: ['', Validators.required],
      Payment: ['', Validators.required],
    });
  }

  generatePurchaseID() {
    console.log(this.purchaseService.generatePurchaseID())
    return this.purchaseID = this.purchaseService.generatePurchaseID();
  }

  ngOnInit(): void {
    this.getpurchasesCount();
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token') || ''
    });

    this.http
      .get<any[]>('http://localhost:3000/purchasesdata', { headers })
      .subscribe(
        (response) => {
          this.data = response;
          this.filteredData = this.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  applyFilter() {
    this.filteredData = this.data.filter((item) =>
      item.PurchaseID.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.SupplierID.toLowerCase().includes(this.searchText.toLowerCase())||
      item.BatchNumber.toLowerCase().includes(this.searchText.toLowerCase())
      
    );
  }

  sortTable(key: string) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
  
    this.filteredData.sort((a, b) => {
      const valueA = this.extractNumber(a[key]);
      const valueB = this.extractNumber(b[key]);
  
      if (valueA !== null && valueB !== null) {
        return this.sortAsc ? valueA - valueB : valueB - valueA;
      } else if (valueA !== null) {
        return this.sortAsc ? -1 : 1;
      } else if (valueB !== null) {
        return this.sortAsc ? 1 : -1;
      } else {
        // Handle string comparison when both values are null
        return this.sortAsc
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
    });
  }
  
  // Helper function to extract numbers from mixed strings
  extractNumber(value: any): number | null {
    if (typeof value === 'number') {
      return value;
    }
  
    if (typeof value === 'string') {
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      return isNaN(numericValue) ? null : numericValue;
    }
  
    return null;
  }
  

  getPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredData.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  getPaginationArray(): number[] {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    return Array(totalPages).fill(0).map((_, index) => index + 1);
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  
  // Function to handle form submission
  submitPurchaseForm() {
    
    // Send the new purchase data to the backend API
    this.http.post<any>('http://localhost:3000/addpurchase', this.purchaseForm.value).subscribe(
      (response) => {
        console.log('Purchase added successfully:', response);
        // Reset the form and hide the form
        this.purchaseForm.reset();
        this.showAddForm = false;
        // You can add any further handling or notifications for successful purchase addition here.
      },
      (error) => {
        console.error('Error adding purchase:', error);
        // You can handle the error and display appropriate messages here.
      }
    );




     // Prepare data to send to the backend API
     if (this.purchaseForm.valid) {
      // Extract the values of productId and quantity from the form
      const BatchNumber = this.purchaseForm.get('BatchNumber')?.value;
      const quantity = this.purchaseForm.get('Quantity')?.value;

      // Prepare data to send to the backend API
      const data = {
        BatchNumber: BatchNumber,
        quantity: quantity
      };

      // Send the data to the backend API to increase the product quantity
      this.http.post<any>('http://localhost:3000/increaseproductquantity', data).subscribe(
        (response) => {
          console.log('Product quantity increased successfully:', response);
          // You can add any further handling or notifications for successful quantity increase here.
        },
        (error) => {
          console.error('Error increasing product quantity:', error);
          // You can handle the error and display appropriate messages here.
        }
      );
    }
    
  }


     // Function to get the count of all products
     getpurchasesCount() {
      this.http.get<{ count: number }>('http://localhost:3000/api/purchases/count')
        .subscribe(
          (response) => {
            // Update the product count in your component
            this.purchasesCount = response.count.toString(); ;
            console.log(this.purchasesCount, 'Heloooooooooooooo')
          },
          (error) => {
            console.error('Error fetching product count:', error);
          }
        );
    }

}
