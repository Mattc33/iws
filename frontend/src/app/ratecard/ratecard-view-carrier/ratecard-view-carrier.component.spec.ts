import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatecardViewCarrierComponent } from './ratecard-view-carrier.component';

describe('RatecardViewCarrierComponent', () => {
  let component: RatecardViewCarrierComponent;
  let fixture: ComponentFixture<RatecardViewCarrierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatecardViewCarrierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatecardViewCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
