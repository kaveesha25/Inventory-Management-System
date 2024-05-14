import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { SalesEntryComponent } from './sales-entry/sales-entry.component';
import { SalesComponent } from './sales/sales.component';
import { ForecastComponent } from './forecast/forecast.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'purchases', component: PurchasesComponent },
  { path: 'sales-entry', component: SalesEntryComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'forecast', component: ForecastComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
