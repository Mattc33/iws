import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRatesComponent } from './delete-rates.component';

describe('DeleteRatesComponent', () => {
  let component: DeleteRatesComponent;
  let fixture: ComponentFixture<DeleteRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
