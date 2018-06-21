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
var api_settings_shared_service_1 = require("./../../services/global/api-settings.shared.service");
var RateCardsService = /** @class */ (function () {
    function RateCardsService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    RateCardsService.prototype.get_ratecard = function () {
        return this._http
            .get(this.url + 'ratecards')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.get_ratesInRatecard = function (ratecardId) {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId + '/rates')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.get_specificRatecard = function (ratecardId) {
        return this._http
            .get(this.url + 'ratecards/' + ratecardId)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.get_ratesByCountry = function (isoCode) {
        return this._http
            .get(this.url + 'carriers/ratecards/rates/' + isoCode)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.post_addRatecard = function (body) {
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.del_deleteRatecard = function (rowId) {
        return this._http
            .delete(this.url + 'ratecards/' + rowId)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.put_editRatecard = function (body, rowID) {
        return this._http
            .put(this.url + 'ratecards/' + rowID, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.post_AttachTrunk = function (ratecardId, trunkId) {
        var body = {};
        return this._http
            .post(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.del_DetachTrunk = function (ratecardId, trunkId) {
        var body = {};
        return this._http
            .delete(this.url + 'ratecards/' + ratecardId + '/trunks/' + trunkId, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.put_EditRates = function (ratesId, body) {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.put_EditTeleuDbRates = function (teleuDbRatesId, body) {
        return this._http
            .put(this.url + '/teleu/rate/' + teleuDbRatesId, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    RateCardsService.prototype.handleError = function (error) {
        console.error(error);
    };
    RateCardsService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            api_settings_shared_service_1.ApiSettingsSharedService])
    ], RateCardsService);
    return RateCardsService;
}());
exports.RateCardsService = RateCardsService;
//# sourceMappingURL=rate-cards.api.service.js.map