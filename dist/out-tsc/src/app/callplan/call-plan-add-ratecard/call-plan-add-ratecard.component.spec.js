"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var call_plan_add_ratecard_component_1 = require("./call-plan-add-ratecard.component");
describe('CallPlanAddRatecardComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [call_plan_add_ratecard_component_1.CallPlanAddRatecardComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(call_plan_add_ratecard_component_1.CallPlanAddRatecardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=call-plan-add-ratecard.component.spec.js.map