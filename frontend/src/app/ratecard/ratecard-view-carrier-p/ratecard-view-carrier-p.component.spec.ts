import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatecardViewCarrierPComponent } from './ratecard-view-carrier-p.component';

describe('RatecardViewCarrierPComponent', () => {
  let component: RatecardViewCarrierPComponent;
  let fixture: ComponentFixture<RatecardViewCarrierPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatecardViewCarrierPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatecardViewCarrierPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
