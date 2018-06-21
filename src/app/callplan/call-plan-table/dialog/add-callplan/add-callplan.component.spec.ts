import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCallplanComponent } from './add-callplan.component';

describe('AddCallplanComponent', () => {
  let component: AddCallplanComponent;
  let fixture: ComponentFixture<AddCallplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCallplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCallplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
