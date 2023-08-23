import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicedisconnectComponent } from './devicedisconnect.component';

describe('DevicedisconnectComponent', () => {
  let component: DevicedisconnectComponent;
  let fixture: ComponentFixture<DevicedisconnectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevicedisconnectComponent]
    });
    fixture = TestBed.createComponent(DevicedisconnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
