import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import { NzTableModule, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTypographyModule } from 'ng-zorro-antd/typography'
import { Subscription } from 'rxjs'

import { Division } from '../division/division'
import { DivisionModel } from '../division/models/division.model'

interface ColumnItem {
  label: string
  value: string
  sortOrder: NzTableSortOrder | null
  sortFn: NzTableSortFn<DivisionModel> | null
  sortDirections: NzTableSortOrder[]
}

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
  columns: ColumnItem[] = [
    {
      label: 'División',
      value: 'name',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      label: 'División Superior',
      value: 'parent.name',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) =>
        (a.parent?.name || '').localeCompare(b.parent?.name || ''),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      label: 'Colaboradores',
      value: 'collaboratorCount',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) => a.collaboratorCount - b.collaboratorCount,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      label: 'Nivel',
      value: 'level',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) => a.level - b.level,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      label: 'Subdivisiones',
      value: 'subdivisions.length',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) => a.subdivisions.length - b.subdivisions.length,
      sortDirections: ['ascend', 'descend', null]
    },
    {
      label: 'Embajadores',
      value: 'ambassadorName',
      sortOrder: null,
      sortFn: (a: DivisionModel, b: DivisionModel) =>
        (a.ambassadorName || '').localeCompare(b.ambassadorName || ''),
      sortDirections: ['ascend', 'descend', null]
    }
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
      this.divisionData = [...data]
      this.divisionsFiltered = [...data]
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

    const filtered = this.divisionData.filter(div => {
      let value = this.getValueByPath(div, this.selectedColumn)
      if (!value && !term) return true
      return value?.toString().toLowerCase().includes(term)
    })

    this.divisionsFiltered = [...filtered]
  }

  onColumnChange() {
    this.searchTerm = ''
    this.onSearch()
  }
}
