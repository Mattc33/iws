import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarrierProfileDialogComponent } from './add-carrier-profile-dialog.component';

describe('AddCarrierProfileDialogComponent', () => {
  let component: AddCarrierProfileDialogComponent;
  let fixture: ComponentFixture<AddCarrierProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCarrierProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarrierProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
