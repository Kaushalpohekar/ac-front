import { Component } from '@angular/core';
import { ControlService } from '../control.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private ControlService: ControlService) {}

  logout() {
    this.ControlService.logout();
  }
}
