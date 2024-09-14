import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkeditorWrapperComponent } from './ckeditor-wrapper.component';

describe('CkeditorWrapperComponent', () => {
  let component: CkeditorWrapperComponent;
  let fixture: ComponentFixture<CkeditorWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CkeditorWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CkeditorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
