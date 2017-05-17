import { Injectable } from '@angular/core';

@Injectable()
export class IframeService {
  private listeners: WeakMap<Function, EventListener> = new WeakMap<Function, EventListener>();
  private iframe: HTMLIFrameElement;
  private stripRegex = /[^\n\r\s]/g;

  spawn(src: string): boolean {
    if (this.stripRegex.test(src) === false) {
      return false;
    }

    try {
      this.iframe = document.body.appendChild(document.createElement('iframe'));
      this.iframe.style.display = 'none';
      const script = document.createElement('script');
      script.textContent = src;
      this.iframe.contentDocument.body.appendChild(script);
      return true;
    } catch (ex) {
      return false;
    }
  }

  terminate(): boolean {
    try {
      this.iframe.remove();
      return true;
    } catch (ex) {
      return false;
    }
  }

  postMessage(message: Object, transferList?: Array<ArrayBuffer | MessagePort>): boolean {
    try {
      this.iframe.contentWindow.postMessage(message, '*', transferList);
      return true;
    } catch (ex) {
      return false;
    }
  }

  on(event: string, listener: Function) { // NOTE: ONE FUNCTION, ONE EVENT
    function eventListener(msg) {
      if (msg.data.event === event) {
        listener(msg.data.transfer);
      }
    }

    this.listeners.set(listener, eventListener);
    window.addEventListener('message', eventListener);
  }

  off(listener: Function) { // NOTE: ONE FUNCTION, ONE EVENT
    const eventListener: EventListener = this.listeners.get(listener);
    window.removeEventListener('message', eventListener);
  }
}
