import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierSelectorComponent } from './carrier-selector.component';

describe('CarrierSelectorComponent', () => {
  let component: CarrierSelectorComponent;
  let fixture: ComponentFixture<CarrierSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
