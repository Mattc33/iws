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
var importer_shared_service_1 = require("./importer.shared.service");
var api_settings_shared_service_1 = require("./../../../shared/services/global/api-settings.shared.service");
var ImporterService = /** @class */ (function () {
    function ImporterService(_http, _importer, _apiSettings) {
        this._http = _http;
        this._importer = _importer;
        this._apiSettings = _apiSettings;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    ImporterService.prototype.post_AddRateCard = function (body) {
        var _this = this;
        return this._http
            .post(this.url + 'ratecards/', body)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError), operators_1.tap(function (res) { _this._importer.changePostTableObj(res); }));
    };
    ImporterService.prototype.put_EditRates = function (ratesId, body) {
        return this._http
            .put(this.url + 'rates/' + ratesId, body)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    ImporterService.prototype.put_EditTeleUDatabase = function (teleuId, body) {
        return this._http
            .put(this.url + 'teleu/rate/' + teleuId, body)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    ImporterService.prototype.get_CarrierNames = function () {
        return this._http
            .get(this.url + 'carriers/')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    ImporterService.prototype.handleError = function (error) {
        console.error(error);
    };
    ImporterService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            importer_shared_service_1.ImporterSharedService,
            api_settings_shared_service_1.ApiSettingsSharedService])
    ], ImporterService);
    return ImporterService;
}());
exports.ImporterService = ImporterService;
//# sourceMappingURL=importer.api.service.js.map