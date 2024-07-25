import React from 'react'
import useGlovalVariables from '../../../../src/stores/GlovalVariables'
import { ConfigInterface } from '../../../../../main/utils/Config'

type Props = {
  label: string
  settingKey: keyof ConfigInterface
}

export default function InputCheckbox({ settingKey, label }: Props) {
  const glovalVariables = useGlovalVariables()
  const [check, setCheck] = React.useState(false)

  const handleChange = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.currentTarget

    if (target) {
      if (settingKey === 'start_with_system') {
        // @ts-ignore
        await window.api.toggleAutoLaucher()
      }

      setCheck(target.checked)
      //@ts-ignore
      glovalVariables.setConfig({ ...glovalVariables.config, [settingKey]: target.checked })
      // @ts-ignore
      await window.api.setConfig(settingKey, target.checked)
    }
  }, [])

  React.useEffect(() => {
    // @ts-ignore
    setCheck(Boolean(glovalVariables.config?.[settingKey] ?? false))
  }, [])

  return (
    <label className="input-flex-container">
      <p>{label}</p>
      <input className="checkbox-input" type="checkbox" onChange={handleChange} checked={check} />
      <div className="checkbox-input">
        <div className={check ? 'active' : ''}></div>
      </div>
    </label>
  )
}
