import React from 'react'
import useGlovalVariables from '../../../../src/stores/GlovalVariables'
import { ConfigInterface } from '../../../../../main/utils/Config'

type Props = {
  label: string
  settingKey: keyof ConfigInterface
  placeholder: string
}

export default function InputText({ settingKey, label, placeholder }: Props) {
  const glovalVariables = useGlovalVariables()
  const [value, setValue] = React.useState('')

  const handleChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <input
        type="text"
        placeholder={placeholder}
        className="text-input"
        onChange={handleChange}
        value={value}
      />
    </label>
  )
}