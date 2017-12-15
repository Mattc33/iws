// Core Modules
// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { FileSelectDirective } from 'ng2-file-upload';

// UI Library: Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule, MatButtonModule, MatInputModule, MatStepperModule, MatSelectModule } from '@angular/material';
import { MatCheckboxModule, MatIconModule, MatRadioModule, MatDialogModule } from '@angular/material';

/* --------------------------------------------------------------------------------------------------------------------------------------

   -------------------------------------------------------------------------------------------------------------------------------------- */

// Main UI components
import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';

// DashBoard
import { DashboardComponent } from './dashboard/dashboard.component';

// Carrier using AG - Grid
import { AgGridModule } from 'ag-grid-angular';
import { CarrierComponent } from './carrier/carrier.component';
import { CarrierTableComponent } from './carrier/carrier-table/carrier-table.component';
import { CarrierService } from './carrier/services/carrier.service';
import { CarrierUiComponent, AddCarrierDialogComponent } from './carrier/dialog/carrier-ui.component';

// Rates
import { RatesComponent } from './rates/rates.component';
import { RatesimporterComponent } from './rates/rates-importer/rates-importer.component';
import { RatesTableComponent } from './rates/rates-table/rates-table.component';
import { FileUploaderComponent } from './rates/rates-importer/file-uploader/file-uploader.component';

// Accounts
import { AccountsComponent } from './accounts/accounts.component';

@NgModule({
  declarations:
  [
    AppComponent,
    SideNavComponent, TopNavComponent,
    DashboardComponent,
    CarrierComponent, CarrierTableComponent, CarrierUiComponent, AddCarrierDialogComponent,
    RatesComponent, RatesimporterComponent, RatesTableComponent, FileUploaderComponent, FileSelectDirective,
    AccountsComponent,
  ],
  imports:
  [
    // Core Angular Modules
    HttpModule, HttpClientModule,
    FormsModule, CommonModule, ReactiveFormsModule,
    // Angular Materials Modules
    BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatStepperModule, MatButtonModule, MatSelectModule, MatCheckboxModule,
    MatRadioModule, MatIconModule, MatDialogModule,
    // Larger 3rd party module
    AgGridModule.withComponents([ ]),
    RouterModule.forRoot([
      {path: '', component: DashboardComponent},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'carrier', component: CarrierComponent},
      {path: 'rates', component: RatesComponent},
      {path: 'accounts', component: AccountsComponent},
    ])
  ],
  providers: [ CarrierService ], // Applications services
  bootstrap: [ AppComponent ], // Add in dialog
  entryComponents: [ AddCarrierDialogComponent] , // Add in dialog
})

export class AppModule { }
