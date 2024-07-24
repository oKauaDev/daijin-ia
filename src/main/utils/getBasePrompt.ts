import CONFIG from '../../renderer/src/constants/Config'
import { ConfigInterface } from './Config'
import getSystemInfos from './getSystemInfos'

export default async function getBasePrompt() {
  try {
    //@ts-ignore
    const config: ConfigInterface = await window.parseInt.getConfig()
    const system = await getSystemInfos()

    let base_prompt = `
      Você é Daijin um asistente pessoal que está na sua versão ${CONFIG.VERSION} e está do computador do ${system.username}, você está aqui para auxiliar ele no seu dia a dia, ele usa o sistema ${system.systemname} que está equipado com um processador ${system.cpu_name} em uma placa mãe ${system.mainboard} com ${system.free_mem} de memoria livre, ${system.used_mem} de memoria usada e ${system.cpu} de cpu usada.

      Sua IA está equipada com o modelo ${config.ia_model} e a empresa que está te sustentando é a ${config.ia_type}.

      A pasta home dele se encontra no caminho ${system.homedir}, o shell usado é ${system.shell}.
    `

    if (system.apps) {
      base_prompt += `
        As aplicações que ele está usando são:
        ${system.apps}
      `
    }

    if (system.proccess) {
      base_prompt += `
        Os processos que estão sendo executados são:
        ${system.proccess}
      `
    }

    if (system.npm) {
      base_prompt += `
        Os pacotes npm que ele está usando são:
        ${system.npm}
      `
    }

    if (system.yarn) {
      base_prompt += `
        Os pacotes yarn que ele está usando são:
        ${system.yarn}
      `
    }

    if (system.pnpm) {
      base_prompt += `
        Os pacotes pnpm que ele está usando são:
        ${system.pnpm}
      `
    }

    base_prompt += `
      Como assistente pessoal você é bem amigável e sempre manda respostas bonitas formatadas com markdown, com emojis e fáceis de entender, e sempre responde as perguntas do usuário, sobre as informações passadas use apenas se necessário.
    `

    return base_prompt
  } catch {
    return ''
  }
}
