import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { ControlService } from '../control.service';

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

    // Subscribe to the MQTT message observable
    /*this.mqttSubscriptions.push(
      this.mqttService.observe('sense/live').subscribe((message: IMqttMessage) => {
        console.log('Received payload:', message.payload.toString());
      })
    );*/
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
}
