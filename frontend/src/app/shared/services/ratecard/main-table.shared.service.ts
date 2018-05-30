import { Injectable } from '@angular/core';

declare global { // declare global interface, set custom fn groupBy with type any
    interface Array<T> {
      groupBy(elem: T): Array<T>;
    }
}

@Injectable()
export class MainTableSharedService {

    filterForPrivateRateCardsOnly(input) {
        return input.filter(data => data.ratecard_name.includes('private'));
    }

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
        const carrierColumnDefs = [];
        carrierColumnDefs.push(
            {
                headerName: 'Ratecard',
                children: [
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
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) {
                                    dataArr.push( arr[i] as number * 1 );
                                }
                            }

                            const numberArr = dataArr.slice(1);

                            const mean = (array) => {
                                const sum = numberArr.reduce( (acc, value) => acc + value );
                                const avg = (sum / numberArr.length);
                                return avg.toFixed(4);
                            };
                            return mean(numberArr);
                        },
                        cellStyle: { 'border-right': '1px solid #000000' }
                    },
                    {
                        headerName: '* 2%', field: 'our_rate_2p', width: 100, colId: 'our_rate_2p',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true, columnGroupShow: 'open',
                        valueGetter(params) {
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) {
                                    dataArr.push( arr[i] as number * 1 );
                                }
                            }

                            const numberArr = dataArr.slice(1);

                            const mean = (array) => {
                                const sum = numberArr.reduce( (acc, value) => acc + value );
                                const avg = (sum / numberArr.length);
                                const avgMulti = avg * 1.02;
                                return avgMulti.toFixed(4);
                            };
                            return mean(numberArr);
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' }
                    },
                    {
                        headerName: '* 3%', field: 'our_rate_3p', width: 100, colId: 'our_rate_3p',
                        filter: 'agNumberColumnFilter', editable: true, lockPosition: true, columnGroupShow: 'open',
                        valueGetter(params) {
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) {
                                    dataArr.push( arr[i] as number * 1 );
                                }
                            }
                            const numberArr = dataArr.slice(1);
                            const mean = (array) => {
                                const sum = numberArr.reduce( (acc, value) => acc + value );
                                const avg = (sum / numberArr.length);
                                const avgMulti = avg * 1.03;
                                return avgMulti.toFixed(4);
                            };
                            return mean(numberArr);
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
                            const numberArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) { numberArr.push(arr[i]); }
                            }
                            numberArr.slice(1);
                            const min = Math.min(...numberArr).toFixed(4);
                            return min;
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Average', field: 'average', width: 120, colId: 'average',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) {
                                    dataArr.push( arr[i] as number * 1 );
                                }
                            }

                            const numberArr = dataArr.slice(1);

                            const mean = (array) => {
                                const sum = numberArr.reduce( (acc, value) => acc + value );
                                const avg = (sum / numberArr.length);
                                return avg.toFixed(4);
                            };
                            return mean(numberArr);
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Variance', field: 'variance', width: 120, colId: 'variance',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) { dataArr.push(arr[i] as number * 1); }
                            }
                            const numberArr = dataArr.slice(1).sort();

                            function returnVariance(array) {
                                const mean = array.reduce((acc, value) => (acc + value) / array.length);
                                const diff = array.map( (num) => Math.pow(num - mean, 2));
                                const variance = diff.reduce((acc, value) => (acc + value) / array.length);
                                return variance;
                            }
                            return returnVariance(numberArr).toFixed(5);
                        },
                        cellClassRules: {
                            'notable-variance': function(params) {
                                const dataArr = [];
                                const arr = Object.values(params.data);
                                for ( let i = 0; i < arr.length; i++) {
                                    if ( arr[i] > 0 ) { dataArr.push(arr[i] as number * 1); }
                                }
                                const numberArr = dataArr.slice(1).sort();

                                function returnVariance(array) {
                                    const mean = array.reduce((acc, value) => (acc + value) / array.length);
                                    const diff = array.map( (num) => Math.pow(num - mean, 2));
                                    const variance = diff.reduce((acc, value) => (acc + value) / array.length);
                                    return variance;
                                }
                                return returnVariance(numberArr) >= .0009;
                            }
                        },
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    },
                    {
                        headerName: 'Low->High', field: 'lowhigh', width: 200, colId: 'lowhigh',
                        filter: 'agNumberColumnFilter', lockPosition: true,
                        valueGetter(params) {
                            const dataArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) { dataArr.push(arr[i]); }
                            }
                            const numberArr = dataArr.slice(1).sort();

                            if ( numberArr.length > 1 ) {
                                const mean = (array) => {
                                    const sum = array.reduce((acc, value) => acc + ' | ' + value );
                                    return sum;
                                };
                                return mean(numberArr);
                            } else {
                                return numberArr[0];
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
                            headerName: 'Rate', field: sellrateFieldString, width: 120,
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
