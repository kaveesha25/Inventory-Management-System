import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css', './sb-admin-2.min.css']
})
export class ForecastComponent implements OnInit{
  searchText: string = '';
  sortKey: string = '';
  sortAsc: boolean = true;
  data: any[] = [];
  filteredData: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 16;
  message: string = '';

  showAddProductForm: boolean = false;
  showDeleteProductForm: boolean = false;
  productForm: FormGroup;
  SupplierDeleteForm: FormGroup;


  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      SupplierID: ['', Validators.required],
      SupplierName: ['', Validators.required],
      SupplierAddress: ['', Validators.required],
      SupplierMail: ['', Validators.required],
      SupplierTel: ['', Validators.required],
    });

    this.SupplierDeleteForm = this.fb.group({
      SupplierIdToDelete: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    console.log("this.data")
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token') || ''
    });

    this.http
      .get<any[]>('http://localhost:3000/suppliersdata', { headers })
      .subscribe(
        (response) => {
          this.data = response;
          this.filteredData = this.data;
          console.log(this.data)
        },
        (error) => {
          console.log(error);
        }
      );
  }

  applyFilter() {
    this.filteredData = this.data.filter((item) =>
      item.SupplierID.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.SupplierName.toLowerCase().includes(this.searchText.toLowerCase())
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

  // Function to add a new product
  addNewProduct() {
    this.showAddProductForm = true;
  }

  // Function to handle form submission
  submitSupplierForm() {
    // Send the new product data to the backend API
    this.http.post<any>('http://localhost:3000/addsupplier', this.productForm.value).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        // Reset the form and hide the form
        this.productForm.reset();
        this.showAddProductForm = false;
        // You can add any further handling or notifications for successful product addition here.
      },
      (error) => {
        console.error('Error adding product:', error);
        // You can handle the error and display appropriate messages here.
      }
    );
  }

  // Function to delete a product
  deleteProduct() {
    this.showDeleteProductForm = true;
  }


  // Function to cancel the delete operation and close the form
  cancelDelete() {
    this.showDeleteProductForm = false;
  }

  // Function to confirm and delete the product
  confirmDeleteSupplier() {
  const SupplierIdToDelete = this.SupplierDeleteForm.get('SupplierIdToDelete')?.value;
  console.log(SupplierIdToDelete)
  this.http.delete<any>(`http://localhost:3000/deletesupplier/${SupplierIdToDelete}`).subscribe(
    (response) => {
      console.log('Product deleted successfully:', response);
      // You can add any further handling or notifications for successful deletion here.

      // Close the delete form and reset the productIdToDelete
      this.cancelDelete();
    },
    (error) => {
      console.error('Error deleting product:', error);
      // You can handle the error and display appropriate messages here.

      // Close the delete form and reset the productIdToDelete
      this.cancelDelete();
    }
  );
}

}
