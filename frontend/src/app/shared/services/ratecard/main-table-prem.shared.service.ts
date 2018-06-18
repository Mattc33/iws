import { Injectable } from '@angular/core';
import { MainTableCommonSharedService } from './main-table-common.shared.service';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Injectable()
export class MainTablePremSharedService {

    constructor(
        private _mainTableCommon: MainTableCommonSharedService
    ) {}

    createColumnGroupHeaders(input) { // groupHeader: `Carrier ${privateData.carrier_id}`,
        const colGroupArr = [];
        for ( let i = 0; i < input.length; i++ ) {
            const ratecardModified = input[i].ratecard_name.split('#');
            const ratecardNameModified = ratecardModified[0];
            const ratecardDestinationModified = ratecardModified[2];

            colGroupArr.push(
                {
                    colId: `${i}`,
                    groupHeaderName: `Carrier ${input[i].carrier_id}`,
                    carrier_coverage: input[i].carrier_coverage,
                    carrier_id: input[i].carrier_id,
                    carrier_name: input[i].carrier_name,
                    carrier_tier: input[i].carrier_tier,
                    end_ts: input[i].end_ts,
                    popular_deals: input[i].popular_deals,
                    quality_of_service: input[i].quality_of_service,
                    quantity_available: input[i].quantity_available,
                    ratecard_id: input[i].ratecard_id,
                    ratecard_name: input[i].ratecard_name,
                    rating: input[i].rating,
                    resellable: input[i].resellable,
                    ratecard_name_modified: ratecardNameModified,
                    ratecard_destination_modified: ratecardDestinationModified
                }
            );
        }
        return colGroupArr;
    }

