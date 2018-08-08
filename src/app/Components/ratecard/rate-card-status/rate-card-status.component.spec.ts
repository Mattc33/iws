import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardStatusComponent } from './rate-card-status.component';

describe('RateCardStatusComponent', () => {
  let component: RateCardStatusComponent;
  let fixture: ComponentFixture<RateCardStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCardStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
