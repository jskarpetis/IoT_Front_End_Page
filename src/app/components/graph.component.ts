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
  public chart: any;
  public plotData: any;
  @Input() cameraData: any[];
  constructor(public globalService: GlobalsService) {}
  ngOnInit() {
    let plotData = this.formPlotData(this.cameraData);
    this.createChart(plotData);
  }

  formPlotData(cameraData) {
    if (cameraData.length > 50) {
      cameraData = cameraData.slice(0, 50);
    }
    cameraData = cameraData.reverse();

    var data = {
      labels: [],
      datasets: [
        {
          label: 'Density',
          data: [],
          backgroundColor: 'blue',
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
      },
    });
  }
}
