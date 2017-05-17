import { Injectable } from '@angular/core';
import {SettingsEvent} from './settings/settings.component';

@Injectable()
export class NativeService {
  constructor() { }

  inject(type: string, references: SettingsEvent[]) {
    switch (type) {
      case 'iframe':
        return `
         const script = document.body.appendChild(script);
         script.src = 'http://localhost:4200/assets/natives.js';
         script.onload = function () {
           ${JSON.stringify(references)}.forEach(function (reference) {
              const { referencedAs, creator, getter } = reference;
              window[referencedAs] = getter ? natives.helpers[getter][creator] : natives.helpers[creator]();
            });
            window.dispatchEvent('test-ready');
          };
        `;
      case 'worker':
        return `
          importScripts('http://localhost:4200/assets/natives.js');
          ${JSON.stringify(references)}.forEach(function (reference) {
            const { referencedAs, creator, getter } = reference;
            self[referencedAs] = getter ? natives.helpers[getter][creator] : natives.helpers[creator]();
          });
        `;
    }
  }
}
