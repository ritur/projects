import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetsBundleComponent } from './edit-assets-bundle.component';

describe('EditAssetsBundleComponent', () => {
  let component: EditAssetsBundleComponent;
  let fixture: ComponentFixture<EditAssetsBundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAssetsBundleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAssetsBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
