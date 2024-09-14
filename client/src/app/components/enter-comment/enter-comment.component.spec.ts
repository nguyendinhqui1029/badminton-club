import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterCommentComponent } from './enter-comment.component';

describe('EnterCommentComponent', () => {
  let component: EnterCommentComponent;
  let fixture: ComponentFixture<EnterCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterCommentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnterCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
