import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagFriendsDialogComponent } from './tag-friends-dialog.component';

describe('TagFriendsDialogComponent', () => {
  let component: TagFriendsDialogComponent;
  let fixture: ComponentFixture<TagFriendsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagFriendsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagFriendsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
