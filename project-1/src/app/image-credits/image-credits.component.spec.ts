import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCreditsComponent } from './image-credits.component';

describe('ImageCreditsComponent', () => {
  let component: ImageCreditsComponent;
  let fixture: ComponentFixture<ImageCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageCreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
