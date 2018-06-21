import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallPlanAddCodeComponent } from './call-plan-add-code.component';

describe('CallPlanAddCodeComponent', () => {
  let component: CallPlanAddCodeComponent;
  let fixture: ComponentFixture<CallPlanAddCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallPlanAddCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallPlanAddCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
