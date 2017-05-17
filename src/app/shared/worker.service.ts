import {Injectable} from '@angular/core';

@Injectable()
export class WorkerService {
  private listeners: WeakMap<Function, EventListener> = new WeakMap();
  private worker: Worker;
  private stripRegex = /[^\n\r\s]/g;

  spawn(src: string): boolean {
    if (this.stripRegex.test(src) === false) {
      return false;
    }

    try {
      this.worker = new Worker(src);
      return true;
    } catch (ex) {
      return false;
    }
  }

  terminate(): boolean {
    try {
      this.worker.terminate();
      return true;
    } catch (ex) {
      return false;
    }
  }

  postMessage(message: Object, transferList?: Array<ArrayBuffer | MessagePort>): boolean {
    this.worker.postMessage(message, transferList);
    return true;
  }

  on(event: string, listener: Function) { // NOTE: ONE FUNCTION, ONE EVENT
    function eventListener(msg) {
      if (msg.data === undefined) {
        listener(msg);
      } else {
        if (msg.data.event === event) {
          listener(msg.data.transfer);
        }
      }
    }

    this.listeners.set(listener, eventListener);
    this.worker.addEventListener(event === 'error' ? 'error' : 'message', eventListener);
  }

  off(listener: Function) { // NOTE: ONE FUNCTION, ONE EVENT
    const eventListener: EventListener = this.listeners.get(listener);
    this.worker.removeEventListener('message', eventListener);
  }
}
