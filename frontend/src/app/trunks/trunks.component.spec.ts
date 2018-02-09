import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrunksComponent } from './trunks.component';

describe('TrunksComponent', () => {
  let component: TrunksComponent;
  let fixture: ComponentFixture<TrunksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrunksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
