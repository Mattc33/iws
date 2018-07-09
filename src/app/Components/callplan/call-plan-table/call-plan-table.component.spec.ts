import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanTableComponent } from './call-plan-table.component';

describe('CallPlanTableComponent', () => {
  let component: CallPlanTableComponent;
  let fixture: ComponentFixture<CallPlanTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
