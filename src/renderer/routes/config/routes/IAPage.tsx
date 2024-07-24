import React from 'react'
import InputSelect from './components/InputSelect'
import InputText from './components/InputText'

export default function IAPage() {
  return (
    <div className="enter-left-animation">
      <h1 className="settings-title">Configurações da IA</h1>
      <InputSelect
        settingKey="ia_type"
        label="IA"
        options={[
          { value: 'nagaia', label: 'NagaIA' },
          { value: 'openia', label: 'OpenIA' }
        ]}
      />
      <InputText label="Chave de acesso" placeholder="Chave de acesso aqui" settingKey="ia_key" />
      <InputSelect
        label="Modelo"
        settingKey="ia_model"
        options={[
          { value: 'gpt-3.5-turbo', label: 'Gpt-3.5-turbo' },
          { value: 'gpt-3.5-turbo-0125', label: 'Gpt-3.5-turbo-0125' },
          { value: 'gpt-3.5-turbo-0613', label: 'Gpt-3.5-turbo-0613' },
          { value: 'gpt-3.5-turbo-1106', label: 'Gpt-3.5-turbo-1106' },
          { value: 'gpt-3.5-turbo-16k', label: 'Gpt-3.5-turbo-16k' },
          { value: 'gpt-3.5-turbo-16k-0613', label: 'Gpt-3.5-turbo-16k-0613' },
          { value: 'gpt-4', label: 'Gpt-4' },
          { value: 'gpt-4-0125-preview', label: 'Gpt-4-0125-preview' },
          { value: 'gpt-4-0314', label: 'Gpt-4-0314' },
          { value: 'gpt-4-0613', label: 'Gpt-4-0613' },
          { value: 'gpt-4o', label: 'Gpt-4o' },
          { value: 'gpt-4o-mini', label: 'Gpt-4o-mini' }
        ]}
      />
    </div>
  )
}
