import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchContainerGroupComponent } from './search-container-group.component';

describe('SearchContainerGroupComponent', () => {
  let component: SearchContainerGroupComponent;
  let fixture: ComponentFixture<SearchContainerGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchContainerGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchContainerGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
