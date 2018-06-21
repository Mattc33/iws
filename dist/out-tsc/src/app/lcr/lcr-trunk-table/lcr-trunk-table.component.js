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
var lcr_api_service_1 = require("./../services/lcr.api.service");
var lcr_shared_service_1 = require("./../services/lcr.shared.service");
var LcrTrunkTableComponent = /** @class */ (function () {
    function LcrTrunkTableComponent(lcrService, lcrSharedService) {
        this.lcrService = lcrService;
        this.lcrSharedService = lcrSharedService;
        this.columnDefs = this.createColumnDefs();
    }
    LcrTrunkTableComponent.prototype.ngOnInit = function () {
        this.get_allTrunks();
    };
    /*
        ~~~~~~~~~~ Ratecard API services ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.get_allTrunks = function () {
        var _this = this;
        this.lcrService.get_allTrunks()
            .subscribe(function (data) {
            _this.get_allProviders();
            _this.trunkData = _this.lcrSharedService.get_rowDataWithProviderName(data, _this.providerData);
        });
    };
    LcrTrunkTableComponent.prototype.get_allProviders = function () {
        var _this = this;
        this.lcrSharedService.current_providerJson.subscribe(function (data) { _this.providerData = data; });
    };
    /*
        ~~~~~~~~~~ AG Grid Initiation ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.on_gridReady = function (params) {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
    };
    LcrTrunkTableComponent.prototype.createColumnDefs = function () {
        return [
            {
                headerName: 'Id', field: 'id', width: 100,
            },
            {
                headerName: 'Cloudonix Id', field: 'cx_trunk_id',
            },
            {
                headerName: 'Provider', field: 'provider_name',
            },
            {
                headerName: 'Active?', field: 'active',
            },
        ];
    };
    /*
        ~~~~~~~~~~ Grid UI Interctions ~~~~~~~~~~
    */
    LcrTrunkTableComponent.prototype.gridSizeChanged = function (params) {
        params.api.sizeColumnsToFit();
    };
    LcrTrunkTableComponent = __decorate([
        core_1.Component({
            selector: 'app-lcr-trunk-table',
            templateUrl: './lcr-trunk-table.component.html',
            styleUrls: ['./lcr-trunk-table.component.scss']
        }),
        __metadata("design:paramtypes", [lcr_api_service_1.LCRService,
            lcr_shared_service_1.LCRSharedService])
    ], LcrTrunkTableComponent);
    return LcrTrunkTableComponent;
}());
exports.LcrTrunkTableComponent = LcrTrunkTableComponent;
//# sourceMappingURL=lcr-trunk-table.component.js.map