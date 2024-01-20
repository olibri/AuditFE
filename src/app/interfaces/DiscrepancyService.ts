import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscrepancyService {
  private auditId: number = -1;

  setId(id: number): void {
    this.auditId = id;
  }

  getId(): number {
    return this.auditId;
  }
}
