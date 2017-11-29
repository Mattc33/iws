import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierInfoComponent } from './carrier-info.component';

describe('CarrierInfoComponent', () => {
  let component: CarrierInfoComponent;
  let fixture: ComponentFixture<CarrierInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
