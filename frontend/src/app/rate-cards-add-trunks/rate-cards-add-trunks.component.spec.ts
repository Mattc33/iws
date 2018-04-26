import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardsAddTrunksComponent } from './rate-cards-add-trunks.component';

describe('RateCardsAddTrunksComponent', () => {
  let component: RateCardsAddTrunksComponent;
  let fixture: ComponentFixture<RateCardsAddTrunksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCardsAddTrunksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardsAddTrunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
