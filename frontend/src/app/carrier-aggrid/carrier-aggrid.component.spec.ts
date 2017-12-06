import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierAggridComponent } from './carrier-aggrid.component';

describe('CarrierAggridComponent', () => {
  let component: CarrierAggridComponent;
  let fixture: ComponentFixture<CarrierAggridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierAggridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierAggridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
