import * as fs from 'fs'
import path from 'path'
import * as os from 'os'

export interface ConfigInterface {
  prompt_date: string
  prompt: string
  lang: 'pt'
  start_with_system: boolean
  auto_update: boolean
  shortcut_go_front: string
  shortcut_go_back: string
  shortcut_settings: string
  ia_type: 'nagaia' | 'openai'
  ia_key: string
  ia_model: string
}

export default function Config() {
  const homedir = os.homedir()
  const path_name = path.join(homedir, '.daijin-ia/config.json')

  function get(): ConfigInterface {
    if (fs.existsSync(path_name)) {
      const rawData = fs.readFileSync(path_name, 'utf-8').toString()
      return JSON.parse(rawData)
    } else {
      const defConfig: ConfigInterface = {
        prompt_date: new Date().toISOString(),
        prompt: 'Você é Daijin, um assistente virtual.',
        lang: 'pt',
        start_with_system: true,
        auto_update: true,
        shortcut_go_front: 'Ctrl+ArrowLeft',
        shortcut_go_back: 'Ctrl+ArrowRight',
        shortcut_settings: 'Ctrl+I',
        ia_type: 'nagaia',
        ia_key: '',
        ia_model: 'gpt-4'
      }

      fs.mkdirSync(path.join(homedir, '.daijin-ia'))
      fs.writeFileSync(path_name, JSON.stringify(defConfig, null, 2), 'utf-8')

      return defConfig
    }
  }

  function set(key: keyof ConfigInterface, value: any) {
    const config = get()
    config[key] = value as never
    fs.writeFileSync(path_name, JSON.stringify(config, null, 2))
  }

  return { get, set }
}
