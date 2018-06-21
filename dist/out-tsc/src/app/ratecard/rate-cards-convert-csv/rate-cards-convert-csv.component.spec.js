"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var rate_cards_convert_csv_component_1 = require("./rate-cards-convert-csv.component");
describe('RateCardsConvertCsvComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [rate_cards_convert_csv_component_1.RateCardsConvertCsvComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(rate_cards_convert_csv_component_1.RateCardsConvertCsvComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=rate-cards-convert-csv.component.spec.js.map