import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierAggridTableComponent } from './carrier-aggrid-table.component';

describe('CarrierAggridTableComponent', () => {
  let component: CarrierAggridTableComponent;
  let fixture: ComponentFixture<CarrierAggridTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierAggridTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierAggridTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
