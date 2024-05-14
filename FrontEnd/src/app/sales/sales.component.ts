import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Sale {
  TransactionID: string;
  UserName: string;
  Date: string;
  TotalQuantity: number;
  TotalAmount: string;
  Products: Product[];
  [key: string]: string | number | Product[]; // Add index signature
}

interface Product {
  ProductID: string;
  ProductName: string;
  Quantity: number;
  Price: string;
}

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css', './sb-admin-2.min.css']
})
export class SalesComponent implements OnInit {
  searchText: string = '';
  sortKey: string = '';
  sortAsc: boolean = true;
  data: Sale[] = [];
  filteredData: Sale[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 16;
  message: string = '';
  selectedTransactionId: string | null = null;
  selectedTransaction: any;
  modalOpen: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token') || ''
    });

    this.http
      .get<Sale[]>('http://localhost:3000/salesdata', { headers })
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
    this.filteredData = this.data.filter(
      (item) =>
        item.TransactionID.toLowerCase().includes(this.searchText.toLowerCase()) ||
        item.UserName.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.selectedTransaction = null; // Initialize to null or an empty object
  }

  sortTable(key: string) {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }

    this.filteredData.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return this.sortAsc ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }
    });
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
    return Array(totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  selectTransaction(transaction: string) {
    this.selectedTransaction = transaction;

    this.selectedTransactionId = transaction;
    this.selectedTransaction = this.data.find((item) => item.TransactionID === transaction) || null;
    console.log(this.selectedTransaction )
  }

  closeModal() {
    this.selectedTransaction = null;
  }

  GenerateReport() {
    window.print();
  }
}
