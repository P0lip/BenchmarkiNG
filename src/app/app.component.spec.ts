import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {TestRunnerComponent} from './test-runner/test-runner.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NativeService} from './shared/native.service';
import {WorkerService} from './shared/worker.service';
import {SettingsComponent} from './shared/settings/settings.component';
import {ScriptComponent} from 'app/shared/script/script.component';
import {APP_BASE_HREF} from '@angular/common';
import {ResultsComponent} from './shared/results/results.component';
import {IframeService} from './shared/iframe.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        CommonModule,
      ],
      declarations: [
        AppComponent,
        TestRunnerComponent,
        SettingsComponent,
        ScriptComponent,
        ResultsComponent,
      ],
      providers: [
        WorkerService,
        NativeService,
        IframeService,
        {provide: APP_BASE_HREF, useValue: '/' },
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
