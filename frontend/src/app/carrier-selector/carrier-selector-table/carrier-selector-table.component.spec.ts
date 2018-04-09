import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierSelectorTableComponent } from './carrier-selector-table.component';

describe('CarrierSelectorTableComponent', () => {
  let component: CarrierSelectorTableComponent;
  let fixture: ComponentFixture<CarrierSelectorTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierSelectorTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierSelectorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
