import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { DivisionModel } from './models/division.model'
import { environment } from '../../environments/environment'

@Injectable({ providedIn: 'root' })
export class Division {
  private http = inject(HttpClient)
  private url = `${environment.apiUrl}/division`

  listDivisions() {
    return this.http.get<DivisionModel[]>(this.url)
  }
}
