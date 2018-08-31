import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardPreviewerSidebarComponent } from './rate-card-previewer-sidebar.component';

describe('RateCardPreviewerSidebarComponent', () => {
  let component: RateCardPreviewerSidebarComponent;
  let fixture: ComponentFixture<RateCardPreviewerSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCardPreviewerSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardPreviewerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
