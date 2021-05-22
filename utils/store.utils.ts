
export interface DataModel<T> {
  data: T,
  loading: boolean,
  error: Error | null,
  initialized: boolean
}

export function dataModel<T> (initialValue: T): DataModel<T> {
  return {
    data: initialValue,
    loading: false,
    error: null,
    initialized: false
  }
}