import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierUiComponent } from './carrier-ui.component';

describe('CarrierUiComponent', () => {
  let component: CarrierUiComponent;
  let fixture: ComponentFixture<CarrierUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
