import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Sensor } from '../../types/sensor.type';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DataService } from '../../service/data.service';

Chart.register(...registerables);

@Component({
    selector: 'app-chart',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.css'
})
export class ChartComponent {
    @Input() sensorData!: Sensor;
    @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

    temperatureDatas: number[] = [];
    humidityDatas: number[] = [];
    brightnessDatas: number[] = [];
    windDatas: number[] = [];

    constructor(private dataService: DataService) { }

    DATA_LIMIT = 30
    shiftCnt = 0

    public lineChartData: ChartData<'line'> = {
        datasets: []
    };
    public lineChartOptions: ChartConfiguration['options'] = {
        responsive: true,
    };

    ngOnInit(): void {
        this.updateChartData(this.sensorData);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sensorData']) {
            this.updateChartData(changes['sensorData'].currentValue);
        }
    }

    updateChartData(sensorData: Sensor): void {
        const temperatureData = sensorData.data.temperature.value;
        if (this.temperatureDatas.length >= this.DATA_LIMIT) {
            this.temperatureDatas.shift();
            this.shiftCnt++
        }
        this.temperatureDatas.push(temperatureData);

        const humidityData = sensorData.data.humidity.value;
        if (this.humidityDatas.length >= this.DATA_LIMIT) {
            this.humidityDatas.shift();
        }
        this.humidityDatas.push(humidityData);

        const brightnessData = sensorData.data.brightness.value;
        if (this.brightnessDatas.length >= this.DATA_LIMIT) {
            this.brightnessDatas.shift();
        }
        this.brightnessDatas.push(brightnessData);

        const wind = sensorData.data.wind?.value;
        console.log("sensor data is ", sensorData.data)
        console.log("wind is ", wind)
        if (this.windDatas.length >= this.DATA_LIMIT) {
            this.windDatas.shift();
        }
        if (wind !== undefined) {
            this.windDatas.push(wind);
        }

        const startIndex = Math.max(0, this.shiftCnt);
        const labels = Array.from({ length: this.temperatureDatas.length }, (_, i) => (startIndex + i + 1).toString());

        console.log(`Start Index: ${startIndex}`);
        console.log(`Labels: ${labels}`);

        if (this.chart && this.chart.chart) {
            this.chart.chart.data.labels = labels;
            this.chart.chart.data.datasets[0].data = this.temperatureDatas;
            this.chart.chart.data.datasets[1].data = this.humidityDatas;
            this.chart.chart.data.datasets[2].data = this.brightnessDatas;
            this.chart.chart.data.datasets[3].data = this.windDatas;
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
                    },
                    {
                        data: this.windDatas,
                        label: 'Wind',
                        borderColor: 'green',
                        fill: false,
                        tension: 0.5
                    }
                ]
            };
        }
    }
}
