import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {WorkerService} from '../shared/worker.service';
import {IframeService} from '../shared/iframe.service';
import {NativeService} from '../shared/native.service';
import {SettingsEvent} from '../shared/settings/settings.component';
import { helpers as natives } from '../utils/natives';
import {ScriptChange} from '../shared/script/script.component';
import {Result} from '../shared/results/results.component';

@Component({
  selector: 'app-test-runner',
  templateUrl: './test-runner.component.html',
  styleUrls: ['./test-runner.component.css']
})
export class TestRunnerComponent implements OnInit {
  private settings: Map<string, SettingsEvent> = new Map<string, SettingsEvent>();
  private stripRegex = /[^\n\r\s]/g;
  iterations = 100;
  runInWorker = true;
  isRunning = false;
  exception = null;

  @ViewChild('script') script: ElementRef;
  @Input() context: Object;
  @Input() scripts: ScriptChange[] = [{ title: '', src: '[2].forEach(() => {})' }];
  @Input() results: Result[] = [];

  constructor(private worker: WorkerService, private native: NativeService, private iframe: IframeService) { }

  ngOnInit() {
  }

  listReferences(): SettingsEvent[] {
    return Array.from(this.settings)
      .filter(([, { checked }]) => checked === true)
      .map(([, event]) => event);
  }

  execute() {
    const scripts = this.scripts.slice();
    const references = this.listReferences();
    this.stop(); // just in case
    this.isRunning = true;
    this.exception = null;
    const type = this.runInWorker ? 'worker' : 'iframe';
    const service = this.runInWorker ? this.worker : this.iframe;
    while (this.results.pop());
    (function benchmark() {
      if (scripts.length === 0) {
        this.stop();
        return;
      }

      const { src, title } = scripts.shift();
      const spawned = Reflect.apply(service.spawn, service, [this.stringify(src, this.native.inject(type, references))]);
      if (spawned === false) {
        this.stop();
        return;
      }

      this.worker.on('error', (ex) => {
        this.stop();
        this.exception = ex.message;
      });

      this.worker.on('end', ({ time, iterations }) => {
        this.results.push({
          title,
          src,
          time,
          iterations,
        });

        Reflect.apply(service.terminate, service, []);
        benchmark.call(this);
      });
    }).call(this);
  }

  addScript(): number {
    return this.scripts.push({
      title: '',
      src: '',
    });
  }

  removeScript(index: number): boolean {
    if (index >= 0 && index < this.scripts.length) {
      this.scripts.splice(index, 1);
      if (this.scripts.length === 0) {
        this.addScript();
      }

      return true;
    }

    return false;
  }

  stop() {
    if (this.runInWorker) {
      this.worker.terminate();
    } else {
      this.iframe.terminate();
    }

    this.isRunning = false;
  }

  handleChange(event: SettingsEvent) {
    this.settings.set(event.id, event);
    const context = {};
    this.listReferences().forEach(({ referencedAs, creator, getter }) => {
      context[referencedAs] = getter ? natives[getter][creator] : natives[creator]();
      if (Array.isArray(context[referencedAs])) {
        context[referencedAs].length = 0;
      } else if (typeof context[referencedAs] === 'object') {
        context[referencedAs] = {};
      }
    });

    this.context = context;
  }

  handleScript(index, event: ScriptChange): boolean {
    if (this.scripts[index] !== undefined) {
      Object.assign(this.scripts[index], event);
      return true;
    }

    return false;
  }

  stringify(src: string, inject: string): string {
    if (typeof src !== 'string' || this.stripRegex.test(src) === false) {
      return '';
    }

    const code = `
      ${inject};
      const start = performance.now();
      for (var i = 0; i < ${this.iterations}; i++) {
        ${src.replace(/^;*/, '')}
      }
      const end = performance.now() - start;
      const result = {
        time: end,
        iterations: ${this.iterations},
      };
      if (${this.runInWorker}) {
        self.postMessage({ event: 'end', transfer: result });
      } else {
      }
    `;
    return this.runInWorker ? URL.createObjectURL(new Blob([code], { type: 'application/javascript' })) : code;
  }
}
