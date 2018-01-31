import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanCodesComponent } from './call-plan-codes.component';

describe('CallPlanCodesComponent', () => {
  let component: CallPlanCodesComponent;
  let fixture: ComponentFixture<CallPlanCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
