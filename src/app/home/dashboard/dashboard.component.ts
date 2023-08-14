import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlService } from '../control.service';
import { DatePipe } from '@angular/common';
/*import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
HighchartsExporting(Highcharts);*/

export interface StatusData {
  id: any;
  deviceID: string;
  statIPAddress: any;
  ledState: string;
  date_time:any;
  idle: any;
  formattedDate: string | null;
}


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

  displayedColumns: string[] = ['formattedDate', 'ledState'];
  dataSource : StatusData[] = [];

  constructor(private mqttService: MqttService, private ControlService: ControlService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.currentTime$ = interval(1000).pipe(map(() => this.getCurrentTime()));

    this.mqttSubscriptions.push(
      this.mqttService.onConnect.subscribe((connectionStatus) => {
        console.log('Connected to broker:', connectionStatus);
      })
    );

    this.StatusButton();
    this.lastStatus();
    //this.createChart();
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

  /*lastStatus() {
    this.ControlService.lastStatus().subscribe(
      (ledState) => {
        console.log(ledState);
        this.dataSource = ledState;
        this.dataSource = ledState.map((ledState: StatusData) => {
          ledState.formattedDate = this.datePipe.transform(ledState.date_time, 'MMM d y HH:mm:ss');
          return ledState;0
        });
        console.log();
      },
      (error) =>{
        console.log("Entries Not fetched properly!");
      }
    );
  }*/
lastStatus() {
  this.ControlService.lastStatus().subscribe(
    (ledState) => {
      console.log(ledState);
      this.dataSource = ledState;
      this.dataSource = ledState.map((ledState: StatusData) => {
        ledState.formattedDate = this.datePipe.transform(ledState.date_time, 'MMM d y HH:mm:ss', 'UTC');
        return ledState;
      });
      console.log();
    },
    (error) => {
      console.log("Entries Not fetched properly!");
    }
  );
}


  




  onToggleChange(event: any): void {
    const topic = 'sense/live/12'; // Replace this with your desired topic
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
  }*/

}
