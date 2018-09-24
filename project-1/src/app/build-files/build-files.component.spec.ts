import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildFilesComponent } from './build-files.component';

describe('BuildFilesComponent', () => {
  let component: BuildFilesComponent;
  let fixture: ComponentFixture<BuildFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
