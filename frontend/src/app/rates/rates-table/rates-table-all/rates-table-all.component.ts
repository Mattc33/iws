import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ColumnApi } from 'ag-grid/dist/lib/columnController/columnController';
import { GridApi } from 'ag-grid';

import { RateCardsService } from './../../../rate-cards/services/rate-cards.api.service';
import { RatesService } from '../../services/rates.api.service';
import { RatesSharedService } from '../../services/rates.shared.service';

import { DeleteAllRatesDialogComponent } from './dialog/delete-rates-all/delete-rates-all-dialog.component';

@Component({
    selector: 'app-rates-table-all',
    templateUrl: './rates-table-all.component.html',
    styleUrls: ['./rates-table-all.component.scss']
})

export class RatesTableAllComponent implements OnInit {

    // Forms
    rateCardFormGroup: FormGroup;

    // Define row and column data
    private rowData;
    private columnDefs;

    // AG grid props
    private gridApi: GridApi;
    private columnApi: ColumnApi;

    // Properties for internal service
    private rowSelection;
    private ratesRowObj;
    private quickSearchValue: string = '';
    private numberSelectedRows = 0;
    rateCardObj;
    rateCardObjLen: number;
    currentRateCardNames = [];
    percents = [
        {value: 1.05, viewValue: '5%'}, {value: 1.1, viewValue: '10%'}, {value: 1.15, viewValue: '15%'}, {value: 1.2, viewValue: '20%'}, 
        {value: 1.25, viewValue: '25%'}, {value: 1.3, viewValue: '30%'}, {value: 1.35, viewValue: '35%'}, {value: 1.4, viewValue: '40%'}, 
        {value: 1.45, viewValue: '45%'}, {value: 1.5, viewValue: '50%'}, {value: 1.55, viewValue: '55%'}, {value: 1.6, viewValue: '60%'}, 
        {value: 1.65, viewValue: '65%'}, {value: 1.7, viewValue: '70%'}, {value: 1.75, viewValue: '75%'}, {value: 1.8, viewValue: '80%'}, 
        {value: 1.85, viewValue: '85%'}, {value: 1.9, viewValue: '90%'}, {value: 1.95, viewValue: '95%'}, {value: 2, viewValue: '100%'}
    ];

    constructor(private ratesService: RatesService, private ratesSharedService: RatesSharedService, private rateCardsService: RateCardsService,
    private dialog: MatDialog, private formBuilder: FormBuilder) {
        this.columnDefs = this.createColumnDefs();
        this.rowSelection = 'multiple';
    }

    ngOnInit() {
        this.get_RateCards();
        this.rateCardFormGroup = this.formBuilder.group({
            rateCardCtrl: ['']
        });
    }

    on_GridReady(params): void {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.on_InitializeRows();
        this.gridApi.sizeColumnsToFit();
        this.getRateCardNames();
    }

    on_InitializeRows(): void {
        this.ratesService.get_Rates()
        .subscribe(
            data => { this.rowData = data; },
            error => { console.log(error); }
        );
    }

    private createColumnDefs() {
        return [
            {
                headerName: 'All Rates',
                children: [
                    {
                        headerName: 'Rate Card Name', field: 'ratecard_name', checkboxSelection: true,
                        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
                    },
                    {
                        headerName: 'Prefix', field: 'prefix', width: 100,
                    },
                    {
                        headerName: 'Destination', field: 'destination',
                        
                    },
                    {
                        headerName: 'Buy Rate', field: 'buy_rate', editable: true, filter: 'agNumberColumnFilter',
                        width: 150, enableCellChangeFlash: true
                    },
                    {
                        headerName: 'Sell Rate', field: 'sell_rate', editable: true, filter: 'agNumberColumnFilter',
                        width: 150, enableCellChangeFlash: true
                    },
                    {
                        headerName: 'Difference',
                        valueGetter: function(params) {
                          const diff = (params.data.sell_rate - params.data.buy_rate);
                          const percent = ((diff) / params.data.buy_rate) * 100;
                          const diffFixed = diff.toFixed(4);
                          const percentFixed = percent.toFixed(2);

                          return `${diffFixed}(${percentFixed}%)`;
                        }
                    },
                ]
            }
        ];
    }

