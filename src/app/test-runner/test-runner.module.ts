import { NgModule } from '@angular/core';
import { TestRunnerComponent } from './test-runner.component';
import {FormsModule} from '@angular/forms';
import {WorkerService} from '../shared/worker.service';
import {IframeService} from '../shared/iframe.service';
import {NativeService} from '../shared/native.service';
import {CommonModule} from '@angular/common';
import {SettingsModule} from '../shared/settings/settings.module';
import {ScriptModule} from '../shared/script/script.module';
import {ResultsModule} from '../shared/results/results.module';

@NgModule({
  imports: [FormsModule, CommonModule, SettingsModule, ScriptModule, ResultsModule],
  declarations: [TestRunnerComponent],
  providers: [WorkerService, IframeService, NativeService],
  exports: [TestRunnerComponent],
})
export class TestRunnerModule { }
