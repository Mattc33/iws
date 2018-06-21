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
var trunks_api_service_1 = require("./../../../services/trunks.api.service");
var trunks_shared_service_1 = require("./../../../services/trunks.shared.service");
var DeleteTrunksComponent = /** @class */ (function () {
    function DeleteTrunksComponent(dialogRef, data, trunksService, trunksSharedService) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.trunksService = trunksService;
        this.trunksSharedService = trunksSharedService;
    }
    DeleteTrunksComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.trunksSharedService.currentRowId.subscribe(function (data) { return _this.rowObj = data; });
    };
    DeleteTrunksComponent.prototype.click_delCarrier = function () {
        this.del_delTrunks();
        this.closeDialog();
    };
    DeleteTrunksComponent.prototype.del_delTrunks = function () {
        var rowId;
        for (var i = 0; i < this.rowObj.length; i++) {
            rowId = this.rowObj[i].id;
            this.trunksService.del_deleteTrunk(rowId)
                .subscribe(function (resp) { return console.log(resp); });
        }
    };
    DeleteTrunksComponent.prototype.closeDialog = function () {
        this.dialogRef.close();
    };
    DeleteTrunksComponent = __decorate([
        core_1.Component({
            selector: 'app-delete-trunks',
            templateUrl: './delete-trunks.component.html',
            styleUrls: ['./delete-trunks.component.scss'],
            providers: [trunks_api_service_1.TrunksService],
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [material_1.MatDialogRef, Object, trunks_api_service_1.TrunksService,
            trunks_shared_service_1.TrunksSharedService])
    ], DeleteTrunksComponent);
    return DeleteTrunksComponent;
}());
exports.DeleteTrunksComponent = DeleteTrunksComponent;
//# sourceMappingURL=delete-trunks.component.js.map