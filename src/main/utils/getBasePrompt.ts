import CONFIG from '../../renderer/src/constants/Config'
import Config from './Config'
import getSystemInfos from './getSystemInfos'
import SystemInfoKeys from './SystemInfoKeys'

interface ConfigInterface {
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

function isKeypassWord(keys: string[], phrase: string) {
  return keys.some((key) => phrase.toLowerCase().includes(key.toLowerCase()))
}

export default async function getBasePrompt(prompt: string) {
  try {
    let config: ConfigInterface | null = Config().get()

    const userinfo = await getSystemInfos().getUserInfo()
    const platform = getSystemInfos().getSystemName()

    let base_prompt = `Você é uma inteligência artificial que está integrada no computador do ${userinfo.username} que tem como diretório home a pasta localizada em ${userinfo.homedir} e que usa o shell ${userinfo.shell}, o sistema operacional do usuário é ${platform}.

    Atualmente estou usando o serviço ${config.ia_type} para rodar a IA e no modelo ${config.ia_model}, estou na minha versão ${CONFIG.VERSION}.
    `

    if (isKeypassWord(SystemInfoKeys.memory, prompt)) {
      const memoryInfos = await getSystemInfos().getMemoryInfo()

      base_prompt += `
      Você tem um armazenamento de ${memoryInfos.free_mem} de memória livre e ${memoryInfos.used_mem} de memória usada.
      `
    }

    if (isKeypassWord(SystemInfoKeys.cpuUsage, prompt)) {
      const cpu = await getSystemInfos().getCpuUsage()

      if (cpu) {
        base_prompt += `
      Você está usando ${cpu}% da sua CPU.
      `
      }
    }

    if (isKeypassWord(SystemInfoKeys.apps, prompt)) {
      const apps = await getSystemInfos().getApps()

      if (apps) {
        base_prompt += `
        Você tem esses apps instalados: ${apps}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.processes, prompt)) {
      const processes = await getSystemInfos().getProcesses()

      if (processes) {
        base_prompt += `
        Você tem esses processos em execução: ${processes}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.mainboard, prompt)) {
      const mainboard = await getSystemInfos().getMainboardInfo()

      if (mainboard) {
        base_prompt += `
        Sua placa mãe é essa: ${mainboard}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.packageManager, prompt)) {
      const packageManager = await getSystemInfos().getPackageManagerInfo()

      if (packageManager) {
        base_prompt += `
        Você tem esses pacotes NPM instalados: ${packageManager.npm}
        Você tem esses pacotes YARN instalados: ${packageManager.yarn}
        Você tem esses pacotes PNPM instalados: ${packageManager.pnpm}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.cpuInfo, prompt)) {
      const cpuInfo = await getSystemInfos().getCpuInfo()

      if (cpuInfo) {
        base_prompt += `
        Essa é sua CPU: ${cpuInfo}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.osInfo, prompt)) {
      const osInfo = JSON.stringify(await getSystemInfos().getOsInfo())

      if (osInfo) {
        base_prompt += `
        Essas são as informações do sistema operacional: ${osInfo}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.network, prompt)) {
      const net = await getSystemInfos().getNetworkInterfaces()

      if (net) {
        base_prompt += `
        Informações da rede: ${JSON.stringify(net)}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.battery, prompt)) {
      const battery = await getSystemInfos().getBatteryInfo()

      if (battery) {
        base_prompt += `
        Informações da bateria: ${JSON.stringify(battery)}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.disk, prompt)) {
      const disk = JSON.stringify(await getSystemInfos().getDiskInfo())

      if (disk) {
        base_prompt += `
        Informações do disco: ${disk}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.users, prompt)) {
      const users = JSON.stringify(await getSystemInfos().getUsers())

      if (users) {
        base_prompt += `
        Usuários na máquina: ${users}
        `
      }
    }

    if (isKeypassWord(SystemInfoKeys.gpu, prompt)) {
      const gpu = JSON.stringify(await getSystemInfos().getGpuInfo())

      if (gpu) {
        base_prompt += `
        Placa de vídeo: ${gpu}
        `
      }
    }

    base_prompt += `
      Como assistente pessoal, você é bem amigável e sempre manda respostas bonitas formatadas com markdown, com emojis e fáceis de entender, e sempre responde as perguntas do usuário. Use as informações passadas apenas se necessário.
    `

    return base_prompt
  } catch (e) {
    console.error(e)
    return ''
  }
}
