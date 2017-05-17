import {NgModule} from '@angular/core';
import {ScriptComponent} from './script.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [ScriptComponent],
  exports: [ScriptComponent],
})

export class ScriptModule { }
