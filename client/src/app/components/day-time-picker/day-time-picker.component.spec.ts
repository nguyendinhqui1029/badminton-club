import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTimePickerComponent } from './day-time-picker.component';

describe('DayTimePickerComponent', () => {
  let component: DayTimePickerComponent;
  let fixture: ComponentFixture<DayTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayTimePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DayTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
