import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntdUploadAreaComponent } from './antd-upload-area.component';

describe('AntdUploadAreaComponent', () => {
  let component: AntdUploadAreaComponent;
  let fixture: ComponentFixture<AntdUploadAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntdUploadAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntdUploadAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
