import { inject, Injectable } from '@angular/core';
import { WhistleFrame } from '../home/whistleblow.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WhistleService {
  url = `${environment.backendUrl}/whistleblow`;
  private httpService = inject(HttpClient);

  constructor() {}

  addWhistle(whistleData: FormData) {
    return this.httpService.put(this.url + '/new', whistleData);
  }
}
