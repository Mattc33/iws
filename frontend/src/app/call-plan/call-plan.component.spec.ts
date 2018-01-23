import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanComponent } from './call-plan.component';

describe('CallPlanComponent', () => {
  let component: CallPlanComponent;
  let fixture: ComponentFixture<CallPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
