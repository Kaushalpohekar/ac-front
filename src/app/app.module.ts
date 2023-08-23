import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { FooterComponent } from './home/footer/footer.component';
import { CommonModule, DatePipe } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { EditScheduleComponent } from './home/edit-schedule/edit-schedule.component';
import { DeleteScheduleComponent } from './home/delete-schedule/delete-schedule.component';
import { DevicedisconnectComponent } from './home/devicedisconnect/devicedisconnect.component';

import { HashLocationStrategy,LocationStrategy } from '@angular/common';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'broker.emqx.io',
  port: 8083,
  protocol: 'ws',
  path: '/mqtt',
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    EditScheduleComponent,
    DeleteScheduleComponent,
    DevicedisconnectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    TimepickerModule.forRoot(),
    HttpClientModule,
  ],
  providers: [DatePipe,{provide : LocationStrategy , useClass : HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
