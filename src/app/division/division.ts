import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'

import { DivisionModel } from './models/division.model'

@Injectable({ providedIn: 'root' })
export class Division {
  private http = inject(HttpClient)
  private url = 'http://localhost:3000/division'

  listDivisions() {
    return this.http.get<DivisionModel[]>(this.url)
  }
}
