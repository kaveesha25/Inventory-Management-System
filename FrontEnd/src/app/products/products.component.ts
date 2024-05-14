import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css', './sb-admin-2.min.css']
})
export class ProductsComponent implements OnInit{
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
  productDeleteForm: FormGroup;

  showUpdateProductForm: boolean = false;
  updateProductForm: FormGroup;


  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      ProductID: ['', Validators.required],
      BatchNumber: ['', Validators.required],
      ProductName: ['', Validators.required],
      ProductBrand: ['', Validators.required],
      VehicleBrand: ['', Validators.required],
      VehicleModel: ['', Validators.required],
      ManufactureYear: ['', Validators.required],
      Location: ['', Validators.required],
      Quantity: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      BuyingPrice: ['', [Validators.required, Validators.min(0)]],
      Price: ['', [Validators.required, Validators.min(0)]]
    });

    this.productDeleteForm = this.fb.group({
      productIdToDelete: ['', Validators.required],
    });

    this.updateProductForm = this.fb.group({
      ProductID: ['', Validators.required],
      BatchNumber: ['', Validators.required],
      ProductName: ['', Validators.required],
      ProductBrand: ['', Validators.required],
      VehicleBrand: ['', Validators.required],
      VehicleModel: ['', Validators.required],
      ManufactureYear: ['', Validators.required],
      Location: ['', Validators.required],
      Quantity: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      BuyingPrice: ['', [Validators.required, Validators.min(0)]],
      Price: ['', [Validators.required, Validators.min(0)]]
    });

  }

  ngOnInit(): void {
    console.log("this.data")
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token') || ''
    });

    this.http
      .get<any[]>('http://localhost:3000/productsdata', { headers })
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
      item.ProductBrand.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.ProductName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.VehicleBrand.toLowerCase().includes(this.searchText.toLowerCase())||
      item.VehicleModel.toLowerCase().includes(this.searchText.toLowerCase())||
      item.ManufactureYear.toLowerCase().includes(this.searchText.toLowerCase())
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
  submitProductForm() {
    // Send the new product data to the backend API
    this.http.post<any>('http://localhost:3000/addproduct', this.productForm.value).subscribe(
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
  confirmDeleteProduct() {
    const productIdToDelete = this.productDeleteForm.get('productIdToDelete')?.value;
    console.log(productIdToDelete)
    this.http.delete<any>(`http://localhost:3000/deleteproduct/${productIdToDelete}`).subscribe(
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


  // Function to update a product
  updateProduct(product: any) {
    this.showUpdateProductForm = true;
    // Fill the update product form with the details of the selected product
    this.updateProductForm.patchValue({
      ProductID: product.ProductID,
      BatchNumber: product.BatchNumber,
      ProductName: product.ProductName,
      ProductBrand: product.ProductBrand,
      VehicleBrand: product.VehicleBrand,
      VehicleModel: product.VehicleModel,
      ManufactureYear: product.ManufactureYear,
      Location: product.Location,
      Quantity: product.Quantity,
      BuyingPrice: product.BuyingPrice,
      Price: product.Price,
    });
  }

  // Function to cancel the update operation and close the form
  cancelUpdate() {
    this.showUpdateProductForm = false;
  }

// Function to handle form submission when updating the product
updateProductDetails() {
  const updatedProduct = this.updateProductForm.value;
  const batchNumber = updatedProduct.BatchNumber; // Get the BatchNumber from the form data

  // Send the updated product data to the backend API
  this.http.put<any>(`http://localhost:3000/updateproduct/${batchNumber}`, updatedProduct).subscribe(
    (response) => {
      console.log('Product updated successfully:', response);
      // Reset the form and hide the form
      this.updateProductForm.reset();
      // this.showUpdateProductForm = false;
      this.cancelUpdate();
      // You can add any further handling or notifications for successful product update here.
    },
    (error) => {
      console.error('Error updating product:', error);
      // You can handle the error and display appropriate messages here.
    }
  );
}


}
