"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rate_cards_api_service_1 = require("./../../shared/api-services/ratecard/rate-cards.api.service");
var rate_cards_shared_service_1 = require("./../../shared/services/ratecard/rate-cards.shared.service");
var trunks_api_service_1 = require("./../../trunks/services/trunks.api.service");
var nestedAgGrid_shared_service_1 = require("./../../shared/services/global/nestedAgGrid.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var RateCardsAddTrunksComponent = /** @class */ (function () {
    function RateCardsAddTrunksComponent(rateCardsService, rateCardsSharedService, trunksService, nestedAgGridService, snackbarSharedService) {
        this.rateCardsService = rateCardsService;
        this.rateCardsSharedService = rateCardsSharedService;
        this.trunksService = trunksService;
        this.nestedAgGridService = nestedAgGridService;
        this.snackbarSharedService = snackbarSharedService;
        this.event_onAdd = new core_1.EventEmitter;
        // props
        this.finalRatecardToTrunkArr = [];
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsTrunk = this.createColumnsDefsTrunk();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    RateCardsAddTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_ratecards();
        this.get_trunks();
        this.rateCardsSharedService.currentRowAllObj.subscribe(function (data) { return _this.ratecardsObj = data; });
    };
    // ================================================================================
    // API Service
    // ================================================================================
    RateCardsAddTrunksComponent.prototype.get_ratecards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    RateCardsAddTrunksComponent.prototype.get_trunks = function () {
        var _this = this;
        this.trunksService.get_allTrunks().subscribe(function (data) {
            _this.rowDataTrunk = data;
        }, function (error) { console.log(error); });
    };
    RateCardsAddTrunksComponent.prototype.post_attachTrunksToRatecard = function (ratecardId, trunkId) {
        var _this = this;
        this.rateCardsService.post_AttachTrunk(ratecardId, trunkId)
            .subscribe(function (resp) {
            console.log(resp.status);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Trunk Successfully attached to Ratecard.', 5000);
            }
            else {
            }
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    RateCardsAddTrunksComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    };
    RateCardsAddTrunksComponent.prototype.on_GridReady_trunk = function (params) {
        this.gridApiTrunk = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsAddTrunksComponent.prototype.on_GridReady_review = function (params) {
        this.gridApiReview = params.api;
        params.api.sizeColumnsToFit();
    };
    RateCardsAddTrunksComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country', width: 120,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name', width: 80,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    RateCardsAddTrunksComponent.prototype.createColumnsDefsTrunk = function () {
        return [
            {
                headerName: 'Choose Trunk', field: 'trunk_name', checkboxSelection: true,
            }
        ];
    };
    RateCardsAddTrunksComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'Ratecard Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Trunk Name', field: 'trunk_name',
            },
        ];
    };
    /*
        ~~~~~~~~~~ AG Grid Methods ~~~~~~~~~~
    */
    RateCardsAddTrunksComponent.prototype.onSelectionChangedTrunk = function (params) {
        var selectedRatecards = this.gridApi.getSelectedRows();
        var selectedTrunk = this.gridApiTrunk.getSelectedRows();
        this.gridApiReview.setRowData(this.processReviewTable(selectedRatecards, selectedTrunk));
    };
    RateCardsAddTrunksComponent.prototype.click_deselectAll = function () {
        this.gridApi.deselectAll();
        this.gridApiTrunk.deselectAll();
    };
    /*
        ~~~~~~~~~~ Data Processing ~~~~~~~~~~
    */
    RateCardsAddTrunksComponent.prototype.processReviewTable = function (selectedRatecards, selectedTrunk) {
        var reviewData = [];
        for (var i = 0; i < selectedRatecards.length; i++) {
            reviewData.push({
                ratecard_id: selectedRatecards[i].id,
                name: selectedRatecards[i].name,
                country: selectedRatecards[i].country,
                offer: selectedRatecards[i].offer,
                carrier_name: selectedRatecards[i].carrier_name,
                trunk_name: selectedTrunk[0].trunk_name,
                trunk_id: selectedTrunk[0].id
            });
        }
        return reviewData;
    };
    RateCardsAddTrunksComponent.prototype.processReviewTableToSubmit = function () {
        var finalRatecardToTrunkArr = [];
        this.gridApiReview.forEachNodeAfterFilterAndSort(function (rowNode) {
            finalRatecardToTrunkArr.push({
                ratecard_id: rowNode.data.ratecard_id,
                trunk_id: rowNode.data.trunk_id
            });
        });
        console.log(finalRatecardToTrunkArr);
        for (var i = 0; i < finalRatecardToTrunkArr.length; i++) {
            this.post_attachTrunksToRatecard(finalRatecardToTrunkArr[i].ratecard_id, finalRatecardToTrunkArr[i].trunk_id);
        }
    };
    RateCardsAddTrunksComponent.prototype.click_attachTrunks = function () {
        this.processReviewTableToSubmit();
        this.gridApiTrunk.deselectAll();
        this.gridApiReview.setRowData([]);
    };
    RateCardsAddTrunksComponent = __decorate([
        core_1.Component({
            selector: 'app-rate-cards-add-trunks',
            templateUrl: './rate-cards-add-trunks.component.html',
            styleUrls: ['./rate-cards-add-trunks.component.scss']
        }),
        __metadata("design:paramtypes", [rate_cards_api_service_1.RateCardsService,
            rate_cards_shared_service_1.RateCardsSharedService,
            trunks_api_service_1.TrunksService,
            nestedAgGrid_shared_service_1.NestedAgGridService,
            snackbar_shared_service_1.SnackbarSharedService])
    ], RateCardsAddTrunksComponent);
    return RateCardsAddTrunksComponent;
}());
exports.RateCardsAddTrunksComponent = RateCardsAddTrunksComponent;
//# sourceMappingURL=rate-cards-add-trunks.component.js.map