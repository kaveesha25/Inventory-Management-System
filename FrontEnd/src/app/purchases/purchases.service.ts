import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private static currentPurchaseNumber = 51;

  generatePurchaseID(): string {
    const purchaseID = 'P' + PurchaseService.currentPurchaseNumber.toString().padStart(2, '0');
    PurchaseService.currentPurchaseNumber++;
    return purchaseID;
  }
}
