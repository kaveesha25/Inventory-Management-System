import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {DataTablesModule} from 'angular-datatables'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ProtectedComponent } from './protected/protected.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { UpperNavbarComponent } from './upper-navbar/upper-navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { SalesEntryComponent } from './sales-entry/sales-entry.component';
import { SalesComponent } from './sales/sales.component';
import { ForecastComponent } from './forecast/forecast.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms'; // Import the ReactiveFormsModule

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'purchases', component: PurchasesComponent },
  { path: 'sales-entry', component: SalesEntryComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'forecast', component: ForecastComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent, LoginComponent, ProtectedComponent, PurchasesComponent, RightSidebarComponent, UpperNavbarComponent, DashboardComponent, ProductsComponent, SalesEntryComponent, SalesComponent, ForecastComponent, SignupComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    DataTablesModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
