import { Component, Input, OnInit } from '@angular/core';
import { GlobalsService } from '../../services/globals.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'graph-component',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
  providers: [],
})
export class GraphComponent implements OnInit {
  public chart: Chart;
  public plotData: any;
  @Input() cameraData: any[];
  constructor(public globalService: GlobalsService) {}
  ngOnInit() {
    let plotData = this.formPlotData(this.cameraData);
    this.createChart(plotData);
  }

  ngOnChanges() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart(this.formPlotData(this.cameraData));
  }

  formPlotData(cameraData) {
    if (cameraData.length > 25) {
      cameraData = cameraData.slice(0, 25);
    }
    cameraData = cameraData.reverse();
    let backgroundColor = [];
    for (let i = 0; i < cameraData.length; i++) {
      if (cameraData[i]['density'] >= 70) {
        backgroundColor.push('red');
      } else {
        backgroundColor.push('green');
      }
    }
    var data = {
      labels: [],
      datasets: [
        {
          label: 'Density',
          data: [],
          backgroundColor: backgroundColor,
        },
      ],
    };

    for (let i = 0; i < cameraData.length; i++) {
      var parsed_time = new Date(Date.parse(cameraData[i].timestamp));
      data['labels'].push(
        parsed_time.getHours() +
          '-' +
          parsed_time.getMinutes() +
          '-' +
          parsed_time.getSeconds()
      );

      data['datasets'][0]['data'].push(cameraData[i]['density']);
    }

    return data;
  }

  createChart(plotData) {
    this.chart = new Chart('MyChart', {
      type: 'bar', //this denotes tha type of chart

      data: plotData,
      options: {
        aspectRatio: 2.5,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }
}
