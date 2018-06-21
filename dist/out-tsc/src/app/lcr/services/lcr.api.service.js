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
var LCRService = /** @class */ (function () {
    function LCRService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    LCRService.prototype.get_allOffers = function () {
        return this._http
            .get(this.url + 'lcr/offers')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.get_specificOffer = function (carrier_id) {
        return this._http
            .get(this.url + '/lcr/offers/' + carrier_id)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.get_allCarriers = function () {
        return this._http
            .get(this.url + 'lcr/providers')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.get_allTrunks = function () {
        return this._http
            .get(this.url + 'lcr/trunks')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.get_allRatecards = function () {
        return this._http
            .get(this.url + 'lcr/ratecards')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.get_ratesInRatecard = function (ratecard_id) {
        return this._http
            .get(this.url + 'lcr/ratecards/' + ratecard_id + '/rates')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    LCRService.prototype.handleError = function (error) {
        console.error(error);
    };
    LCRService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            api_settings_shared_service_1.ApiSettingsSharedService])
    ], LCRService);
    return LCRService;
}());
exports.LCRService = LCRService;
//# sourceMappingURL=lcr.api.service.js.map