    private createColumnDefsTeleU() {
        return [
            {
            headerName: 'Tele-U',
            children: [
                {
                    headerName: 'Prefix', field: 'prefix',
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Destination', field: 'destination',
                },
                {
                    headerName: 'Buy Rate', field: 'buy_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
                {
                    headerName: 'Sell Rate', field: 'sell_rate',
                    editable: true,
                    filter: 'agNumberColumnFilter'
                },
            ]
            }
        ];
    }

    // When width of parent (e) has been changed, fire this event to resize col
    on_GridSizeChanged(params): void {
        params.api.sizeColumnsToFit();
    }

    on_SelectionChanged(): void {
        const selectedRows = this.gridApi.getSelectedRows();
        this.ratesRowObj = selectedRows;
        this.numberSelectedRows = selectedRows.length;
        console.log(this.ratesRowObj);
    }

    aggrid_delRow(boolean) {
        if (boolean === true) {
            this.gridApi.updateRowData({ remove: this.ratesRowObj });
        } else {
            return;
        }
    }

    aggrid_onCellValueChanged(params: any) {

        console.log (params);
        const id = params.data.id; // rates ID
        const ratecard_id = params.data.ratecard_id;
        const prefix = params.data.prefix;
        const destination = params.data.destination;
        const buy_rate = parseFloat(params.data.buy_rate);
        const buy_rate_minimum = params.data.buy_rate_minimum;
        const buy_rate_increment = params.data.buy_rate_increment;
        const sell_rate = parseFloat(params.data.sell_rate);
        const sell_rate_minimum = params.data.sell_rate_minimum;
        const sell_rate_increment = params.data.sell_rate_increment;
          
        const ratesObj = {
            ratecard_id: ratecard_id,
            prefix: prefix,
            destination: destination,
            buy_rate: buy_rate,
            buy_rate_minimum: buy_rate_minimum,
            buy_rate_increment: buy_rate_increment,
            sell_rate: sell_rate,
            sell_rate_minimum: sell_rate_minimum,
            sell_rate_increment: sell_rate_increment
        };

        console.log(ratesObj);
        this.put_editRateCard(id, ratesObj);
    }

    // call service to edit Rate Cards name
    put_editRateCard(id, ratesObj) {
        this.ratesService.put_Rates(id, ratesObj)
            .subscribe(resp => console.log(resp));
    }

    openDialogDel(): void {
        // assign new rowObj prop
        this.ratesSharedService.changeAllRowObj(this.ratesRowObj);

        const dialogRef = this.dialog.open(DeleteAllRatesDialogComponent, {});

        const sub = dialogRef.componentInstance.event_onDel.subscribe((data) => {
            // do something with event data
            this.aggrid_delRow(data);
        });

        dialogRef.afterClosed().subscribe(() => {
            sub.unsubscribe();
            console.log('The dialog was closed');
        });
    } // end openDialogAdd UploadRatesDialog


    /*
        Toolbar 
    */
    onQuickFilterChanged() { // external global search
        this.gridApi.setQuickFilter(this.quickSearchValue);
    }

    get_RateCards(): void { // call api service to get the list of current rate cards
        this.rateCardsService.get_RateCard()
        .subscribe(
            data => { this.rateCardObj = data;},
            error => { console.log(error) }
        );
    }

    getRateCardNames() { // attaches to grid onready life cycle      
        this.currentRateCardNames.push( {value: '', viewValue: 'View All Rates'},);
        for (let i = 0; i<this.rateCardObj.length; i++)  {
            this.currentRateCardNames.push( {value: this.rateCardObj[i].name, viewValue: this.rateCardObj[i].name}, )
        }
    }

    setRateCard(rateCardName) { // set the current value of rate card dropdown to filter
        this.gridApi.setQuickFilter(rateCardName);
    }

}   

/*

add_ts
:
"2018-01-22T20:29:03Z"
carrier_id
:
1
carrier_name
:
"VoxBeam"
description
:
null
end_ts
:
"2018-01-22T20:29:03Z"
id
:
29
name
:
"VoxBeam Silver"
start_ts
:
"2018-01-19T20:29:03Z"

*/