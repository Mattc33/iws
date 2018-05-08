import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierProfileComponent } from './carrier-profile.component';

describe('CarrierProfileComponent', () => {
  let component: CarrierProfileComponent;
  let fixture: ComponentFixture<CarrierProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
