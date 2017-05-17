import {NgModule} from '@angular/core';
import {ResultsComponent} from './results.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [ResultsComponent],
  exports: [ResultsComponent],
})

export class ResultsModule { }
