import { useMemo, useState } from 'react'

export type UseBooleanActions = {
  setTrue: () => void
  setFalse: () => void
  set: (value: boolean) => void
  toggle: () => void
}

export default function useBoolean(defaultValue = false): [boolean, UseBooleanActions] {
  const [value, setValue] = useState(!!defaultValue)

  const actions: UseBooleanActions = useMemo(() => {
    const setTrue = () => setValue(true)
    const setFalse = () => setValue(false)
    return {
      toggle: () => setValue((v) => !v),
      set: (v) => setValue(!!v),
      setTrue,
      setFalse,
    }
  }, [])

  return [value, actions]
}
