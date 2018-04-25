import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvConverterComponent } from './csv-converter.component';

describe('CsvConverterComponent', () => {
  let component: CsvConverterComponent;
  let fixture: ComponentFixture<CsvConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvConverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
