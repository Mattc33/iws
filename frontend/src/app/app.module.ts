import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { CarrierInfoComponent } from './carrier-info/carrier-info.component';
import { CarrierUiComponent } from './carrier-info/carrier-ui/carrier-ui.component';
import { CarrierTableComponent } from './carrier-info/carrier-table/carrier-table.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: 
  [ 
    AppComponent, SideNavComponent, TopNavComponent, CarrierInfoComponent, 
    CarrierUiComponent, CarrierTableComponent, HomeComponent,
  ],
  imports: [ BrowserModule, HttpModule ],
  providers: [],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
