import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelWrapperComponent } from './label-wrapper.component';

describe('LabelWrapperComponent', () => {
  let component: LabelWrapperComponent;
  let fixture: ComponentFixture<LabelWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabelWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
