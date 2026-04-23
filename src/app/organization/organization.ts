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
  columns = [
    { label: 'División', value: 'name' },
    { label: 'División Superior', value: 'parent.name' },
    { label: 'Colaboradores', value: 'collaboratorCount' },
    { label: 'Nivel', value: 'level' },
    { label: 'Subdivisiones', value: 'subdivisions.length' },
    { label: 'Embajadores', value: 'ambassadorName' }
  ]

  divisionData: DivisionModel[] = []
  divisionsFiltered: DivisionModel[] = []
  loading = true
  searchTerm = ''
  selectedColumn = 'name'
  viewMode: 'list' | 'tree' = 'list'

  private divisionService = inject(Division)
  private subscriptions: Subscription[] = []

  private loadData() {
    const sub = this.divisionService.listDivisions().subscribe(data => {
      this.divisionData = data
      this.divisionsFiltered = data
      this.loading = false
    })

    this.subscriptions.push(sub)
  }

  ngOnInit() {
    this.loadData()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  private getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined
    }, obj)
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase()

    this.divisionsFiltered = this.divisionData.filter(div => {
      let value = this.getValueByPath(div, this.selectedColumn)
      return value?.toString().toLowerCase().includes(term)
    })
  }

  onColumnChange() {
    this.searchTerm = ''
    this.onSearch()
  }
}
