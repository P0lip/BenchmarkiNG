import {Component, Input, OnInit} from '@angular/core';

export interface Result {
  title: string;
  src: string;
  iterations: number;
  time: number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() results: Result[] = [];

  constructor() { }

  ngOnInit() {
  }

}
