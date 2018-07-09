import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcrTrunkTableComponent } from './lcr-trunk-table.component';

describe('LcrTrunkTableComponent', () => {
  let component: LcrTrunkTableComponent;
  let fixture: ComponentFixture<LcrTrunkTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcrTrunkTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcrTrunkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
