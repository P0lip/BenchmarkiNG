import {AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export interface SettingsEvent {
  id: string;
  title: string;
  checked: boolean;
  referencedAs: string;
  creator: string;
  getter?: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() settings: EventEmitter<SettingsEvent> = new EventEmitter<SettingsEvent>();
  @Input() options: SettingsEvent[];

  constructor() { }

  ngOnInit() {
    this.options = [
      {
        id: 'smis-array',
        title: 'Array of SMIs',
        checked: true,
        referencedAs: 'smisArr',
        creator: 'createFastArray',
      },
      {
        id: 'sparse-array',
        title: 'Sparse array',
        checked: false,
        referencedAs: 'sparseArr',
        creator: 'createSparseArray',
      },
      {
        id: 'fast-object',
        title: 'Object with fast properties',
        checked: true,
        referencedAs: 'fastObj',
        creator: 'createFastObject',
      },
      {
        id: 'slow-object',
        title: 'Object with slow properties',
        checked: false,
        referencedAs: 'slowObj',
        creator: 'createSlowObject',
      },
      {
        id: 'expensive-callback',
        title: 'Expensive callback with several coercions',
        checked: false,
        referencedAs: 'expensive',
        creator: 'expensive',
        getter: 'callbacks',
      },
      {
        id: 'noop',
        title: 'noop',
        checked: true,
        referencedAs: 'noop',
        creator: 'noop',
        getter: 'callbacks',
      },
    ];

    this.options.forEach((event: SettingsEvent) => {
      this.settings.emit(event);
    });
  }

  onChange(event: SettingsEvent) {
    this.settings.emit(event);
  }

  private assign(target: any, ...args: any[]): Object {
    return Object.assign(target, ...args);
  }
}
