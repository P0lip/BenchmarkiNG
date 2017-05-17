/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SettingsComponent } from './settings.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [SettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of options', () => {
    const {options} = component;
    expect(options).toBeDefined();
    const {debugElement} = fixture;

    expect(debugElement.nativeElement.querySelector('h2').textContent).toBe('Inject');
    expect(debugElement.nativeElement.querySelector('ul')).toBeDefined();
    expect(debugElement.nativeElement.querySelectorAll('ul > li').length).toEqual(options.length);
    debugElement.nativeElement.querySelectorAll('ul > li').forEach((elem, n) => {
      expect(elem.childElementCount).toEqual(2);
      expect(elem.firstElementChild.getAttribute('for')).toBe(options[n].id);
      expect(elem.firstElementChild.getAttribute('for')).toBe(elem.lastElementChild.id);
    });
  });

  it('should trigger onChange', () => {
    const {options} = component;
    expect(options).toBeDefined();
    const {debugElement} = fixture;
    expect(debugElement.nativeElement.querySelectorAll('input').length).toEqual(options.length);

    expect(component.onChange({
      id: '',
      title: '',
      checked: false,
      referencedAs: '',
      creator: '',
    })).not.toBeDefined();

    spyOn(component, 'onChange');

    debugElement.nativeElement.querySelectorAll('input').forEach((input, n) => {
      input.checked = false;
      input.dispatchEvent(new Event('change'));
      expect(input.checked).toBe(false);
      expect(input.checked).toBe(options[n].checked);

      input.checked = true;
      input.dispatchEvent(new Event('change'));
      expect(input.checked).toBe(true);
      expect(input.checked).toBe(options[n].checked);
    });

    expect(component.onChange).toHaveBeenCalledTimes(options.length * 2);
  });
});
