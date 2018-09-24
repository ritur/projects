import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBundleComponent } from './assets-bundle.component';

describe('AssetsBundleComponent', () => {
  let component: AssetsBundleComponent;
  let fixture: ComponentFixture<AssetsBundleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsBundleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsBundleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
