import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanRateCardsComponent } from './call-plan-rate-cards.component';

describe('CallPlanRateCardsComponent', () => {
  let component: CallPlanRateCardsComponent;
  let fixture: ComponentFixture<CallPlanRateCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanRateCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanRateCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
