import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import {TrustedUrlPipe} from '../../core/pipes/trusted-url.-pipe';

const API = 'http://localhost:8080/api';

@Component({
  selector: 'app-gps-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TagModule, ToastModule, CardModule, TrustedUrlPipe],
  providers: [MessageService],
  templateUrl: './gps-attendance.component.html',
  styleUrl: './gps-attendance.component.scss'
})
export class GpsAttendanceComponent implements OnInit {
  auth = inject(AuthService);
  private http = inject(HttpClient);
  private msgSvc = inject(MessageService);

  // Location state
  currentLat: number | null = null;
  currentLng: number | null = null;
  locationError = '';
  locationLoading = false;
  distance: number | null = null;
  inRange = false;

  // Office location
  officeLocation: any = null;

  // Attendance state
  todayStatus: any = null;
  punchLoading = false;

  // Map
  mapUrl = '';

  ngOnInit(): void {
    this.loadOfficeLocation();
    this.loadTodayStatus();
  }

  // ── Load Office Location ──────────────────────────────────────────────
  loadOfficeLocation(): void {
    this.http.get<any>(`${API}/office/active`).subscribe({
      next: res => {
        this.officeLocation = res.data;
        this.updateMapUrl();
      },
      error: () => {}
    });
  }

  // ── Load Today Status ─────────────────────────────────────────────────
  loadTodayStatus(): void {
    this.http.get<any>(`${API}/attendance/today`).subscribe({
      next: res => { this.todayStatus = res.data; },
      error: () => { this.todayStatus = null; }
    });
  }

  // ── Get GPS Location ──────────────────────────────────────────────────
  getLocation(): void {
    if (!navigator.geolocation) {
      this.locationError = 'Browser GPS support nathi!';
      return;
    }
    this.locationLoading = true;
    this.locationError = '';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        this.locationLoading = false;
        this.checkDistance();
        this.updateMapUrl();
      },
      (error) => {
        this.locationLoading = false;
        switch(error.code) {
          case error.PERMISSION_DENIED:
            this.locationError = '❌ Location permission denied! Browser settings ma allow karo.';
            break;
          case error.POSITION_UNAVAILABLE:
            this.locationError = '❌ Location unavailable!';
            break;
          default:
            this.locationError = '❌ Location error: ' + error.message;
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // ── Check Distance from Office ────────────────────────────────────────
  checkDistance(): void {
    if (!this.currentLat || !this.currentLng || !this.officeLocation) return;

    const R = 6371000;
    const dLat = this.toRad(this.officeLocation.latitude - this.currentLat);
    const dLon = this.toRad(this.officeLocation.longitude - this.currentLng);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(this.currentLat)) *
      Math.cos(this.toRad(this.officeLocation.latitude)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    this.distance = Math.round(R * c);
    this.inRange = this.distance <= (this.officeLocation.radiusMeters || 50);
  }

  toRad(deg: number): number { return deg * (Math.PI / 180); }

  // ── Update Map URL (OpenStreetMap - Free!) ────────────────────────────
  updateMapUrl(): void {
    if (this.officeLocation) {
      const lat = this.currentLat || this.officeLocation.latitude;
      const lng = this.currentLng || this.officeLocation.longitude;
      this.mapUrl = `https://www.openstreetmap.org/export/embed.html` +
        `?bbox=${lng-0.005},${lat-0.005},${lng+0.005},${lat+0.005}` +
        `&layer=mapnik` +
        `&marker=${lat},${lng}`;
    }
  }

  // ── GPS Punch In ──────────────────────────────────────────────────────
  gpsPunchIn(): void {
    if (!this.currentLat || !this.currentLng) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning',
        detail: 'Pehla location levo!' });
      return;
    }
    this.punchLoading = true;
    this.http.post<any>(`${API}/attendance/gps-punch-in`, {
      latitude: this.currentLat,
      longitude: this.currentLng
    }).subscribe({
      next: res => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'success', summary: '✅ Punched In!',
          detail: res.message });
        this.loadTodayStatus();
      },
      error: err => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'error', summary: '❌ Error',
          detail: err?.error?.message || 'Punch in failed!' });
      }
    });
  }

  // ── GPS Punch Out ─────────────────────────────────────────────────────
  gpsPunchOut(): void {
    if (!this.currentLat || !this.currentLng) {
      this.msgSvc.add({ severity: 'warn', summary: 'Warning',
        detail: 'Pehla location levo!' });
      return;
    }
    this.punchLoading = true;
    this.http.post<any>(`${API}/attendance/gps-punch-out`, {
      latitude: this.currentLat,
      longitude: this.currentLng
    }).subscribe({
      next: res => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'success', summary: '👋 Punched Out!',
          detail: res.message });
        this.loadTodayStatus();
      },
      error: err => {
        this.punchLoading = false;
        this.msgSvc.add({ severity: 'error', summary: '❌ Error',
          detail: err?.error?.message || 'Punch out failed!' });
      }
    });
  }

  getSeverity(status?: string): any {
    const m: Record<string, any> = {
      PRESENT: 'success', LATE: 'warn', HALF_DAY: 'secondary', ABSENT: 'danger'
    };
    return m[status || ''] || 'info';
  }

  get canPunchIn(): boolean { return !this.todayStatus?.punchInTime; }
  get canPunchOut(): boolean {
    return !!this.todayStatus?.punchInTime && !this.todayStatus?.punchOutTime;
  }
}
