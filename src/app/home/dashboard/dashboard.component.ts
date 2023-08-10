/*import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlService } from '../control.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<string>;
  mqttSubscriptions: Subscription[] = [];
  Status!: string;
  toggleButtonChecked: boolean = false;

  constructor(private mqttService: MqttService, private ControlService: ControlService) {}

  ngOnInit() {
    this.currentTime$ = interval(1000).pipe(map(() => this.getCurrentTime()));

    // Subscribe to the MQTT connection status observable
    this.mqttSubscriptions.push(
      this.mqttService.onConnect.subscribe((connectionStatus) => {
        console.log('Connected to broker:', connectionStatus);
      })
    );

    this.StatusButton();
    this.createChart();

    // Subscribe to the MQTT message observable
    this.mqttSubscriptions.push(
      this.mqttService.observe('sense/live').subscribe((message: IMqttMessage) => {
        console.log('Received payload:', message.payload.toString());
      })
    );
  }

  private getCurrentTime(): string {
    const now = new Date();
    return (
      this.formatMonth(now.getMonth()) +
      ', ' +
      this.formatTime(now.getDate()) +
      ' ' +
      now.getFullYear() +
      ' ' +
      this.formatTime(now.getHours()) +
      ':' +
      this.formatTime(now.getMinutes()) +
      ':' +
      this.formatTime(now.getSeconds())
    );
  }

  private formatMonth(value: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[value];
  }

  private formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  StatusButton(){
    this.ControlService.status().subscribe(
      (result) => {
        const status = result[0].ledState;
        console.log(status);
        this.Status = status; // Store the status in the component property

        // Set the toggle button state based on the status
        if (status === 'on') {
          this.toggleButtonChecked = true;
        } else if (status === 'off') {
          this.toggleButtonChecked = false;
        }
      },
      (error) => {}
    );
  }

  onToggleChange(event: any): void {
    const topic = 'sense/live'; // Replace this with your desired topic
    const payload = event.checked ? 'on' : 'off';
    
    try {
      this.mqttService.publish(topic, payload).subscribe({
        next: () => {
          this.Status = payload;
        },
        error: (error) => {
          console.error("Error occurred while publishing:", error);
        }
      });
    } catch (error) {
      console.error("Error occurred while publishing:", error);
    }
  }


  ngOnDestroy() {
    // Unsubscribe from any active MQTT subscriptions
    this.mqttSubscriptions.forEach((sub) => sub.unsubscribe());
    // Disconnect the MQTT service from the broker
    this.mqttService.disconnect();
  }

  createChart() {
    Highcharts.chart('curvedLineChart', {
      chart: {
        type: 'spline'
      },
      title: {
        text: ''
      },
      credits: {
            enabled: false // Disable the credits display
          },

      xAxis: {
        type: 'datetime',
        timezoneOffset: 330
      },
      yAxis: {
        title: {
          text: 'Temperature'
        },
        min: 0,
        max: 100,
      },
      series: [{
        name: 'Temperature',
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(255, 0, 0, 1)'],    // Start color (red)
            [1, 'rgba(255, 255, 0, 0.3)'] // End color (yellow)
          ]
        },
        data: [10,20,30,50,25,24]
      }] as any
    } as Highcharts.Options);
  }
}*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlService } from '../control.service';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
HighchartsExporting(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<string>;
  mqttSubscriptions: Subscription[] = [];
  Status!: string;
  toggleButtonChecked: boolean = false;
  onTime!: any;
  offTime!: any;

  constructor(private mqttService: MqttService, private ControlService: ControlService) {}

  ngOnInit() {
    this.currentTime$ = interval(1000).pipe(map(() => this.getCurrentTime()));

    this.mqttSubscriptions.push(
      this.mqttService.onConnect.subscribe((connectionStatus) => {
        console.log('Connected to broker:', connectionStatus);
      })
    );

    this.StatusButton();
    this.createChart();
  }

  private getCurrentTime(): string {
    const now = new Date();
    return (
      this.formatMonth(now.getMonth()) +
      ', ' +
      this.formatTime(now.getDate()) +
      ' ' +
      now.getFullYear() +
      ' ' +
      this.formatTime(now.getHours()) +
      ':' +
      this.formatTime(now.getMinutes()) +
      ':' +
      this.formatTime(now.getSeconds())
    );
  }

  private formatMonth(value: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[value];
  }

  private formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }

  StatusButton(){
    this.ControlService.status().subscribe(
      (result) => {
        const status = result[0].ledState;
        console.log(status);
        this.Status = status;
        if (status === 'on') {
          this.toggleButtonChecked = true;
        } else if (status === 'off') {
          this.toggleButtonChecked = false;
        }
      },
      (error) => {}
    );
  }

  onToggleChange(event: any): void {
    const topic = 'sense/live'; // Replace this with your desired topic
    const payload = event.checked ? 'on' : 'off';
    
    try {
      this.mqttService.publish(topic, payload).subscribe({
        next: () => {
          this.Status = payload;
        },
        error: (error) => {
          console.error("Error occurred while publishing:", error);
        }
      });
    } catch (error) {
      console.error("Error occurred while publishing:", error);
    }
  }

  ngOnDestroy() {
    this.mqttSubscriptions.forEach((sub) => sub.unsubscribe());
    this.mqttService.disconnect();
  }

  /*createChart() {
    Highcharts.chart('columnChart', {  // Use the appropriate chart ID from your HTML
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      exporting: {  // Set exporting options to disable
        enabled: false
      },
      xAxis: {
        categories: ['On', 'Off']
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0,
        max: 100
      },
      series: [{
        name: 'Value',
        color: 'rgba(0, 0, 255, 0.7)',
        data: [10, 20]
      }] as any
    } as Highcharts.Options);
  }*/
  createChart() {
    this.ControlService.graph().subscribe(
      (data) => {
        const onTimeHours = Math.floor(data.on / 60);
        const onTimeMinutes = Math.round(data.on % 60);
        const offTimeHours = Math.floor(data.off / 60);
        const offTimeMinutes = Math.round(data.off % 60);

        Highcharts.chart('columnChart', {
          chart: {
            type: 'column'
          },
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          exporting: {
            enabled: false
          },
          xAxis: {
            categories: ['Time']
          },
          yAxis: {
            title: {
              text: ''
            },
            min: 0,
            max: 20
          },
          tooltip: {
            formatter: function () {
              if (this.y !== null && this.y !== undefined) {
                const hours = Math.floor(this.y);
                const minutes = Math.round((this.y - hours) * 60);
                return `<b>${this.series.name}</b>: ${hours}h ${minutes}m`;
              }
              return '';
            }
          },
          colors: ['#31c458', '#f54c57'], // Green for 'On', Red for 'Off'
          series: [{
            name: 'On', // 'On' series
            data: [onTimeHours + onTimeMinutes / 60],
          }, {
            name: 'Off', // 'Off' series
            data: [offTimeHours + offTimeMinutes / 60],
          }] as any
        } as Highcharts.Options);
      }
    );
  }

}
