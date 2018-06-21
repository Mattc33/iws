"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SideNavComponent = /** @class */ (function () {
    function SideNavComponent() {
        // Nav expand/collaspe toggle
        this.isExpanded = true;
        this.isSideBarMini = false;
        // Nav children
        this.showNavChildrenCarrier = false;
        this.showNavChildrenRatecard = false;
        this.showNavChildrenCallplan = false;
        this.showNavChildrenLcr = false;
    }
    SideNavComponent.prototype.toggleSideNav = function () {
        this.isExpanded = !this.isExpanded;
        this.isSideBarMini = !this.isSideBarMini;
    };
    SideNavComponent.prototype.toggleExpandClass = function (params) {
        if (params === 'carrier') {
            this.showNavChildrenCarrier = !this.showNavChildrenCarrier;
            this.chevronRotate('.carrierChev');
        }
        if (params === 'ratecard') {
            this.showNavChildrenRatecard = !this.showNavChildrenRatecard;
            this.chevronRotate('.ratecardChev');
        }
        if (params === 'callplan') {
            this.showNavChildrenCallplan = !this.showNavChildrenCallplan;
            this.chevronRotate('.callplanChev');
        }
        if (params === 'lcr') {
            this.showNavChildrenLcr = !this.showNavChildrenLcr;
            this.chevronRotate('.lcrChev');
        }
    };
    SideNavComponent.prototype.chevronRotate = function (_el) {
        var icon = document.querySelector(_el);
        icon.classList.toggle('rotate');
    };
    SideNavComponent = __decorate([
        core_1.Component({
            selector: 'app-side-nav',
            templateUrl: './side-nav.component.html',
            styleUrls: ['./side-nav.component.scss'],
        })
    ], SideNavComponent);
    return SideNavComponent;
}());
exports.SideNavComponent = SideNavComponent;
//# sourceMappingURL=side-nav.component.js.map