import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettachRatecardsComponent } from './dettach-ratecards.component';

describe('DettachRatecardsComponent', () => {
  let component: DettachRatecardsComponent;
  let fixture: ComponentFixture<DettachRatecardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettachRatecardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettachRatecardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
