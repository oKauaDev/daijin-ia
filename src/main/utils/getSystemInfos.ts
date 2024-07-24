import * as os from 'os'
import nodeos from 'node-os-utils'
import { exec } from 'child_process'
import si from 'systeminformation'

async function system(command: string) {
  try {
    const apps = await new Promise<string | null>((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve(null)
          return
        }
        if (stderr) {
          resolve(null)
          return
        }

        resolve(stdout)
      })
    })

    return apps
  } catch {
    return null
  }
}

export default async function getSystemInfos() {
  console.log('Pegando informações do sistema')
  const { username, homedir, shell } = os.userInfo()
  const platform = os.platform()

  let cpu: number | null = null

  try {
    console.log('Pegando CPU')
    cpu = await nodeos.cpu.usage()
  } catch {
    cpu = null
  }

  console.log('Pegando Memória livre')
  const free_mem = (await nodeos.mem.free()).freeMemMb
  console.log('Pegando Memória usada')
  const used_mem = (await nodeos.mem.used()).usedMemMb

  let apps: string | null = null
  let proccess: string | null = null
  let systemname: string | null = null
  let mainboard: string | null = null

  switch (platform) {
    case 'win32':
      console.log('Pegando Apps')
      apps = await system('wmic product get name')
      console.log('Pegando Processos')
      proccess = await system('tasklist')
      console.log('Pegando Placa Mãe')
      mainboard = await system('wmic baseboard get product,Manufacturer,version')
      systemname = 'Windows'
      break
    case 'darwin':
      console.log('Pegando Apps')
      apps = await system('brew list')
      console.log('Pegando Processos')
      proccess = await system('ps aux')
      console.log('Pegando Placa Mãe')
      mainboard = await system(`system_profiler SPHardwareDataType | grep "Motherboard"`)
      systemname = 'MacOS'
      break
    case 'linux':
      console.log('Pegando Apps')
      apps = await system('brew list')
      console.log('Pegando Processos')
      proccess = await system('ps aux')
      systemname = 'Linux'
      console.log('Pegando Placa Mãe')
      mainboard = await system('sudo dmidecode -t baseboard')
      break
  }

  console.log('Pegando NPM')
  const npm = await system('npm list -g --depth=0')
  console.log('Pegando Yarn')
  const yarn = await system('yarn global list')
  console.log('Pegando Pnpm')
  const pnpm = await system('pnpm list -g --depth=0')

  console.log('Pegando informações da CPU')
  const cpuInfo = await si.cpu()

  const cpu_name = `${cpuInfo.manufacturer} ${cpuInfo.brand} ${cpuInfo.speed}, "GHz"`

  return {
    username,
    homedir,
    shell,
    systemname,
    cpu,
    free_mem,
    used_mem,
    apps,
    proccess,
    npm,
    yarn,
    pnpm,
    mainboard,
    cpu_name
  }
}
