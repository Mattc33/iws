"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var NestedAgGridService = /** @class */ (function () {
    function NestedAgGridService() {
    }
    NestedAgGridService.prototype.formatDataToNestedArr = function (input) {
        var splitName = splitNameStringByPound(input);
        var addFieldData = formJSONWithNewFields(input);
        var groupedData = groupDataByName(addFieldData);
        var formattedData = formNewJSONObj(groupedData);
        var finalData = insertObjInNestedChildrenArr(formattedData, groupedData);
        function splitNameStringByPound(json) {
            return json.map(function (data) { return data.name.split('#'); });
        }
        function formJSONWithNewFields(json) {
            var splitNameFields = splitNameStringByPound(input);
            var insertNewFieldsArrPrivate = [];
            var insertNewFieldsArrTeleU = [];
            for (var i = 0; i < json.length; i++) {
                if (splitNameFields[i][2] === 'private') {
                    insertNewFieldsArrPrivate.push({
                        ratecard_bundle: splitNameFields[i][0] + ': [Private]',
                        name: splitNameFields[i][0],
                        dateAdded: splitNameFields[i][1],
                        offer: splitNameFields[i][2],
                        country: splitNameFields[i][3],
                        id: json[i].id,
                        carrier_id: json[i].carrier_id,
                        carrier_name: json[i].carrier_name,
                        confirmed: json[i].confirmed,
                        active: json[i].active,
                        priority: 1
                    });
                }
                if (splitNameFields[i][2] === 'teleU') {
                    insertNewFieldsArrTeleU.push({
                        ratecard_bundle: splitNameFields[i][0] + ': [TeleU]',
                        name: splitNameFields[i][0],
                        dateAdded: splitNameFields[i][1],
                        offer: splitNameFields[i][2],
                        country: splitNameFields[i][3],
                        id: json[i].id,
                        carrier_id: json[i].carrier_id,
                        carrier_name: json[i].carrier_name,
                        confirmed: json[i].confirmed,
                        active: json[i].active,
                        priority: 1
                    });
                }
            }
            var combinedNewFieldsArr = insertNewFieldsArrPrivate.concat(insertNewFieldsArrTeleU);
            return combinedNewFieldsArr;
        }
        function groupDataByName(json) {
            Array.prototype.groupBy = function (prop) {
                return this.reduce(function (groups, item) {
                    groups[item[prop]] = groups[item[prop]] || [];
                    groups[item[prop]].push(item);
                    return groups;
                }, {});
            };
            var data = json.groupBy('ratecard_bundle');
            var dataArr = [];
            for (var item in data) {
                if (item) {
                    dataArr.push(data[item]);
                }
            }
            return dataArr;
        }
        function formNewJSONObj(groupDataByNameObj) {
            var formattedObj = [];
            for (var i = 0; i < groupDataByNameObj.length; i++) {
                formattedObj.push({
                    ratecard_bundle: groupDataByNameObj[i][0].ratecard_bundle,
                    children: []
                });
            }
            return formattedObj;
        }
        function insertObjInNestedChildrenArr(formattedData, groupedData) {
            for (var i = 0; i < formattedData.length; i++) {
                for (var x = 0; x < groupedData[i].length; x++) {
                    formattedData[i].children.push(groupedData[i][x]);
                }
            }
            return formattedData;
        }
        return finalData;
    };
    NestedAgGridService.prototype.returnSetGroups = function () {
        return function getNodeChildDetails(rowItem) {
            if (rowItem.children) {
                return {
                    group: true,
                    children: rowItem.children,
                    key: rowItem.ratecard_bundle
                };
            }
            else {
                return null;
            }
        };
    };
    NestedAgGridService = __decorate([
        core_1.Injectable()
    ], NestedAgGridService);
    return NestedAgGridService;
}());
exports.NestedAgGridService = NestedAgGridService;
//# sourceMappingURL=nestedAgGrid.shared.service.js.map