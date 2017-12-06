// Core Modules
import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';

// UI Library: PrimeNG
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';

// Main UI components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// Pages
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier
import { CarrierComponent } from './carrier/carrier.component';
import { CarrierUiComponent } from './carrier/carrier-ui/carrier-ui.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';
import { AgGridModule } from 'ag-grid-angular/main';
import { CarrierService } from './carrier/services/carrier.service';

// Rates
import { RatesComponent } from './rates/rates.component';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';

import { MetricsComponent } from './metrics/metrics.component';

@NgModule({
  declarations: 
  [ 
    AppComponent, SideNavComponent, TopNavComponent, CarrierComponent, 
    CarrierUiComponent, CarrierTableComponent, DashboardComponent, RatesComponent, 
    AccountsComponent, MetricsComponent,
  ],
  imports: 
  [ 
    BrowserModule, HttpModule, DataTableModule, SharedModule, ButtonModule, FormsModule,
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'rates', component: RatesComponent},
      {path: 'accounts', component: AccountsComponent},
      {path: 'metrics', component: MetricsComponent}
    ])
  ],
  providers: [ CarrierService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
