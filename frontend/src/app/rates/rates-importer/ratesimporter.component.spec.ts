import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesimporterComponent } from './ratesimporter.component';

describe('RatesimporterComponent', () => {
  let component: RatesimporterComponent;
  let fixture: ComponentFixture<RatesimporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesimporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesimporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
