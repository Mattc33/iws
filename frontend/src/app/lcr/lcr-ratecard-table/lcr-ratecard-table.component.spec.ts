import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcrRatecardTableComponent } from './lcr-ratecard-table.component';

describe('LcrRatecardTableComponent', () => {
  let component: LcrRatecardTableComponent;
  let fixture: ComponentFixture<LcrRatecardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcrRatecardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcrRatecardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
