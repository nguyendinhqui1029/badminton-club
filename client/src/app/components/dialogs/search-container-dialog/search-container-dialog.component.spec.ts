import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContainerDialogComponent } from './search-container-dialog.component';

describe('SearchContainerDialogComponent', () => {
  let component: SearchContainerDialogComponent;
  let fixture: ComponentFixture<SearchContainerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchContainerDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchContainerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
