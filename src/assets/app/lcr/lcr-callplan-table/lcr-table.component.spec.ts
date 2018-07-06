import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcrTableComponent } from './lcr-table.component';

describe('LcrTableComponent', () => {
  let component: LcrTableComponent;
  let fixture: ComponentFixture<LcrTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcrTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
