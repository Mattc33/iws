import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandCollaspeComponent } from './expand-collaspe.component';

describe('ExpandCollaspeComponent', () => {
  let component: ExpandCollaspeComponent;
  let fixture: ComponentFixture<ExpandCollaspeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandCollaspeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandCollaspeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