    createCarrierColumnDefs(carrierGroupHeadersArr, filteredData) {
        const carrierColumnDefs = []; // * Arr that will contain the columnDefs

        // * Imported helper fns
        const _mainTableCommon = this._mainTableCommon;

        carrierColumnDefs.push(
            {
                headerName: 'Standard Ratecard',
                children: [
                    {
                            headerName: 'Variance Flag', field: 'variance', width: 120, colId: 'high_variance',
                            filter: 'agNumberColumnFilter', lockPosition: true,
                            valueGetter(params) {
                                const ratesArr = _mainTableCommon.extractRates(params).sort();
                                const returnVariance = _mainTableCommon.returnVariance(ratesArr);
                                if ( returnVariance >= .0009  ) {
                                    return 'High Variance';
                                } else {
                                    return '';
                                }
                            },
                            hide: true,
                            cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Prefix', field: 'prefix', width: 120, colId: 'prefix',
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        lockPosition: true, unSortIcon: true,
                    },
                    {
                        headerName: 'Destination', field: 'destination', colId: 'destination',
                        width: 300, lockPosition: true,
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Our Rates', field: 'our_rate', width: 120, colId: 'our_rate',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params);
                            const min = Math.min(...ratesArr).toFixed(4);
                            return min;
                        },
                        cellStyle: { 'border-right': '1px solid #000000' }
                    },
                    {
                        headerName: '* 1%', field: 'our_rate_1p', width: 100, colId: 'our_rate_1p',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params);
                            const min = Math.min(...ratesArr).toFixed(4);
                            const minToNum = parseFloat(min) * 1.01;
                            return minToNum.toFixed(4);
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' }
                    },
                    {
                        headerName: '* 2%', field: 'our_rate_2p', width: 100, colId: 'our_rate_2p',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params).sort();
                            const min = Math.min(...ratesArr).toFixed(4);
                            const minToNum = parseFloat(min) * 1.02;
                            return minToNum.toFixed(4);
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' }
                    },
                    {
                        headerName: '* 3%', field: 'our_rate_3p', width: 100, colId: 'our_rate_3p',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params);
                            const min = Math.min(...ratesArr).toFixed(4);
                            const minToNum = parseFloat(min) * 1.03;
                            return minToNum.toFixed(4);
                        },
                        cellStyle: { 'border-right': '1px solid #000000' }
                    },
                    {
                        headerName: 'Status', field: 'status', width: 100, colId: 'status',
                        editable: true, lockPosition: true,
                        valueGetter() {
                            return 'current';
                        },
                        cellStyle: { 'border-right': '1px solid #000000' }
                    },
                ]
            },
            {
                headerName: 'Calculations',
                children: [
                    {
                        headerName: 'Lowest Rate', field: 'lowest_rate', width: 120, colId: 'lowest_rate',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params);
                            const min = Math.min(...ratesArr).toFixed(4);
                            return min;
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Average', field: 'average', width: 120, colId: 'average',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params);
                            const mean = _mainTableCommon.returnMean(ratesArr).toFixed(4);
                            return mean;
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Variance', field: 'variance', width: 120, colId: 'variance',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params).sort();
                            const returnVariance = _mainTableCommon.returnVariance(ratesArr).toFixed(5);
                            return returnVariance;
                        },
                        cellClassRules: {
                            'notable-variance': function(params) {
                                const ratesArr = _mainTableCommon.extractRates(params).sort();
                                const returnVariance = _mainTableCommon.returnVariance(ratesArr);
                                return returnVariance >= .0009;
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Low->High', field: 'lowhigh', width: 200, colId: 'lowhigh',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const ratesArr = _mainTableCommon.extractRates(params).sort();
                            if ( ratesArr.length > 1 ) {
                                return _mainTableCommon.joinStrings(ratesArr, '|');
                            } else {
                                return ratesArr[0];
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #000000' }
                    }
                ]
            } // End of parent Object
        ); // end push of calc cols

        for ( let i = 0; i < carrierGroupHeadersArr.length; i++ ) { // pushing ea carrier as a col
            const sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            const destinationFieldString = 'destination_' + filteredData[i].ratecard_id;

            carrierColumnDefs.push(
                {
                    headerName: carrierGroupHeadersArr[i].ratecard_name_modified,
                    children: [
                        {
                            headerName: 'Destination', field: destinationFieldString,
                            width: 300,
                            colId: `carrier_dest_${i}`,
                            cellStyle: { 'border-right': '1px solid #E0E0E0' },
                            columnGroupShow: 'open',
                        },
                        {
                            headerName: carrierGroupHeadersArr[i].ratecard_name_modified, field: sellrateFieldString, width: 200,
                            headerHeight: 500, editable: true,
                            filter: 'agNumberColumnFilter',
                            colId: `carrier_rate_${i}`, // This will be the columnID to use for functionaility
                            cellStyle: { 'border-right': '1px solid #E0E0E0' },
                            unSortIcon: true,
                        }
                    ]
                }
            );
        }
        return carrierColumnDefs;
    }

    createRowData(inputFilteredData) {
        const carrierRowData = carrierRowDataFn(inputFilteredData);
        const groupDataByPrefix = groupDataByPrefixFn(carrierRowData);
        const finalRowData = combineObjsFn(groupDataByPrefix);

        // Set row data
        function carrierRowDataFn(filteredData) {
            const carrierRowDataArr = [];

            for ( let i = 0; i < filteredData.length; i++ ) {
                const prefixFieldKey = 'prefix';
                const destinationField = `destination_${filteredData[i].ratecard_id}`;
                const sellrateField = 'sellrate_' + filteredData[i].ratecard_id;

                for ( let x = 0; x < filteredData[i].rates.length; x++ ) {
                    carrierRowDataArr.push(
                            {
                                [prefixFieldKey]: filteredData[i].rates[x].prefix,
                                destination: filteredData[i].rates[x].destination,
                                [destinationField]: filteredData[i].rates[x].destination,
                                [sellrateField]: filteredData[i].rates[x].buy_rate.toFixed(4)
                            }
                    );
                }

            }

            return carrierRowDataArr;
        }

        function groupDataByPrefixFn(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };

            const data = json.groupBy('prefix');
            const dataArr = [];
            for (const item in data) {
                if ( item ) {
                    dataArr.push(data[item]);
                }
            }
            return dataArr;
        }

        function combineObjsFn(groupedData) {
            const rowData = []; // loops through an array of objects and merges multiple objects into one
            for ( let i = 0; i < groupedData.length; i++) {
                rowData.push(
                    Object.assign.apply({}, groupedData[i])
                 );
            }
            return rowData;
        }

        return finalRowData;
    }
}
