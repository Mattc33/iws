import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrunksComponent } from './add-trunks.component';

describe('AddTrunksComponent', () => {
  let component: AddTrunksComponent;
  let fixture: ComponentFixture<AddTrunksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTrunksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTrunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
