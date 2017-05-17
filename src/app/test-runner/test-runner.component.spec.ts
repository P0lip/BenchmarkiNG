import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import { TestRunnerComponent } from './test-runner.component';
import {NativeService} from '../shared/native.service';
import {WorkerService} from '../shared/worker.service';
import {IframeService} from '../shared/iframe.service';
import {SettingsModule} from '../shared/settings/settings.module';
import {ResultsModule} from '../shared/results/results.module';
import {ScriptModule} from '../shared/script/script.module';

describe('TestRunnerComponent', () => {
  let component: TestRunnerComponent;
  let fixture: ComponentFixture<TestRunnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, SettingsModule, ScriptModule, ResultsModule],
      declarations: [TestRunnerComponent],
      providers: [WorkerService, NativeService, IframeService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lists references correctly', () => {
    expect(fixture.debugElement.nativeElement.querySelector('app-settings')).toBeTruthy();
  });

  it('creates blob correctly', () => {
    component.runInWorker = true;
    const blob: string = component.stringify('function(){}', '');
    expect(typeof blob === 'string').toBe(true);
    expect(blob.startsWith('blob:')).toBe(true);
  });

  it('stringify doesn\'t process empty characters', () => {
    expect(component.stringify(' ', '')).toBe('');
    expect(component.stringify('      ', '')).toBe('');
    expect(component.stringify('\n\n\r', '')).toBe('');
    expect(component.stringify(' \n \r', '')).toBe('');
  });

  it('should stop and log error on failure', (done) => {
    component.scripts[0] = {
      title: '',
      src: 'alert()',
    };

    expect(component.isRunning).toBe(false);
    expect(component.exception).toBe(null);
    component.execute();
    expect(component.isRunning).toBe(true);
    expect(component.exception).toBe(null);
    window.setTimeout(() => {
      expect(component.exception).not.toBe(null);
      expect(component.isRunning).toBe(false);
      done();
    }, 100);
  });

  it('adds new script', () => {
    const compiled = fixture.debugElement.nativeElement;
    const newTest = compiled.querySelector('#new-test');
    newTest.click();
    expect(component.scripts.length).toBe(2);
    expect(component.addScript()).toBe(3);
  });

  it('removes script', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.scripts.length = 0;
    expect(component.scripts.length).toBe(0);
    component.addScript();
    component.addScript();
    expect(component.scripts.length).toBe(2);
    expect(component.removeScript(1)).toBe(true);
    expect(component.scripts.length).toBe(1);
    expect(component.removeScript(0)).toBe(true);
    expect(component.scripts.length).toBe(1);
    expect(component.removeScript(1)).toBe(false);
    expect(component.scripts.length).toBe(1);
    component.addScript();
    const [, lastScript] = component.scripts;
    expect(component.removeScript(-1)).toBe(false);
    expect(component.scripts.length).toBe(2);
    expect(component.scripts[1]).toBe(lastScript);
    expect(component.removeScript(1)).toBe(true);
    component.addScript();
    expect(component.scripts.length).toBe(2);
    expect(component.scripts[0]).not.toBe(lastScript);

    spyOn(component, 'removeScript');
    const newTest = compiled.querySelector('script-zone button');
    newTest.click();
    expect(component.removeScript).toHaveBeenCalled();
  });
});

