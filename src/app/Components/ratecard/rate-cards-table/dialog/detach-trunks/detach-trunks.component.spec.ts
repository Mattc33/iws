import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetachTrunksComponent } from './detach-trunks.component';

describe('DetachTrunksComponent', () => {
  let component: DetachTrunksComponent;
  let fixture: ComponentFixture<DetachTrunksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetachTrunksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetachTrunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
