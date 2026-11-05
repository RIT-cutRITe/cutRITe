type ParamValue = string | boolean

export interface Param {
  name: string
  type: 'text' | 'select' | 'checkbox'
  default: ParamValue
  description: string
  options: string[] | null
}
