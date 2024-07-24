import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { ConfigInterface } from '../../../main/utils/Config'
import OpenAI from 'openai'

export default class Brain {
  private systemPrompt: ConfigInterface | null = null

  async learn() {
    // @ts-ignore
    await window.api.refreshPrompt()
    // @ts-ignore
    this.systemPrompt = await window.api.getConfig()
  }

  async answer_this(
    history: ChatCompletionMessageParam[],
    prompt: string,
    callback: (result: string) => void
  ): Promise<void> {
    try {
      if (this.systemPrompt) {
        //@ts-ignore
        const confis: ConfigInterface = await window.api.getConfig()

        const apiKey = confis.ia_key
        const apiModel = confis.ia_model
        const apiType = confis.ia_type

        if (apiKey.length < 5) {
          throw new Error(
            'Parece que você ainda não me configurou corretamente 😅 para configurar basta abrir as configurações do meu aplicativo e ir na parte "IA" lá você poderá escolher o modelo, ia e colocar a sua chave de API.'
          )
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
          throw new Error(
            'Não consegui verificar nada por aqui 😒 isso é um pouco estranho, você alterou o arquivo de configurações manualmente ? esse erro realmente não é nada comum, tente repreencher suas configurações.'
          )
        }

        const response = await openai.chat.completions.create({
          model: apiModel,
          messages: [
            {
              role: 'system',
              content: this.systemPrompt.prompt
            },
            ...history,
            { role: 'user', content: prompt }
          ],
          stream: true
        })

        if (response) {
          for await (const chunk of response) {
            const deltaContent = chunk.choices[0]?.delta?.content

            if (deltaContent !== undefined) {
              callback(deltaContent || '')
            }
          }
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        callback(e.message)
        return
      }

      callback(String(e))
    }
  }
}
