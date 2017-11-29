import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierTableComponent } from './carrier-table.component';

describe('CarrierTableComponent', () => {
  let component: CarrierTableComponent;
  let fixture: ComponentFixture<CarrierTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
