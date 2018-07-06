import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRateCardComponent } from './add-rate-card.component';

describe('AddRateCardComponent', () => {
  let component: AddRateCardComponent;
  let fixture: ComponentFixture<AddRateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
