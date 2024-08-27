import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFeelingDialogComponent } from './tag-feeling-dialog.component';

describe('TagFeelingDialogComponent', () => {
  let component: TagFeelingDialogComponent;
  let fixture: ComponentFixture<TagFeelingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagFeelingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagFeelingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
