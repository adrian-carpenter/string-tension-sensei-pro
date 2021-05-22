import {Observable} from 'rxjs'
import {Dispatch, useEffect, SetStateAction} from 'react'

export const useObservable = <T>(obs$: Observable<T>, handleNext: (next: T) => void) => {
  useEffect(() => {
    const subscription = obs$.subscribe(value => {
      handleNext(value)
    })
    return () => subscription.unsubscribe()
  }, [obs$, handleNext])
}