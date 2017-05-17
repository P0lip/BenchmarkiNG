import { TestBed, async, inject } from '@angular/core/testing';
import { IframeService } from './iframe.service';

describe('IframeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IframeService]
    });
  });

  it('should be created', inject([IframeService], (service: IframeService) => {
    expect(service).toBeTruthy();
  }));

  it('handles spawn failure', inject([IframeService], (service: IframeService) => {
    const original = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentDocument');
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentDocument', { configurable: true, value: null });
    expect(service.spawn('d')).toBe(false);
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentDocument', original);
  }));

  it('should not spawn when empty url/blob', inject([IframeService], (service: IframeService) => {
    expect(service.spawn('')).toBe(false);
    expect(service.spawn('  ')).toBe(false);
    expect(service.spawn('\n')).toBe(false);
  }));

  it('sends and receives events', (done: any) => inject([IframeService], (service: IframeService) => {
    const code = `
      window.addEventListener('message', function (event) {
        if (Array.isArray(event.data.transfer) && event.data.event === 'ping') {
          event.source.postMessage({ event: 'pong', transfer: event.data.transfer }, event.origin);
        }
      });
    `;

    expect(service.spawn(code)).toBe(true);
    const data = [2, 4, 5];
    service.on('pong', transfer => {
      expect(transfer).toEqual(data);
      done();
    });

    service.postMessage({ event: 'ping', transfer: data });
  })());

  it('terminates properly', (done: any) => inject([IframeService], (service: IframeService) => {
    const code = `
      window.addEventListener('message', function (event) {
        event.source.postMessage({ event: 'test', transfer: [2] }, event.origin);
        event.source.setTimeout(() => event.source.postMessage({ event: 'test2', transfer: '' }, event.origin), 250);
      });
    `;

    expect(service.spawn(code)).toBe(true);
    service.postMessage({ event: 'ping', transfer: [] });
    let triggered = false;
    service.on('test2', () => {
      triggered = true;
    });

    service.on('test', function () {
      service.terminate();
      setTimeout(() => {
        expect(triggered).toBe(false);
        done();
      }, 500);
    });
  })());

  it('is able to stop receiving events', (done: any) => inject([IframeService], (service: IframeService) => {
    const code = `
     window.addEventListener('message', function (event) {
        event.source.postMessage({ event: 'off-event', transfer: [2] }, event.origin);
        setTimeout(() => event.source.postMessage({ event: 'off-event', transfer: '' }, event.origin), 100);
      });
    `;

    expect(service.spawn(code)).toBe(true);
    service.postMessage({ event: 'ping', transfer: [] });

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

  it('handles postMessage failures', inject([IframeService], (service: IframeService) => {
    expect(service.spawn('console')).toBe(true);
    const original = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', { configurable: true, value: null });
    expect(service.postMessage({}, [])).toBe(false);
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', original);
  }));

  it('handles multiple terminations', inject([IframeService], (service: IframeService) => {
    const original = Object.getOwnPropertyDescriptor(Element.prototype, 'remove');
    Object.defineProperty(Element.prototype, 'remove', { configurable: true, value: null });
    expect(service.spawn('console')).toBe(true);
    expect(service.terminate()).toBe(false);
    Object.defineProperty(Element.prototype, 'remove', original);
  }));
});

