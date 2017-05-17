import {Component, EventEmitter, Input, Output} from '@angular/core';
import sandbox from '../../utils/sandbox';

export interface ScriptChange {
  title: string;
  src: string;
}

@Component({
  selector: 'script-zone',
  templateUrl: './script.component.html',
  styleUrls: ['./script.component.css']
})
export class ScriptComponent {
  isValid = true;
  private currentContext = {};
  private stripRegex = /[^\n\r\s]/g;

  @Input() index: number;
  @Input() src: string;
  @Input() title = 'Enter your title';
  @Input() error: Error;
  @Input()
  get context(): Object {
    return this.currentContext;
  }

  set context(context: Object) {
    this.currentContext = context;
    this.checkSyntax(this.src);
  }

  @Output() source: EventEmitter<ScriptChange> = new EventEmitter<ScriptChange>();
  @Output() remove: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  strip(src: string): string {
    this.src = src.replace(/^[\n\r;]*/, '');
    return this.src || '';
  }

  private emitChange(): void {
    this.source.emit({ src: this.src, title: this.title });
  }

  onTitleChange(text: string): void {
    this.title = text;
    this.emitChange();
  }

  onScriptChange(): void {
    this.emitChange();
  }

  onScriptRemoval(): void {
    this.remove.emit();
  }

  checkSyntax(src: string): void {
    if (typeof src !== 'string' || this.stripRegex.test(src) === false) {
      this.error = null;
      this.isValid = true;
      return;
    }

    try {
      sandbox(src, this.context);
      this.error = null;
      this.isValid = true;
    } catch (ex) {
      this.error = ex;
      this.isValid = false;
    }
  }
}
