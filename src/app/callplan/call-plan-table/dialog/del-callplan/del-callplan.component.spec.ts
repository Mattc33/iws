import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelCallplanComponent } from './del-callplan.component';

describe('DelCallplanComponent', () => {
  let component: DelCallplanComponent;
  let fixture: ComponentFixture<DelCallplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelCallplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelCallplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
