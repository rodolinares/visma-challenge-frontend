import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTypographyModule } from 'ng-zorro-antd/typography'
import { Subscription } from 'rxjs'

import { Division } from '../division/division'
import { DivisionModel } from '../division/models/division.model'

@Component({
  selector: 'app-organization',
  imports: [
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzRadioModule,
    NzSelectModule,
    NzTableModule,
    NzTabsModule,
    NzTypographyModule
  ],
  templateUrl: './organization.html',
  styleUrl: './organization.scss'
})
export class Organization implements OnInit, OnDestroy {
  divisionData: DivisionModel[] = []

  private divisionService = inject(Division)
  private subscriptions: Subscription[] = []

  ngOnInit() {
    this.loadData()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private loadData() {
    const sub = this.divisionService.listDivisions().subscribe(data => {
      this.divisionData = data
      console.table(data)
    })

    this.subscriptions.push(sub)
  }
}
