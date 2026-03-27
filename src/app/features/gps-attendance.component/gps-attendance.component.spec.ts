import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsAttendanceComponent } from './gps-attendance.component';

describe('GpsAttendanceComponent', () => {
  let component: GpsAttendanceComponent;
  let fixture: ComponentFixture<GpsAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
