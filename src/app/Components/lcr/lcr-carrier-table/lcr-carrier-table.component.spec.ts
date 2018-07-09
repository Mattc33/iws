import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcrCarrierTableComponent } from './lcr-carrier-table.component';

describe('LcrCarrierTableComponent', () => {
  let component: LcrCarrierTableComponent;
  let fixture: ComponentFixture<LcrCarrierTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcrCarrierTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcrCarrierTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
