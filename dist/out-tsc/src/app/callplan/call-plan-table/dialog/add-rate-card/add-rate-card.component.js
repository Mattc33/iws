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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var nestedAgGrid_shared_service_1 = require("./../../../../shared/services/global/nestedAgGrid.shared.service");
var call_plan_api_service_1 = require("../../../services/call-plan.api.service");
var call_plan_shared_service_1 = require("./../../../services/call-plan.shared.service");
var rate_cards_api_service_1 = require("./../../../../shared/api-services/ratecard/rate-cards.api.service");
var AddRateCardComponent = /** @class */ (function () {
    function AddRateCardComponent(dialogRef, callplanTitle, callPlanService, callPlanSharedService, rateCardsService, nestedAgGridService) {
        this.dialogRef = dialogRef;
        this.callplanTitle = callplanTitle;
        this.callPlanService = callPlanService;
        this.callPlanSharedService = callPlanSharedService;
        this.rateCardsService = rateCardsService;
        this.nestedAgGridService = nestedAgGridService;
        // UI Props
        this.buttonToggleBoolean = true;
        this.getNodeChildDetails = this.nestedAgGridService.returnSetGroups();
        this.columnDefs = this.createColumnDefs();
        this.columnDefsReview = this.createColumnDefsReview();
    }
    AddRateCardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_RateCards();
        this.callPlanSharedService.currentRowAll.subscribe(function (data) { return _this.currentRowId = data; });
    };
    /*
        ~~~~~~~~~~ Call API services ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.get_RateCards = function () {
        var _this = this;
        this.rateCardsService.get_ratecard().subscribe(function (data) {
            _this.rowData = _this.nestedAgGridService.formatDataToNestedArr(data);
        }, function (error) { console.log(error); });
    };
    AddRateCardComponent.prototype.post_attachRateCard = function () {
        var callplanId = this.currentRowId;
        var selectedRows = this.gridApi.getSelectedRows();
        for (var i = 0; i < selectedRows.length; i++) {
            var ratecardId = selectedRows[i].id;
            var body = {
                priority: selectedRows[i].priority
            };
            this.callPlanService.post_attachRateCard(callplanId, ratecardId, body)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.on_GridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        this.rowSelection = 'multiple';
    };
    AddRateCardComponent.prototype.on_GridReady_Review = function (params) {
        this.gridApiDetails = params.api;
        params.api.sizeColumnsToFit();
    };
    AddRateCardComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Ratecard Group', field: 'ratecard_bundle', checkboxSelection: true,
                cellRenderer: 'agGroupCellRenderer', width: 300
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', hide: true,
            }
        ];
    };
    AddRateCardComponent.prototype.createColumnDefsReview = function () {
        return [
            {
                headerName: 'ID', field: 'id',
            },
            {
                headerName: 'Ratecard Name', field: 'ratecard_bundle',
            },
            {
                headerName: 'Country', field: 'country'
            },
            {
                headerName: 'Offer', field: 'offer'
            },
            {
                headerName: 'Carrier', field: 'carrier_name'
            },
            {
                headerName: 'Priority', field: 'priority', editable: true
            }
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.aggrid_gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    AddRateCardComponent.prototype.onSelectionChanged = function () {
        this.gridApiDetails.setRowData([]);
        var selectedRow = this.gridApi.getSelectedRows();
        this.gridApiDetails.setRowData(selectedRow);
    };
    AddRateCardComponent.prototype.deselectAll = function () {
        this.gridApi.deselectAll();
    };
    /*
        ~~~~~~~~~~ UI Interactions ~~~~~~~~~~
    */
    AddRateCardComponent.prototype.handleSliderChange = function (params) {
        var currentSliderValue = params.value;
        this.currentSliderValue = currentSliderValue;
        this.updateDetailGridData(currentSliderValue);
    };
    AddRateCardComponent.prototype.updateDetailGridData = function (currentSliderValue) {
        var itemsToUpdate = [];
        this.gridApiDetails.forEachNodeAfterFilterAndSort(function (rowNode) {
            var data = rowNode.data;
            data.priority = currentSliderValue;
            itemsToUpdate.push(data);
        });
        this.gridApiDetails.updateRowData({ update: itemsToUpdate });
        this.gridApi.updateRowData({ update: itemsToUpdate });
    };
    AddRateCardComponent.prototype.rowSelected = function () {
        this.gridSelectionStatus = this.gridApi.getSelectedNodes().length;
    };
    AddRateCardComponent.prototype.toggleButtonStates = function () {
        if (this.gridSelectionStatus > 0) {
            this.buttonToggleBoolean = false;
        }
        else {
            this.buttonToggleBoolean = true;
        }
        return this.buttonToggleBoolean;
    };
    AddRateCardComponent.prototype.click_attachRatecard = function () {
        this.post_attachRateCard();
        this.closeDialog();
    };
    AddRateCardComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    AddRateCardComponent = __decorate([
        core_1.Component({
            selector: 'app-add-rate-card',
            templateUrl: './add-rate-card.component.html',
            styleUrls: ['./add-rate-card.component.scss']
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, call_plan_api_service_1.CallPlanService,
            call_plan_shared_service_1.CallPlanSharedService,
            rate_cards_api_service_1.RateCardsService,
            nestedAgGrid_shared_service_1.NestedAgGridService])
    ], AddRateCardComponent);
    return AddRateCardComponent;
}());
exports.AddRateCardComponent = AddRateCardComponent;
//# sourceMappingURL=add-rate-card.component.js.map