// Core Modules
import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';

// UI Library: PrimeNG
import { DataTableModule, SharedModule, ButtonModule } from 'primeng/primeng';

// Main UI components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// Pages
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier Prime NG
import { CarrierComponent } from './carrier/carrier.component';
import { CarrierUiComponent } from './carrier/carrier-ui/carrier-ui.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';
import { CarrierService } from './carrier/services/carrier.service';

// Carrier AG - Grid
import { AgGridModule } from 'ag-grid-angular';
import { CarrierAggridComponent } from './carrier-aggrid/carrier-aggrid.component';
import { CarrierAggridTableComponent } from './carrier-aggrid/carrier-aggrid-table/carrier-aggrid-table.component';

// Rates
import { RatesComponent } from './rates/rates.component';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';
import { MetricsComponent } from './metrics/metrics.component';


@NgModule({
  declarations: 
  [ 
    AppComponent, 
    SideNavComponent, TopNavComponent, 
    DashboardComponent,
    CarrierComponent, CarrierUiComponent, CarrierTableComponent, 
    CarrierAggridComponent, CarrierAggridTableComponent,
    RatesComponent, 
    AccountsComponent, 
    MetricsComponent,
  ],
  imports: 
  [ 
    BrowserModule, HttpModule, HttpClientModule,
    FormsModule,
    DataTableModule,
    AgGridModule.withComponents([ ]),
    SharedModule, ButtonModule,
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'carrier-aggrid', component: CarrierAggridComponent},
      {path: 'rates', component: RatesComponent},
      {path: 'accounts', component: AccountsComponent},
      {path: 'metrics', component: MetricsComponent}
    ])
  ],
  providers: [ CarrierService ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
