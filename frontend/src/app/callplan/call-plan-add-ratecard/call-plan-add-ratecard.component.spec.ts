import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanAddRatecardComponent } from './call-plan-add-ratecard.component';

describe('CallPlanAddRatecardComponent', () => {
  let component: CallPlanAddRatecardComponent;
  let fixture: ComponentFixture<CallPlanAddRatecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanAddRatecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanAddRatecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
