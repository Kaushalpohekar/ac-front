import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ControlService } from '../control.service';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.css']
})
export class EditScheduleComponent {
  schedule: any;
  timeOptions: string[] = this.generateTimeOptions();
  form: FormGroup;
  timeRangeError: boolean = false;

  constructor(
    private ControlService: ControlService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.schedule = data.schedule;
    const formattedStartTime = this.formatTime(this.schedule.start_time);
    const formattedEndTime = this.formatTime(this.schedule.end_time);

    this.form = this.fb.group({
      startTime: [formattedStartTime, Validators.required],
      endTime: [formattedEndTime, Validators.required]
    }, {
      validator: this.timeRangeValidator
    });
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

  formatTime(time: string): string {
    // Assuming time is in "HH:mm:ss" format, extracting "HH:mm"
    return time.substr(0, 5);
  }

  timeRangeValidator(control: AbstractControl): { [key: string]: any } | null {
    const startTime = control.get('startTime')!.value;
    const endTime = control.get('endTime')!.value;

    if (startTime && endTime && startTime >= endTime) {
      return { timeRangeError: true };
    }

    return null;
  }

  onSaveClick() {
    if (this.form.valid) {
      const id = this.schedule.id;
      const startTime = this.form.get('startTime')!.value;
      const endTime = this.form.get('endTime')!.value;

      const scheduleData = { start_time: startTime, end_time: endTime };
      if(scheduleData){
        this.ControlService.editSchedule(id, scheduleData).subscribe(
          () => {
            console.log("Successfully Edited the time Schedule!");
            this.dialogRef.close();
          },
          (error) => {
            console.log("Error Editing the time Schedule!"); 
          }
        );
      }
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
