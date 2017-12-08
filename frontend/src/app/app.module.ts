// Core Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';

// UI Library: PrimeNG
import { DataTableModule, SharedModule, ButtonModule, FileUploadModule } from 'primeng/primeng';

// UI Library: Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatStepperModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule, MatIconModule} from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';

// ----------------------------------------------------------------------------

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
import { RatesimporterComponent } from './rates/ratesimporter/ratesimporter.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { FileuploaderComponent } from './rates/ratesimporter/fileuploader/fileuploader.component';

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
    RatesComponent, RatesimporterComponent, RatesTableComponent,
    AccountsComponent, 
    MetricsComponent, FileuploaderComponent, 
  ],
  imports: 
  [
    // Core Angular Modules
    BrowserModule, HttpModule, HttpClientModule,
    FormsModule, CommonModule, ReactiveFormsModule,
    // Angular Materials Modules
    BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatRadioModule, MatIconModule,
    // Prime Ng Modules
    DataTableModule, SharedModule, ButtonModule, FileUploadModule,
    // Larger 3rd party module
    AgGridModule.withComponents([ ]),
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
