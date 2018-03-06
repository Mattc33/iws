import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImporterTableComponent } from './importer-table.component';

describe('ImporterTableComponent', () => {
  let component: ImporterTableComponent;
  let fixture: ComponentFixture<ImporterTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImporterTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImporterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
