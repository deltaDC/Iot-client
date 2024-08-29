import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../../types/sensor.type';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(...registerables);

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.css'
})
export class ChartComponent {
    @Input() sensorDatas: Sensor[] = [];
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    temperatureDatas: number[] = [];
    humidityDatas: number[] = [];
    brightnessDatas: number[] = [];

    public lineChartData: ChartData<'line'> = {
        datasets: []
    };
    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };

    // ngOnInit(): void {
    //     this.updateChartData(this.sensorDatas);
    // }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['sensorDatas']) {
    //         this.updateChartData(changes['sensorDatas'].currentValue);
    //     }
    // }

    // updateChartData(sensorDatas: Sensor[]): void {
    //     const temperatureData = sensorDatas
    //         .filter(sensor => sensor.name === 'temperature')[0].value
    //     this.temperatureDatas.push(temperatureData)

    //     const humidityData = sensorDatas
    //         .filter(sensor => sensor.name === 'humidity')[0].value
    //     this.humidityDatas.push(humidityData)

    //     const brightnessData = sensorDatas
    //         .filter(sensor => sensor.name === 'brightness')[0].value
    //     this.brightnessDatas.push(brightnessData)

    //     if (this.chart && this.chart.chart) {
    //         this.chart.chart.data.labels = this.temperatureDatas.map((_, index) => index.toString());
    //         this.chart.chart.data.datasets[0].data = this.temperatureDatas;
    //         this.chart.chart.data.datasets[1].data = this.humidityDatas;
    //         this.chart.chart.data.datasets[2].data = this.brightnessDatas;
    //         this.chart.chart.update();
    //     } else {
    //         this.lineChartData = {
    //             labels: this.temperatureDatas.map((_, index) => index.toString()),
    //             datasets: [
    //                 {
    //                     data: this.temperatureDatas,
    //                     label: 'Temperature',
    //                     borderColor: 'red',
    //                     fill: false,
    //                     tension: 0.5
    //                 },
    //                 {
    //                     data: this.humidityDatas,
    //                     label: 'Humidity',
    //                     borderColor: 'blue',
    //                     fill: false,
    //                     tension: 0.5
    //                 },
    //                 {
    //                     data: this.brightnessDatas,
    //                     label: 'Brightness',
    //                     borderColor: 'yellow',
    //                     fill: false,
    //                     tension: 0.5
    //                 }
    //             ]
    //         };
    //     }
    // }
}
