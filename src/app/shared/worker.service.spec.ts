import { TestBed, inject } from '@angular/core/testing';
import { WorkerService } from './worker.service';

describe('WorkerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkerService]
    });
  });

  it('should be created', inject([WorkerService], (service: WorkerService) => {
    expect(service).toBeTruthy();
  }));

  it('handles spawn failure', inject([WorkerService], (service: WorkerService) => {
    const original = Object.getOwnPropertyDescriptor(window, 'Worker');
    Object.defineProperty(window, 'Worker', { configurable: true, value: null });
    expect(service.spawn('d')).toBe(false);
    Object.defineProperty(window, 'Worker', original);
  }));

  it('should not spawn when empty url/blob', inject([WorkerService], (service: WorkerService) => {
    expect(service.spawn('')).toBe(false);
    expect(service.spawn('  ')).toBe(false);
    expect(service.spawn('\n')).toBe(false);
  }));

  it('sends and receives events', (done: any) => inject([WorkerService], (service: WorkerService) => {
    const code = `
      self.onmessage = function (msg) {
        if (Array.isArray(msg.data.transfer) && msg.data.event === 'ping') {
          self.postMessage({ event: 'pong', transfer: msg.data.transfer });
        }
      };
    `;

    expect(service.spawn(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })))).toBe(true);
    const data = [2, 4, 5];
    service.on('pong', transfer => {
      expect(transfer).toEqual(data);
      done();
    });

    service.postMessage({ event: 'ping', transfer: data });
  })());

  it('receives error events', (done: any) => inject([WorkerService], (service: WorkerService) => {
    const code = `
      alert();
    `;

    expect(service.spawn(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })))).toBe(true);
    service.on('error', () => {
      done();
    });
  })());

  it('terminates properly', (done: any) => inject([WorkerService], (service: WorkerService) => {
    const code = `
      self.postMessage({ event: 'test', transfer: [2] });
      self.setTimeout(() => self.postMessage({ event: 'test2', transfer: '' }), 250);
    `;

    expect(service.spawn(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })))).toBe(true);
    let triggered = false;
    service.on('test2', () => {
      triggered = true;
    });

    service.on('test', function () {
      expect(service.terminate()).toBe(true);
      setTimeout(() => {
        expect(triggered).toBe(false);
        done();
      }, 500);
    });
  })());

  it('is able to stop receiving events', (done: any) => inject([WorkerService], (service: WorkerService) => {
    const code = `
      self.postMessage({ event: 'off-event', transfer: [8] });
      self.setTimeout(() => {
        self.postMessage({ event: 'off-event', transfer: [12] });
      }, 100);
    `;

    expect(service.spawn(URL.createObjectURL(new Blob([code], { type: 'application/javascript' })))).toBe(true);

    let called = 0;
    service.on('off-event', function callback() {
      called++;
      expect(called).not.toBeGreaterThan(1);
      service.off(callback);
    });

    setTimeout(() => {
      expect(called).toBe(1);
      done();
    }, 200);
  })());
});
