import { RegistrationComponent } from './../registration/registration.component';
import { LoginComponent } from './../login/login.component';
import { AccountsComponent } from './../../Components/accounts/accounts.component';

import { DashboardComponent } from './../../Components/dashboard/dashboard.component';

import { CarrierTableComponent } from './../../Components/carrier/carrier-table/carrier-table.component';

import { RatecardViewCarrierSComponent } from './../../Components/ratecard/ratecard-view-carrier-s/ratecard-view-carrier-s.component';
import { RateCardsConvertCsvComponent } from './../../Components/ratecard/rate-cards-convert-csv/rate-cards-convert-csv.component';
import { RateCardsAddTrunksComponent } from './../../Components/ratecard/rate-cards-add-trunks/rate-cards-add-trunks.component';
import { RateCardsTableComponent } from './../../Components/ratecard/rate-cards-table/rate-cards-table.component';
import { RatecardViewCarrierPComponent } from './../../Components/ratecard/ratecard-view-carrier-p/ratecard-view-carrier-p.component';
import { ImporterTableComponent } from './../../Components/ratecard/ratecard-importer/importer-table/importer-table.component';
import { RateCardManagerComponent } from '../../Components/ratecard/rate-card-manager/rate-card-manager.component';

import { TrunksTableComponent } from './../../Components/trunks/trunks-table/trunks-table.component';

import { CallPlanAddCodeComponent } from './../../Components/callplan/call-plan-add-code/call-plan-add-code.component';
import { CallPlanAddRatecardComponent } from './../../Components/callplan/call-plan-add-ratecard/call-plan-add-ratecard.component';
import { CallPlanTableComponent } from './../../Components/callplan/call-plan-table/call-plan-table.component';

import { LcrCallPlanTableComponent } from './../../Components/lcr/lcr-callplan-table/lcr-callplan-table.component';
import { LcrTrunkTableComponent } from './../../Components/lcr/lcr-trunk-table/lcr-trunk-table.component';
import { LcrRatecardTableComponent } from './../../Components/lcr/lcr-ratecard-table/lcr-ratecard-table.component';
import { LcrCarrierTableComponent } from './../../Components/lcr/lcr-carrier-table/lcr-carrier-table.component';

import { Routes } from '../../../../node_modules/@angular/router';

export const AppRoutes: Routes =
    [
        {path: '', component: DashboardComponent},
        {path: 'dashboard', component: DashboardComponent},

        {path: 'carrier-view', component: CarrierTableComponent},

        {path: 'rate-card-importer', component: ImporterTableComponent},
        {path: 'rate-card-view', component: RateCardsTableComponent},
        {path: 'rate-card-add-trunks', component: RateCardsAddTrunksComponent},
        {path: 'rate-card-convert-csv', component: RateCardsConvertCsvComponent},
        {path: 'rate-card-view-carrier', component: RatecardViewCarrierSComponent},
        {path: 'rate-card-view-carrier-p', component: RatecardViewCarrierPComponent},
        {path: 'app-rate-card-manager', component: RateCardManagerComponent},

        {path: 'trunks', component: TrunksTableComponent},

        {path: 'call-plan-view', component: CallPlanTableComponent},
        {path: 'call-plan-add-ratecard', component: CallPlanAddRatecardComponent},
        {path: 'call-plan-add-code', component: CallPlanAddCodeComponent},

        {path: 'lcr-carrier', component: LcrCarrierTableComponent},
        {path: 'lcr-ratecard', component: LcrRatecardTableComponent},
        {path: 'lcr-trunk', component: LcrTrunkTableComponent},
        {path: 'lcr-callplan', component: LcrCallPlanTableComponent},

        {path: 'accounts', component: AccountsComponent},
        {path: 'login', component: LoginComponent},
        {path: 'registration', component: RegistrationComponent}
    ];
