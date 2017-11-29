import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

import { HomeComponent } from './home/home.component';

import { CarrierComponent } from './carrier/carrier.component';
import { CarrierUiComponent } from './carrier/carrier-ui/carrier-ui.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';
import { CarrierService } from './carrier/Services/carrier.service';
import { RatesComponent } from './rates/rates.component';
import { AccountsComponent } from './accounts/accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: 
  [ 
    AppComponent, SideNavComponent, TopNavComponent, CarrierComponent, 
    CarrierUiComponent, CarrierTableComponent, HomeComponent, RatesComponent, AccountsComponent, DashboardComponent
  ],
  imports: [ BrowserModule, HttpModule ],
  providers: [CarrierService],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
