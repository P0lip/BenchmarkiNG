/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ScriptComponent } from './script.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

describe('ScriptComponent', () => {
  let component: ScriptComponent;
  let fixture: ComponentFixture<ScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [ScriptComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checks syntax on keyup', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    fixture.detectChanges();
    spyOn(component, 'checkSyntax');
    script.value = '2';
    script.dispatchEvent(new Event('keyup'));
    expect(component.checkSyntax).toHaveBeenCalled();
  });

  it('does not check syntax when src is empty', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    fixture.detectChanges();
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);
    script.value = '';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);
    script.value = '  ';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);
    script.value = '\n ';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);
  });

  it('validates JS correctly', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    fixture.detectChanges();
    script.value = '2';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);

    script.value = '---';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(false);
    expect(component.error instanceof SyntaxError).toBe(true);

    script.value = '[]';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);

    script.value = '\n\n---';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(false);
    expect(component.error instanceof SyntaxError).toBe(true);

    script.value = '\n\n[]';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);

    script.value = '\n\nFoook';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(false);
    expect(component.error instanceof ReferenceError).toBe(true);

    script.value = 'Array;\nFook;';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(false);
    expect(component.error instanceof ReferenceError).toBe(true);
  });

  it('accepts custom context', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    script.value = 'test';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(false);
    expect(component.error instanceof ReferenceError).toBe(true);

    component.context = {
      test: '5',
      x: [4],
    };

    script.value = 'test + x[0]';
    script.dispatchEvent(new Event('keyup'));
    expect(component.isValid).toBe(true);
    expect(component.error).toBe(null);
  });

  it('strips correctly', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    script.value = '\n\n';
    script.dispatchEvent(new Event('keyup'));
    expect(component.src).toBe('');

    script.value = '\n\n\r2';
    script.dispatchEvent(new Event('keyup'));
    expect(component.src).toBe('2');

    script.value = '5\n';
    script.dispatchEvent(new Event('keyup'));
    expect(component.src).toBe('5\n');

    script.value = ';[]';
    script.dispatchEvent(new Event('keyup'));
    expect(component.src).toBe('[]');
  });

  it('should trigger onScriptChange handler', () => {
    const compiled = fixture.debugElement.nativeElement;
    const script = compiled.querySelector('textarea');

    script.value = '2';
    const title = component.title;
    script.dispatchEvent(new Event('keyup'));
    script.dispatchEvent(new Event('change'));
    expect(component.src).toBe('2');
    expect(component.title).toBe(title);
    spyOn(component, 'onScriptChange');
    script.dispatchEvent(new Event('change'));
    expect(component.onScriptChange).toHaveBeenCalled();
  });

  it('should trigger onTitleChange handler', () => {
    const compiled = fixture.debugElement.nativeElement;
    const header = compiled.querySelector('h4');
    header.textContent = 'new Title';
    header.dispatchEvent(new Event('blur'));
    expect(component.title).toBe(header.textContent);
    expect(component.title).toBe('new Title');
  });

  it('should trigger onScriptRemoval handler', () => {
    const compiled = fixture.debugElement.nativeElement;
    spyOn(component, 'onScriptRemoval');
    const button = compiled.querySelector('button');
    button.dispatchEvent(new Event('click'));
    expect(component.onScriptRemoval).toHaveBeenCalled();
  });
});
