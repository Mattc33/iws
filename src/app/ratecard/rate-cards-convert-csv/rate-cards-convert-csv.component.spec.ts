import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardsConvertCsvComponent } from './rate-cards-convert-csv.component';

describe('RateCardsConvertCsvComponent', () => {
  let component: RateCardsConvertCsvComponent;
  let fixture: ComponentFixture<RateCardsConvertCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCardsConvertCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardsConvertCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
