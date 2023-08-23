import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlService } from '../control.service';
import { DatePipe } from '@angular/common';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditScheduleComponent } from '../edit-schedule/edit-schedule.component';
import { DeleteScheduleComponent } from '../delete-schedule/delete-schedule.component';
import { SubscriptionErrorService } from '../subscription-error.service';
HighchartsExporting(Highcharts);


export interface StatusData {
  id: any;
  deviceID: string;
  statIPAddress: any;
  ledState: string;
  date_time:any;
  idle: any;
  formattedDate: string | null;
}

export interface ScheduleData{
  id: any;
  start_time: any;
  end_time: any;
  deviceID: any;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;


  currentTime$!: Observable<string>;
  mqttSubscriptions: Subscription[] = [];
  Status!: string;
  toggleButtonChecked: boolean = false;
  onTime!: any;
  offTime!: any;
  timeOptions: string[] = this.generateTimeOptions();
  graphData: any[] = [];

  form: FormGroup;
  timeRangeError: boolean = false;

  displayedColumns: string[] = ['formattedDate', 'ledState'];
  dataSource : StatusData[] = [];

  displayedColumns2: string[] = ['start_time', 'end_time', 'actions'];
  dataSource2: MatTableDataSource<ScheduleData>;

  constructor(public dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private mqttService: MqttService, 
    private ControlService: ControlService, 
    private datePipe: DatePipe, 
    private fb: FormBuilder,
    private SubscriptionErrorService: SubscriptionErrorService) {
    this.dataSource2 = new MatTableDataSource<ScheduleData>([]);
    this.form = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }, {
      validator: this.timeRangeValidator
    });
  }

  ngOnInit() {
    this.currentTime$ = interval(1000).pipe(map(() => this.getCurrentTime()));

    this.mqttSubscriptions.push(
      this.mqttService.onConnect.subscribe((connectionStatus) => {
        console.log('Connected to broker:', connectionStatus);
      })
    );

    this.StatusButton();
    this.lastStatus();
    this.createChart();
    this.schedule();
  }

  timeRangeValidator(control: AbstractControl): { [key: string]: any } | null {
    const startTime = control.get('startTime')!.value;
    const endTime = control.get('endTime')!.value;

    if (startTime && endTime && startTime >= endTime) {
      return { timeRangeError: true };
    }

    return null;
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

  schedule() {
    this.ControlService.schedule().subscribe(
      (schedule) => {
        console.log(schedule);
        this.dataSource2.data = schedule;
        this.dataSource2.paginator = this.paginator;
      },
      (error) => {
        console.log("Error While fetching the schedule");
      }
    );
  }

  onToggleChange(event: any): void {
    const topic = 'sense/live/test'; // Replace this with your desired topic
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

  createChart() {
    // Step 1: Fetch Data
    this.ControlService.graph().subscribe(
      (data) => {
        this.graphData = data;

        // Step 2: Data Transformation
        const onData = [];
        const offData = [];
        const dates = [];

        /*for (const dateKey in this.graphData) {
          if (this.graphData.hasOwnProperty(dateKey)) {
            const date = new Date(dateKey);
            const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()); // Convert to UTC date
            dates.push(utcDate); // Use getTime() to get the timestamp

            onData.push(this.graphData[dateKey].on);
            offData.push(this.graphData[dateKey].off);
          }
        }*/
        for (const dateKey in this.graphData) {
          if (this.graphData.hasOwnProperty(dateKey)) {
            const date = new Date(dateKey);
            const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
            dates.push(utcDate);

            const onTimeHours = Math.floor(this.graphData[dateKey].on / 60);
            const onTimeMinutes = this.graphData[dateKey].on % 60;
            onData.push(onTimeHours + onTimeMinutes / 60);

            const offTimeHours = Math.floor(this.graphData[dateKey].off / 60);
            const offTimeMinutes = this.graphData[dateKey].off % 60;
            offData.push(offTimeHours + offTimeMinutes / 60);
          }
        }

        // Step 3: Highcharts Setup
        const options = {
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
            categories: dates,
            type: 'datetime',
            labels: {
              formatter: function(this: Highcharts.AxisLabelsFormatterContextObject) {
                return Highcharts.dateFormat('%Y-%m-%d', this.value as number); // Use the argument
              }
            }
          },
          yAxis: {
            title: {
              text: 'Value'
            }
          },
          series: [{
            name: 'On',
            data: onData,
            color: '#43d43b'
          }, {
            name: 'Off',
            data: offData,
            color: 'red'
          }],
          plotOptions: {
            column: {
              stacking: 'normal' // Set stacking directly as a string
            }
          }
        };

        // Step 4: Use Highacharts with type casting
        Highcharts.chart('chartContainer', options as any); // Cast options to "any"

        console.log(this.graphData);
      },
      (error) => {
        console.log("Error While fetching graph data");
      }
    );
  }

  generateTimeOptions(): string[] {
    const timeOptions: string[] = [];
    const intervalMinutes = 15;
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return timeOptions;
  }

  addSchedule(): void {
    if (this.form.valid) {
      const startTime = this.form.get('startTime')!.value;
      const endTime = this.form.get('endTime')!.value;

      const scheduleData = { start_time: startTime, end_time: endTime };
      if(scheduleData){
        this.ControlService.addSchedule(scheduleData).subscribe(
          () => {
            this.snackBar.open('Schedule added successfully', 'Close', {
              duration: 3000 // Adjust the duration as needed
            });
            this.schedule();
          },
          (error) => { 
            this.snackBar.open(error.error.message, 'Close', {
              duration: 3000, // Adjust the duration as needed
              panelClass: ['error-snackbar'] // You can define custom styles for the snackbar
            });
          }
        );
      }
    }
  }

  editSchedule(schedule: any): void{
    console.log(schedule);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { schedule };
    const dialogRef = this.dialog.open(EditScheduleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
    () => {
      this.schedule();
    },
    (error) => {}
    );
  }

  deleteSchedule(schedule: any): void{
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { schedule };
    const dialogRef = this.dialog.open(DeleteScheduleComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      () => {
        this.schedule();
      },
      (error) =>{
        console.log("Error For closing the delete Dailog!");
      }
    );
  } 
}