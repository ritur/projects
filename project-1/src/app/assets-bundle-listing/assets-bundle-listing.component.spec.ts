import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBundleListingComponent } from './assets-bundle-listing.component';

describe('AssetsBundleListingComponent', () => {
  let component: AssetsBundleListingComponent;
  let fixture: ComponentFixture<AssetsBundleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsBundleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsBundleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
