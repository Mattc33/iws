"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var MainTableSharedService = /** @class */ (function () {
    function MainTableSharedService() {
    }
    MainTableSharedService.prototype.filterForPrivateRateCardsOnly = function (input) {
        return input.filter(function (data) { return data.ratecard_name.includes('private'); });
    };
    MainTableSharedService.prototype.createColumnGroupHeaders = function (input) {
        var colGroupArr = [];
        for (var i = 0; i < input.length; i++) {
            var ratecardModified = input[i].ratecard_name.split('#');
            var ratecardNameModified = ratecardModified[0];
            var ratecardDestinationModified = ratecardModified[2];
            colGroupArr.push({
                colId: "" + i,
                groupHeaderName: "Carrier " + input[i].carrier_id,
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
            });
        }
        return colGroupArr;
    };
    MainTableSharedService.prototype.createCarrierColumnDefs = function (carrierGroupHeadersArr, filteredData) {
        var carrierColumnDefs = [];
        // const destinationArr = [];
        // console.log(filteredData[0].rates[0].destination);
        // for ( let i = 0; i < filteredData.length; i++) {
        //     for ( let x = 0; x < filteredData[i].rates.length; x++) {
        //         console.log(filteredData[i].rates[x]);
        //     }
        // }
        // for ( let i = 0; i < filteredData.length; i++) {
        //     const ratesLen = filteredData[i].rates.length;
        //     console.log(ratesLen);
        // }
        carrierColumnDefs.push({
            headerName: 'Ratecard',
            children: [
                {
                    headerName: 'Prefix', field: 'prefix',
                    cellStyle: { 'border-right': '1px solid #E0E0E0' },
                    lockPosition: true,
                    unSortIcon: true,
                },
                {
                    headerName: 'Destination', field: 'destination',
                    width: 300,
                    cellStyle: function (params) {
                        return { 'border-right': '1px solid #E0E0E0' };
                    },
                },
                {
                    headerName: 'Lowest Rate', field: 'lowest_price',
                    filter: 'agNumberColumnFilter',
                    valueGetter: function (params) {
                        var numberArr = [];
                        var arr = Object.values(params.data);
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] > 0) {
                                numberArr.push(arr[i]);
                            }
                        }
                        numberArr.shift();
                        var min = Math.min.apply(Math, numberArr);
                        return min;
                    },
                    lockPosition: true,
                    cellStyle: { 'border-right': '1px solid black' },
                }
            ]
        });
        for (var i = 0; i < carrierGroupHeadersArr.length; i++) {
            var sellrateFieldString = 'sellrate_' + filteredData[i].ratecard_id;
            var destinationFieldString = 'destination_' + filteredData[i].ratecard_id;
            var prefixGroupHeaderTemplate = "\n                <div class=\"top-buttons\">\n                    <div>\n                        <i class=\"fas fa-minus\" id=\"hide_" + i + "\"></i>\n                    </div>\n                </div>\n                "
                +
                    "\n                <div class=\"exceptions-container\">\n                </div>\n                ";
            carrierColumnDefs.push({
                headerName: carrierGroupHeadersArr[i].ratecard_name_modified,
                children: [
                    {
                        headerName: 'Destination', field: destinationFieldString,
                        width: 300,
                        colId: "carrier_dest_" + i,
                        cellStyle: function (params) {
                            return { 'border-right': '1px solid #E0E0E0' };
                        },
                        columnGroupShow: 'open',
                    },
                    {
                        headerName: 'Rate', field: sellrateFieldString,
                        headerHeight: 500,
                        filter: 'agNumberColumnFilter',
                        colId: "carrier_rate_" + i,
                        cellStyle: function (params) {
                            return { 'border-right': '1px solid #E0E0E0' };
                        },
                        unSortIcon: true,
                    }
                ]
            });
        }
        return carrierColumnDefs;
    };
    MainTableSharedService.prototype.createRowData = function (inputFilteredData) {
        var carrierRowData = carrierRowDataFn(inputFilteredData);
        var groupDataByPrefix = groupDataByPrefixFn(carrierRowData);
        var finalRowData = combineObjsFn(groupDataByPrefix);
        // Set row data
        function carrierRowDataFn(filteredData) {
            var carrierRowDataArr = [];
            for (var i = 0; i < filteredData.length; i++) {
                var prefixFieldKey = 'prefix';
                var destinationField = "destination_" + filteredData[i].ratecard_id;
                var sellrateField = 'sellrate_' + filteredData[i].ratecard_id;
                for (var x = 0; x < filteredData[i].rates.length; x++) {
                    carrierRowDataArr.push((_a = {},
                        _a[prefixFieldKey] = filteredData[i].rates[x].prefix,
                        _a.destination = filteredData[i].rates[x].destination,
                        _a[destinationField] = filteredData[i].rates[x].destination,
                        _a[sellrateField] = filteredData[i].rates[x].buy_rate,
                        _a));
                }
            }
            return carrierRowDataArr;
            var _a;
        }
        function groupDataByPrefixFn(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };
            var data = json.groupBy('prefix');
            var dataArr = [];
            for (var item in data) {
                if (item) {
                    dataArr.push(data[item]);
                }
                else {
                }
            }
            return dataArr;
        }
        function combineObjsFn(groupedData) {
            var rowData = []; // loops through an array of objects and merges multiple objects into one
            for (var i = 0; i < groupedData.length; i++) {
                rowData.push(Object.assign.apply({}, groupedData[i]));
            }
            return rowData;
        }
        return finalRowData;
    };
    MainTableSharedService = __decorate([
        core_1.Injectable()
    ], MainTableSharedService);
    return MainTableSharedService;
}());
exports.MainTableSharedService = MainTableSharedService;
//# sourceMappingURL=main-table.shared.service.js.map