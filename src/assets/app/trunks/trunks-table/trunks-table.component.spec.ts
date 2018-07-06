import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrunksTableComponent } from './trunks-table.component';

describe('TrunksTableComponent', () => {
  let component: TrunksTableComponent;
  let fixture: ComponentFixture<TrunksTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrunksTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrunksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
