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
var http_1 = require("@angular/http");
var operators_1 = require("rxjs/operators");
var api_settings_shared_service_1 = require("./../../shared/services/global/api-settings.shared.service");
var TrunksService = /** @class */ (function () {
    function TrunksService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.url = this._apiSettings.getUrl();
    }
    TrunksService.prototype.get_allTrunks = function () {
        return this._http
            .get(this.url + 'trunks')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    TrunksService.prototype.get_specificTrunk = function (trunkId) {
        return this._http
            .get(this.url + 'trunks/' + trunkId)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    TrunksService.prototype.post_addTrunk = function (body) {
        return this._http
            .post(this.url + 'trunks', body)
            .pipe(operators_1.catchError(this.handleError));
    };
    TrunksService.prototype.del_deleteTrunk = function (trunkId) {
        return this._http
            .delete(this.url + 'trunks/' + trunkId)
            .pipe(operators_1.catchError(this.handleError));
    };
    TrunksService.prototype.put_editTrunk = function (trunkId, body) {
        return this._http
            .put(this.url + 'trunks/' + trunkId, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    TrunksService.prototype.handleError = function (error) {
        console.error(error);
    };
    TrunksService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            api_settings_shared_service_1.ApiSettingsSharedService])
    ], TrunksService);
    return TrunksService;
}());
exports.TrunksService = TrunksService;
//# sourceMappingURL=trunks.api.service.js.map