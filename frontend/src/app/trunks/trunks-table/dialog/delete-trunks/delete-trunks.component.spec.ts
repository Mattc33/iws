import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTrunksComponent } from './delete-trunks.component';

describe('DeleteTrunksComponent', () => {
  let component: DeleteTrunksComponent;
  let fixture: ComponentFixture<DeleteTrunksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTrunksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTrunksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
