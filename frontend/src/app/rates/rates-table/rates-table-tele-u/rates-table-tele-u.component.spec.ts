import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatesTableTeleUComponent } from './rates-table-tele-u.component';

describe('RatesTableTeleUComponent', () => {
  let component: RatesTableTeleUComponent;
  let fixture: ComponentFixture<RatesTableTeleUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatesTableTeleUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatesTableTeleUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
