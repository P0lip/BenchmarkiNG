import { NgModule } from '@angular/core';

import {SettingsComponent} from './settings.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
})
export class SettingsModule { }
