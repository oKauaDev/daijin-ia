import React from 'react'
import useGlovalVariables from '../../../../src/stores/GlovalVariables'
import { ConfigInterface } from '../../../../../main/utils/Config'

type Props = {
  label: string
  settingKey: keyof ConfigInterface
  options: {
    value: string
    label: string
  }[]
}

export default function InputSelect({ settingKey, label, options }: Props) {
  const glovalVariables = useGlovalVariables()
  const [value, setValue] = React.useState('')

  const handleChange = React.useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.currentTarget

    if (target) {
      setValue(target.value)
      //@ts-ignore
      glovalVariables.setConfig({ ...glovalVariables.config, [settingKey]: target.value })
      // @ts-ignore
      await window.api.setConfig(settingKey, target.value)
    }
  }, [])

  React.useEffect(() => {
    // @ts-ignore
    setValue(glovalVariables.config?.[settingKey] ?? '')
  }, [])

  return (
    <label className="input-flex-container">
      <p>{label}</p>
      <select className="select-input" onChange={handleChange} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
