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
var call_plan_api_service_1 = require("./../services/call-plan.api.service");
var call_plan_shared_service_1 = require("./../services/call-plan.shared.service");
var rate_cards_api_service_1 = require("./../../shared/api-services/ratecard/rate-cards.api.service");
var nestedAgGrid_shared_service_1 = require("./../../shared/services/global/nestedAgGrid.shared.service");
var snackbar_shared_service_1 = require("./../../shared/services/global/snackbar.shared.service");
var buttonStates_shared_service_1 = require("./../../shared/services/global/buttonStates.shared.service");
var CallPlanAddRatecardComponent = /** @class */ (function () {
    function CallPlanAddRatecardComponent(callPlanService, callPlanSharedService, rateCardsService, nestedAgGridService, snackbarSharedService, toggleButtonStateService) {
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        this.snackbarSharedService = snackbarSharedService;
        this.toggleButtonStateService = toggleButtonStateService;
        // AG grid UI props
        this.rowSelectionS = 'single';
        this.rowSelectionM = 'multiple';
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefsCallplan = this.createColumnDefsCallPlan();
        this.columnDefsRatecard = this.createColumnDefsRatecard();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    CallPlanAddRatecardComponent.prototype.ngOnInit = function () {
        this.get_CallPlans();
        this.get_RateCards();
    };
    // ================================================================================
    // API Service
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.get_CallPlans = function () {
        var _this = this;
        this.callPlanService.get_allCallplan().subscribe(function (data) { _this.rowDataCallplan = data; });
    };
    CallPlanAddRatecardComponent.prototype.get_RateCards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) { _this.rowDataRatecard = _this.nestedAgGridService.formatDataToNestedArr(data); });
    };
    CallPlanAddRatecardComponent.prototype.post_attachRateCard = function (callplanId, ratecardId, body) {
        var _this = this;
        this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
            .subscribe(function (resp) {
            console.log(resp);
            if (resp.status === 200) {
                _this.snackbarSharedService.snackbar_success('Ratecard attached successful.', 2000);
            }
        }, function (error) {
            console.log(error);
            _this.snackbarSharedService.snackbar_error('Ratecard failed to attach.', 2000);
        });
    };
    // ================================================================================
    // AG Grid Init
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.on_GridReady_CallPlan = function (params) {
        this.gridApiCallPlan = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.on_GridReady_Ratecard = function (params) {
        this.gridApiRatecard = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.on_GridReady_Review = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsCallPlan = function () {
        return [
            {
                headerName: 'Call Plan', field: 'title',
                checkboxSelection: true,
            }
        ];
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsRatecard = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300,
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
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    CallPlanAddRatecardComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'ID', field: 'id', width: 80,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Ratecard Name', field: 'name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Country', field: 'country',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Offer', field: 'offer', width: 100,
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Carrier', field: 'carrier_name',
                cellStyle: { 'border-right': '1px solid #E0E0E0' },
            },
            {
                headerName: 'Priority', field: 'priority', editable: true,
            }
        ];
    };
    // ================================================================================
    // AG Grid UI events
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.onGridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    CallPlanAddRatecardComponent.prototype.resetAttachRatecardForm = function () {
        this.gridApiCallPlan.deselectAll();
        this.gridApiRatecard.deselectAll();
        this.gridApiDetails.setRowData([]);
    };
    CallPlanAddRatecardComponent.prototype.onSelectionChanged = function () {
        this.gridApiDetails.setRowData(this.generateDetailsRowData());
        this.gridSelectionStatus = this.generateDetailsRowData().length;
    };
    CallPlanAddRatecardComponent.prototype.handleSliderChange = function (params) {
        var currentSliderValue = params.value;
        this.currentSliderValue = currentSliderValue;
        this.updateDetailGridData(currentSliderValue);
    };
    CallPlanAddRatecardComponent.prototype.click_attachRatecard = function () {
        this.generateApiService();
        this.gridApiRatecard.deselectAll();
        this.gridApiDetails.setRowData([]);
    };
    // ================================================================================
    // UI States
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.toggleButtonStates = function () {
        return this.toggleButtonStateService.toggleButtonStates(this.gridSelectionStatus);
    };
    CallPlanAddRatecardComponent.prototype.updateDetailGridData = function (currentSliderValue) {
        var itemsToUpdate = [];
        this.gridApiDetails.forEachNodeAfterFilterAndSort(function (rowNode) {
            var data = rowNode.data;
            data.priority = currentSliderValue;
            itemsToUpdate.push(data);
        });
        this.gridApiDetails.updateRowData({ update: itemsToUpdate });
    };
    // ================================================================================
    // AG Grid Fetch Data
    // ================================================================================
    CallPlanAddRatecardComponent.prototype.getSelectedCallPlanData = function () {
        return this.gridApiCallPlan.getSelectedRows();
    };
    CallPlanAddRatecardComponent.prototype.getSelectedRatecardData = function () {
        return this.gridApiRatecard.getSelectedRows();
    };
    CallPlanAddRatecardComponent.prototype.getSelectedDetailsData = function (num) {
        return this.gridApiDetails.getRowNode(num);
    };
    CallPlanAddRatecardComponent.prototype.generateDetailsRowData = function () {
        var ratecardData = this.getSelectedRatecardData();
        var detailsRowData = [];
        for (var i = 0; i < ratecardData.length; i++) {
            detailsRowData.push({
                id: ratecardData[i].id,
                name: ratecardData[i].name,
                country: ratecardData[i].country,
                offer: ratecardData[i].offer,
                carrier_name: ratecardData[i].carrier_name,
                priority: 1
            });
        }
        return detailsRowData;
    };
    CallPlanAddRatecardComponent.prototype.generateApiService = function () {
        var callplanId = this.getSelectedCallPlanData()[0].id;
        var detailTableLen = this.gridApiDetails.paginationGetRowCount();
        for (var i = 0; i < detailTableLen; i++) {
            var ratecardId = this.getSelectedDetailsData("" + i).data.id;
            var body = { priority: this.getSelectedDetailsData("" + i).data.priority };
            this.post_attachRateCard(callplanId, ratecardId, body);
        }
    };
    CallPlanAddRatecardComponent = __decorate([
        core_1.Component({
            selector: 'app-call-plan-add-ratecard',
            templateUrl: './call-plan-add-ratecard.component.html',
            styleUrls: ['./call-plan-add-ratecard.component.scss']
        }),
        __metadata("design:paramtypes", [call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            rate_cards_api_service_1.RateCardsService,
            nestedAgGrid_shared_service_1.NestedAgGridService,
            snackbar_shared_service_1.SnackbarSharedService,
            buttonStates_shared_service_1.ToggleButtonStateService])
    ], CallPlanAddRatecardComponent);
    return CallPlanAddRatecardComponent;
}());
exports.CallPlanAddRatecardComponent = CallPlanAddRatecardComponent;
//# sourceMappingURL=call-plan-add-ratecard.component.js.map