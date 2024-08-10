import { ChatCompletionMessageParam } from 'openai/resources'
import OpenAI from 'openai'
import Config from '../utils/Config'
import getBasePrompt from '../utils/getBasePrompt'

export default class Daijin {
  private history: ChatCompletionMessageParam[]
  private prompt: string

  constructor(history: ChatCompletionMessageParam[], prompt: string) {
    this.history = history
    this.prompt = prompt
  }

  public async proccess() {
    try {
      const systemPrompt = await getBasePrompt()

      const confis = Config().get()

      const apiKey = confis.ia_key
      const apiModel = confis.ia_model
      const apiType = confis.ia_type

      if (apiKey.length < 5) {
        return 'Parece que você ainda não me configurou corretamente 😅 para configurar basta abrir as configurações do meu aplicativo e ir na parte "IA" lá você poderá escolher o modelo, ia e colocar a sua chave de API.'
      }

      let openai: OpenAI | null = null

      if (apiType === 'nagaia') {
        openai = new OpenAI({
          baseURL: 'https://api.naga.ac/v1',
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        })
      } else {
        openai = new OpenAI({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        })
      }

      if (!openai) {
        return 'Não consegui verificar nada por aqui 😒 isso é um pouco estranho, você alterou o arquivo de configurações manualmente ? esse erro realmente não é nada comum, tente repreencher suas configurações.'
      }

      const response = await openai.chat.completions.create({
        model: apiModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          ...this.history,
          { role: 'user', content: this.prompt }
        ]
      })

      if (response) {
        const message = response.choices[0].message.content
        return message
      }

      return 'Houve um errinho na hora de processar o prompt 😒'
    } catch (e) {
      if (e instanceof Error) {
        return e.message
      }

      return String(e) ?? ''
    }

    return 'Algo de muito errado não está certo, tente novamente mais tarde 😒'
  }
}
