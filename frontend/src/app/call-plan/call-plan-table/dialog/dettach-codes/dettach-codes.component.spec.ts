import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettachCodesComponent } from './dettach-codes.component';

describe('DettachCodesComponent', () => {
  let component: DettachCodesComponent;
  let fixture: ComponentFixture<DettachCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettachCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettachCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
