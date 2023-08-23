import { Injectable } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { MatDialog } from '@angular/material/dialog';
import { DevicedisconnectComponent } from '../home/devicedisconnect/devicedisconnect.component';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionErrorService {

  constructor(private mqttService: MqttService, private dialog: MatDialog) {
    this.checkTopicSubscription();
  }

  private checkTopicSubscription() {
    const topic = 'device/info';
    const subscription = this.mqttService.observe(topic).subscribe(
      (message: IMqttMessage) => {
        subscription.unsubscribe();
      },
      (error) => {
        // Open the modal if subscription fails
        this.dialog.open(DevicedisconnectComponent, {
          disableClose: true,
        });
      }
    );
    // Check if the subscription is closed after a timeout (adjust the time as needed)
    setTimeout(() => {
      if (!subscription.closed) {
        subscription.unsubscribe();
        // Open the modal since the subscription did not succeed within the timeout
        this.dialog.open(DevicedisconnectComponent, {
          disableClose: true,
        });
      }
    }, 5000); // 5 seconds timeout (adjust as needed)
  }
}
