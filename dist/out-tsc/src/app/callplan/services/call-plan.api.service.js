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
var CallPlanService = /** @class */ (function () {
    function CallPlanService(_http, _apiSettings) {
        this._http = _http;
        this._apiSettings = _apiSettings;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
        this.url = this._apiSettings.getUrl();
    }
    CallPlanService.prototype.get_allCallplan = function () {
        return this._http
            .get(this.url + 'callplans/')
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError), operators_1.tap(function (res) { return console.log(res); }));
    };
    CallPlanService.prototype.get_specificCallplan = function (callplan_id) {
        return this._http
            .get(this.url + 'callplans/' + callplan_id)
            .pipe(operators_1.map(function (res) { return res.json(); }), operators_1.catchError(this.handleError));
    };
    CallPlanService.prototype.post_newCallPlan = function (body) {
        return this._http
            .post(this.url + 'callplans/', body, this.options)
            .pipe(operators_1.catchError(this.handleError));
    };
    CallPlanService.prototype.del_callPlan = function (callplan_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id)
            .pipe(operators_1.catchError(this.handleError));
    };
    CallPlanService.prototype.put_editCallPlan = function (body, callplan_id) {
        return this._http
            .put(this.url + 'callplans/' + callplan_id, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    // attach rate card to call plan
    CallPlanService.prototype.post_attachRateCard = function (callplan_id, ratecard_id, body) {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    // detach rate card from call plan
    CallPlanService.prototype.del_detachRateCard = function (callplan_id, ratecard_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/ratecards/' + ratecard_id)
            .pipe(operators_1.catchError(this.handleError));
    };
    // add new plan code from callplan
    CallPlanService.prototype.post_newPlanCode = function (callplan_id, body) {
        return this._http
            .post(this.url + 'callplans/' + callplan_id + '/code', body)
            .pipe(operators_1.catchError(this.handleError));
    };
    // update plan code from callplan
    CallPlanService.prototype.put_editPlanCode = function (callplan_id, code_id, body) {
        return this._http
            .put(this.url + 'callplans/' + callplan_id + '/code/' + code_id, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    // delete plan code from callplan
    CallPlanService.prototype.del_planCode = function (callplan_id, code_id) {
        return this._http
            .delete(this.url + 'callplans/' + callplan_id + '/code/' + code_id)
            .pipe(operators_1.catchError(this.handleError));
    };
    /*
        ~~~~~~~~~~ LCR ~~~~~~~~~~
    */
    CallPlanService.prototype.post_callplanToLCR = function (callplan_id, body) {
        return this._http
            .post(this.url + 'lcr/callplans/' + callplan_id, body)
            .pipe(operators_1.catchError(this.handleError));
    };
    CallPlanService.prototype.handleError = function (error) {
        console.error(error);
    };
    CallPlanService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            api_settings_shared_service_1.ApiSettingsSharedService])
    ], CallPlanService);
    return CallPlanService;
}());
exports.CallPlanService = CallPlanService;
//# sourceMappingURL=call-plan.api.service.js.map