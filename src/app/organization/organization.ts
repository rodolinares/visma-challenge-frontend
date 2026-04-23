import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzIconModule } from 'ng-zorro-antd/icon'
import { NzInputModule } from 'ng-zorro-antd/input'
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { NzSelectModule } from 'ng-zorro-antd/select'
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { NzTypographyModule } from 'ng-zorro-antd/typography'
import { Subscription } from 'rxjs'

import { Division } from '../division/division'
import { DivisionModel } from '../division/models/division.model'

interface ColumnItem {
  label: string
  value: string
  filterFn: NzTableFilterFn<DivisionModel> | null
  filterMultiple: boolean
  filterList: NzTableFilterList
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
  columns: ColumnItem[] = []
  divisionData: DivisionModel[] = []
  divisionsFiltered: DivisionModel[] = []
  loading = true
  searchTerm = ''
  selectedColumn = 'name'
  viewMode: 'list' | 'tree' = 'list'

  private divisionService = inject(Division)
  private subscriptions: Subscription[] = []

  private setupColumns(data: DivisionModel[]) {
    const columns: ColumnItem[] = [
      {
        label: 'División',
        value: 'name',
        filterFn: (list: string[], item: DivisionModel) =>
          list.some(name => item.name.includes(name)),
        filterMultiple: true,
        filterList: data.map(div => ({ text: div.name, value: div.name })),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) => a.name.localeCompare(b.name),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        label: 'División Superior',
        value: 'parent.name',
        filterFn: (list: string[], item: DivisionModel) =>
          list.some(name => item.parent?.name.includes(name)),
        filterMultiple: true,
        filterList: Array.from(new Set(data.map(div => div.parent?.name).filter(name => name))).map(
          name => ({ text: name!, value: name! })
        ),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) =>
          (a.parent?.name || '').localeCompare(b.parent?.name || ''),
        sortDirections: ['ascend', 'descend', null]
      },
      {
        label: 'Colaboradores',
        value: 'collaboratorCount',
        filterFn: (list: number[], item: DivisionModel) =>
          list.some(count => item.collaboratorCount === count),
        filterMultiple: true,
        filterList: Array.from(new Set(data.map(div => div.collaboratorCount))).map(count => ({
          text: count.toString(),
          value: count
        })),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) => a.collaboratorCount - b.collaboratorCount,
        sortDirections: ['ascend', 'descend', null]
      },
      {
        label: 'Nivel',
        value: 'level',
        filterFn: (list: number[], item: DivisionModel) => list.some(level => item.level === level),
        filterMultiple: true,
        filterList: Array.from(new Set(data.map(div => div.level))).map(level => ({
          text: level.toString(),
          value: level
        })),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) => a.level - b.level,
        sortDirections: ['ascend', 'descend', null]
      },
      {
        label: 'Subdivisiones',
        value: 'subdivisions.length',
        filterFn: (list: number[], item: DivisionModel) =>
          list.some(count => item.subdivisions.length === count),
        filterMultiple: true,
        filterList: Array.from(new Set(data.map(div => div.subdivisions.length))).map(count => ({
          text: count.toString(),
          value: count
        })),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) =>
          a.subdivisions.length - b.subdivisions.length,
        sortDirections: ['ascend', 'descend', null]
      },
      {
        label: 'Embajadores',
        value: 'ambassadorName',
        filterFn: (list: string[], item: DivisionModel) =>
          list.some(name => item.ambassadorName?.includes(name)),
        filterMultiple: true,
        filterList: Array.from(
          new Set(data.map(div => div.ambassadorName).filter(name => name))
        ).map(name => ({ text: name!, value: name! })),
        sortOrder: null,
        sortFn: (a: DivisionModel, b: DivisionModel) =>
          (a.ambassadorName || '').localeCompare(b.ambassadorName || ''),
        sortDirections: ['ascend', 'descend', null]
      }
    ]

    this.columns = [...columns]
  }

  private loadData() {
    const sub = this.divisionService.listDivisions().subscribe(data => {
      this.setupColumns(data)
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
