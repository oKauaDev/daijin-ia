import { ReactSVG } from 'react-svg'
import InputSelect from './components/InputSelect'
import InputCheckbox from './components/InputCheckbox'
import React from 'react'
import DaijinSettingsIcon from '../../../svgs/DaijinSettingsIcon'

export default function ApplicationPage() {
  return (
    <div className="enter-left-animation">
      <div className="application-container-top">
        <DaijinSettingsIcon />
        <div>
          <h1 className="text-gradient">Daijin</h1>
          <p className="text-gradient">Seu assistente pessoal.</p>
        </div>
      </div>
      <h1 className="settings-title">Configurações do aplicativo</h1>
      <InputSelect
        settingKey="lang"
        label="Idioma"
        options={[{ value: 'pt', label: 'Português' }]}
      />
      <InputCheckbox label="Iniciar junto com o sistema" settingKey="start_with_system" />
      <InputCheckbox label="Atualizações automáticas" settingKey="auto_update" />
    </div>
  )
}
