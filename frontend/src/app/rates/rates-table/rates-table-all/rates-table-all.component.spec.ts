import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesTableAllComponent } from './rates-table-all.component';

describe('RatesTableAllComponent', () => {
  let component: RatesTableAllComponent;
  let fixture: ComponentFixture<RatesTableAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesTableAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesTableAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
