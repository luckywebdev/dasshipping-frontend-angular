import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Mock_AccountDTO } from '../../constants';
import { DirectivesModule } from '../../directives.module';
import { UserService } from '../../providers/user/user.service';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule, HttpClientTestingModule,
        DirectivesModule],
      providers: [UserService, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    userService = fixture.debugElement.injector.get(
      UserService,
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should isAllowed call', () => {
    component['isAllowed']([]);
    expect(component['isAllowed']).toBeTruthy();
  });

  it('should isAllowed call with roles', () => {
    userService.user = Mock_AccountDTO;
    component['isAllowed']([1, 2]);
    expect(component['isAllowed']).toBeTruthy();
  });

  afterAll(() => {
    fixture.detectChanges();
    const elements = document.body.getElementsByClassName('.cdk-overlay-container');
    while (elements.length > 0) {
      elements[0].remove();
    }
    fixture.destroy();
  });
});
