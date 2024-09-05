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

    DATA_LIMIT = 30
    shiftCnt = 0

    public lineChartData: ChartData<'line'> = {
        datasets: []
    };
    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };

    ngOnInit(): void {
        this.updateChartData(this.sensorDatas);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sensorDatas']) {
            this.updateChartData(changes['sensorDatas'].currentValue);
        }
    }

    updateChartData(sensorDatas: Sensor[]): void {
        const temperatureData = sensorDatas[0].data.temperature.value;
        if (this.temperatureDatas.length >= this.DATA_LIMIT) {
            this.temperatureDatas.shift();
            this.shiftCnt++
        }
        this.temperatureDatas.push(temperatureData);

        const humidityData = sensorDatas[0].data.humidity.value;
        if (this.humidityDatas.length >= this.DATA_LIMIT) {
            this.humidityDatas.shift();
        }
        this.humidityDatas.push(humidityData);

        const brightnessData = sensorDatas[0].data.brightness.value;
        if (this.brightnessDatas.length >= this.DATA_LIMIT) {
            this.brightnessDatas.shift();
        }
        this.brightnessDatas.push(brightnessData);

        const startIndex = Math.max(0, this.shiftCnt);
        const labels = Array.from({ length: this.temperatureDatas.length }, (_, i) => (startIndex + i + 1).toString());

        console.log(`Start Index: ${startIndex}`);
        console.log(`Labels: ${labels}`);

        if (this.chart && this.chart.chart) {
            this.chart.chart.data.labels = labels;
            this.chart.chart.data.datasets[0].data = this.temperatureDatas;
            this.chart.chart.data.datasets[1].data = this.humidityDatas;
            this.chart.chart.data.datasets[2].data = this.brightnessDatas;
            this.chart.chart.update();
        } else {
            this.lineChartData = {
                labels: labels,
                datasets: [
                    {
                        data: this.temperatureDatas,
                        label: 'Temperature',
                        borderColor: 'red',
                        fill: false,
                        tension: 0.5
                    },
                    {
                        data: this.humidityDatas,
                        label: 'Humidity',
                        borderColor: 'blue',
                        fill: false,
                        tension: 0.5
                    },
                    {
                        data: this.brightnessDatas,
                        label: 'Brightness',
                        borderColor: 'yellow',
                        fill: false,
                        tension: 0.5
                    }
                ]
            };
        }
    }
}
