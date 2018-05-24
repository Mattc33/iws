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

        // const destinationArr = [];
        // console.log(filteredData[0].rates[0].destination);

        // for ( let i = 0; i < filteredData.length; i++) {

        //     for ( let x = 0; x < filteredData[i].rates.length; x++) {
        //         console.log(filteredData[i].rates[x]);
        //     }
        // }

        console.log(filteredData);

        for ( let i = 0; i < filteredData.length; i++) {
            const ratesLen = filteredData[i].rates.length;
            console.log(ratesLen);

        }

        const mainDestinationFieldString = 'destination_' + filteredData[0].ratecard_id;


        carrierColumnDefs.push(
            {
                headerName: 'Ratecard',
                children: [
                    {
                        headerName: 'Prefix', field: 'prefix',
                        cellStyle: { 'border-right': '1px solid #E0E0E0' },
                        lockPosition: true,
                        unSortIcon: true,
                    },
                    {
                        headerName: 'Destination', field: mainDestinationFieldString,
                        width: 300,
                        cellStyle: function(params) {
                            return {'border-right': '1px solid #E0E0E0'};
                        },
                    },
                    {
                        headerName: 'Lowest Rate', field: 'lowest_price',
                        filter: 'agNumberColumnFilter',
                        valueGetter(params) {
                            const numberArr = [];
                            const arr = Object.values(params.data);
                            for ( let i = 0; i < arr.length; i++) {
                                if ( arr[i] > 0 ) {
                                    numberArr.push(arr[i]);
                                }
                            }
                            numberArr.shift();
                            const min = Math.min(...numberArr);
                            return min;
                        },
                        lockPosition: true,
                        cellStyle: { 'border-right': '1px solid black' },
                    }
                ]
            }
        );

        for ( let i = 0; i < carrierGroupHeadersArr.length; i++ ) { // pushing ea carrier as a col
            const sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            const destinationFieldString = 'destination_' + filteredData[i].ratecard_id;
            const prefixGroupHeaderTemplate =
                `
                <div class="top-buttons">
                    <div>
                        <i class="fas fa-minus" id="hide_${i}"></i>
                    </div>
                </div>
                `
                +
                `
                <div class="exceptions-container">
                </div>
                `;

            carrierColumnDefs.push(
                {
                    headerName: carrierGroupHeadersArr[i].ratecard_name_modified,
                    children: [
                        {
                            headerName: 'Destination', field: destinationFieldString,
                            width: 300,
                            colId: `carrier_dest_${i}`,
                            cellStyle: function(params) {
                                return {'border-right': '1px solid #E0E0E0'};
                            },
                            columnGroupShow: 'open',
                        },
                        {
                            headerName: 'Rate', field: sellrateFieldString,
                            headerHeight: 500,
                            filter: 'agNumberColumnFilter',
                            colId: `carrier_rate_${i}`, // This will be the columnID to use for functionaility
                            cellStyle: function(params) {
                                return {'border-right': '1px solid #E0E0E0'};
                            },
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
                                [destinationField]: filteredData[i].rates[x].destination,
                                [sellrateField]: filteredData[i].rates[x].buy_rate,
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
                } else {
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
