import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardManagerComponent } from './rate-card-manager.component';

describe('RateCardManagerComponent', () => {
  let component: RateCardManagerComponent;
  let fixture: ComponentFixture<RateCardManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCardManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
