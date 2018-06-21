import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelCarrierProfileDialogComponent } from './del-carrier-profile-dialog.component';

describe('DelCarrierProfileDialogComponent', () => {
  let component: DelCarrierProfileDialogComponent;
  let fixture: ComponentFixture<DelCarrierProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelCarrierProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelCarrierProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
