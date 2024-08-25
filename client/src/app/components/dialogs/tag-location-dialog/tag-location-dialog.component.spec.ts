import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagLocationDialogComponent } from './tag-location-dialog.component';

describe('TagLocationDialogComponent', () => {
  let component: TagLocationDialogComponent;
  let fixture: ComponentFixture<TagLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagLocationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
