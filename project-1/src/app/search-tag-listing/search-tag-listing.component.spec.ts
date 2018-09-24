import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTagListingComponent } from './search-tag-listing.component';

describe('SearchTagListingComponent', () => {
  let component: SearchTagListingComponent;
  let fixture: ComponentFixture<SearchTagListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTagListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTagListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
