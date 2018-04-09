import { Component, OnInit } from '@angular/core';
import { GridApi, ColumnApi, ColumnGroup } from 'ag-grid';

import { CarrierSelectorService } from './../services/carrier-selector.api.service';
import { CodesSharedService } from './../../global-service/codes.shared.service';

@Component({
  selector: 'app-carrier-selector-table',
  templateUrl: './carrier-selector-table.component.html',
  styleUrls: ['./carrier-selector-table.component.scss']
})
export class CarrierSelectorTableComponent implements OnInit {

    // row data and columnd defs
    private rowDataCountry;
    private columnDefsCountry;
    private columnDefsCarrier;
    private rowDataToolpanel;
    private columnDefsToolpanel;

    // gridApi
    private gridApiCountry: GridApi;
    private gridApiCarrier: GridApi;
    private columnApiCarrier: ColumnApi;
    private gridApiToolpanel: GridApi;

    // gridUi
    private rowSelectionM = 'multiple';

    // raw json data
    private rawJSON;

    constructor(
        private codesSharedService: CodesSharedService,
        private carrierSelectorService: CarrierSelectorService
    ) {
        this.columnDefsCountry = this.createColumnDefsCountry();
        this.columnDefsToolpanel = this.createColumnDefsToolbar();
    }

    ngOnInit() {
        this.rowDataCountry = this.codesSharedService.getCountryCodes().slice(1);
    }

    /*
        ~~~~~~~~~~ Carrier-Selector API Serivices ~~~~~~~~~~
    */
    get_specificCarrierRatesByCountry(countryCode: number) {
        this.carrierSelectorService.get_ratesByCountry(countryCode)
            .subscribe(
                data => {
                    // prune data to keep only private rates
                    const teleuData = data.filter( dt => dt.ratecard_name.includes('private') );

                    // create column group headers
                    const carrierArr = teleuData.map( carrier => `${carrier.carrier_name}` );
                    console.log(carrierArr);

                    // generate columns defs
                    const createColumnDefsCarrier = [];
                    createColumnDefsCarrier.push(
                        {
                            headerName: 'Prefix', field: 'prefix',
                            cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        }
                    );
                    for ( let i = 0; i < carrierArr.length; i++ ) {
                        const sellrateFieldString = 'sellrate_' + teleuData[i].ratecard_id;
                        createColumnDefsCarrier.push(
                            {
                                headerName: carrierArr[i],
                                marryChildren: true,
                                children: [
                                    {
                                        headerName: 'Sell Rate', field: sellrateFieldString,
                                        cellStyle: { 'border-right': '1px solid #E0E0E0' }
                                    },
                                ]
                            },
                        );
                    }
                    this.columnDefsCarrier = createColumnDefsCarrier;
                    console.log(createColumnDefsCarrier);

                    // set rowData
                    const carrierRowData = [];
                    for ( let i = 0; i < teleuData.length; i++ ) {
                        const prefixFieldKey = 'prefix';
                        const sellrateField = 'sellrate_' + teleuData[i].ratecard_id;

                        for ( let x = 0; x < teleuData[i].rates.length; x++ ) {
                            carrierRowData.push(
                                    {
                                        [prefixFieldKey]: teleuData[i].rates[x].prefix,
                                        [sellrateField]: teleuData[i].rates[x].sell_rate,
                                    }
                            );

                        }
                    }

                    // process rowData for AG Grid
                    function numOfUniquePrefix() { // Detect how many unique prefixes
                        const prefixArr = [];
                        for ( let i = 0; i < carrierRowData.length; i++) {
                            prefixArr.push(carrierRowData[i].prefix);
                        }

                        const uniquePrefixArr = prefixArr.filter(function(item, position) {
                            return prefixArr.indexOf(item) === position;
                        });

                        return uniquePrefixArr.length;
                    }

                    console.log(numOfUniquePrefix());

                    function groupAllRatesByPrefix() { // Group rates by every unique prefix
                        function groupBy(list, keyGetter) {
                            const map = new Map();
                            list.forEach((item) => {
                                const key = keyGetter(item);
                                if (!map.has(key)) {
                                    map.set(key, [item]);
                                } else {
                                    map.get(key).push(item);
                                }
                            });
                            return map;
                        }

                        let groupedByPrefixMapped;
                        for ( let i = 0; i < numOfUniquePrefix(); i++) {
                            groupedByPrefixMapped = groupBy(carrierRowData, rate => rate.prefix);
                        }

                        const groupByPrefixArr = Array.from(groupedByPrefixMapped);

                        const groupedByPrefixRemoveKeyArr = [];
                        for ( let i = 0; i < groupByPrefixArr.length; i++) {
                            groupedByPrefixRemoveKeyArr.push(
                                groupByPrefixArr[i][1]
                            );
                        }

                        return groupedByPrefixRemoveKeyArr;
                    }
                    console.log(groupAllRatesByPrefix());

                    const finalRowData = []; // loops through an array of objects and merges multiple objects into one
                    for ( let i = 0; i < groupAllRatesByPrefix().length; i++) {
                         finalRowData.push(
                            Object.assign.apply({}, groupAllRatesByPrefix()[i])
                         );
                    }
                    console.log(finalRowData);
                    this.gridApiCarrier.setRowData(finalRowData);
                }
            );
    }

    /*
        ~~~~~~~~~~ AG Grid Initialization ~~~~~~~~~~
    */
    on_GridReady_country(params): void {
        this.gridApiCountry = params.api;
    }

    on_GridReady_carrier(params) {
        this.gridApiCarrier = params.api;
        this.columnApiCarrier = params.columnApi;
        // params.api.sizeColumnToFit();
    }

    on_GridReady_toolpanel(params) {
        this.gridApiToolpanel = params.api;
        // params.api.sizeColumnsToFit();
    }

    private createColumnDefsCountry() {
        return [
            {
                headerName: 'Country', field: 'country', checkboxSelection: true,
            },
            {
                headerName: 'Code', field: 'code', hide: true,
            },
        ];
    }

    private createColumnDefsToolbar() {
        return [
            {
                headerName: 'Carriers', field: 'carrier_name', checkboxSelection: true,
            }
        ];
    }

    private createMockRowDataToolpanel() {
        return [
            {

            }
        ];
    }

    /*
        ~~~~~~~~~~ AG Grid UI Interactions ~~~~~~~~~~
    */
    gridSizeChanged(params) {
        params.api.sizeColumnsToFit();
    }

    rowSelected(params) {
        this.gridApiCarrier.setRowData([]);
        this.columnDefsCarrier = [];

        const countryCode = this.gridApiCountry.getSelectedRows();
        if ( countryCode.length > 0 ) {
            this.get_specificCarrierRatesByCountry(countryCode[0].code);
        } else {
        }
    }

    /*
        ~~~~~~~~~~ parse Data ~~~~~~~~~~
    */


}
