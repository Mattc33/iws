import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatecardImporterComponent } from './ratecard-importer.component';

describe('RatecardImporterComponent', () => {
  let component: RatecardImporterComponent;
  let fixture: ComponentFixture<RatecardImporterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatecardImporterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatecardImporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
