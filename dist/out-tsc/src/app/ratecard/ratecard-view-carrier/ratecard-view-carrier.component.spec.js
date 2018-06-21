"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var ratecard_view_carrier_component_1 = require("./ratecard-view-carrier.component");
describe('RatecardViewCarrierComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [ratecard_view_carrier_component_1.RatecardViewCarrierComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(ratecard_view_carrier_component_1.RatecardViewCarrierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=ratecard-view-carrier.component.spec.js.map