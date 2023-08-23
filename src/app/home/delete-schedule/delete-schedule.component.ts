import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlService } from '../control.service';

@Component({
  selector: 'app-delete-schedule',
  templateUrl: './delete-schedule.component.html',
  styleUrls: ['./delete-schedule.component.css']
})
export class DeleteScheduleComponent {
  schedule: any;

  constructor(
    private ControlService: ControlService,
    public dialogRef: MatDialogRef<DeleteScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.schedule = data.schedule;
  }

  onNoClick(){
    this.dialogRef.close();
  }

  onDeleteClick(){
    this.ControlService.deleteSchedule(this.schedule.id).subscribe(
      () =>{
        console.log("Successfully Deleted the Schedule");
        this.dialogRef.close();
      },
      (error) =>{
        console.log("Error while Deleting the Schedule");
      }
    );
  }
}
