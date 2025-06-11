import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: `./chart.component.html`,
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() type: any;
  @Input() data: any;
  @Input() options: any;
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chartInstance: Chart | undefined;

  ngOnInit() {
    this.chartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: this.type,
      data: this.data,
      options: this.options
    });
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
}
