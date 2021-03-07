import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingService } from '../../providers/loading/loading.service';
import { LoadingScreenComponent } from './loading-screen.component';

describe('LoadingScreenComponent', () => {
  let component: LoadingScreenComponent;
  let fixture: ComponentFixture<LoadingScreenComponent>;
  let loadingService: LoadingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingScreenComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingScreenComponent);
    component = fixture.componentInstance;
    loadingService = fixture.debugElement.injector.get(
      LoadingService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start loading', () => {
    loadingService.loading = true;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.loading).toBeTruthy();
  });

  it('should stop loading', () => {
    loadingService.loading = false;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.loading).toBeFalsy();
  });

  afterAll(() => {
    component.loading = false;
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
