export interface DivisionModel {
  id: number
  name: string
  collaboratorCount: number
  level: number
  ambassadorName?: string | null
  parent?: DivisionModel | null
  subdivisions: DivisionModel[]
}
