import * as os from 'os'
import nodeos from 'node-os-utils'
import { exec } from 'child_process'
import si from 'systeminformation'

async function system(command: string) {
  try {
    const output = await new Promise<string | null>((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          resolve(null)
          return
        }
        resolve(stdout)
      })
    })
    return output
  } catch {
    return null
  }
}

async function getUserInfo() {
  const { username, homedir, shell } = os.userInfo()
  return { username, homedir, shell }
}

function getPlatform() {
  return os.platform()
}

async function getCpuUsage() {
  try {
    const cpu = await nodeos.cpu.usage()
    return cpu
  } catch {
    return null
  }
}

async function getMemoryInfo() {
  const free_mem = (await nodeos.mem.free()).freeMemMb
  const used_mem = (await nodeos.mem.used()).usedMemMb
  return { free_mem, used_mem }
}

async function getApps(platform: string) {
  let apps: string | null = null
  switch (platform) {
    case 'win32':
      apps = await system('wmic product get name')
      break
    case 'darwin':
    case 'linux':
      apps = await system('brew list')
      break
  }
  return apps
}

async function getProcesses(platform: string) {
  let proccess: string | null = null
  switch (platform) {
    case 'win32':
      proccess = await system('tasklist')
      break
    case 'darwin':
    case 'linux':
      proccess = await system('ps aux')
      break
  }
  return proccess
}

async function getMainboardInfo(platform: string) {
  let mainboard: string | null = null
  switch (platform) {
    case 'win32':
      mainboard = await system('wmic baseboard get product,Manufacturer,version')
      break
    case 'darwin':
      mainboard = await system(`system_profiler SPHardwareDataType | grep "Motherboard"`)
      break
    case 'linux':
      mainboard = await system('sudo dmidecode -t baseboard')
      break
  }
  return mainboard
}

async function getPackageManagerInfo() {
  const npm = await system('npm list -g --depth=0')
  const yarn = await system('yarn global list')
  const pnpm = await system('pnpm list -g --depth=0')
  return { npm, yarn, pnpm }
}

async function getCpuInfo() {
  const cpuInfo = await si.cpu()
  const cpu_name = `${cpuInfo.manufacturer} ${cpuInfo.brand} ${cpuInfo.speed} GHz`
  return cpu_name
}

export async function getOsInfo() {
  const osInfo = await si.osInfo()
  return osInfo
}

export async function getNetworkInterfaces() {
  const networkInterfaces = await si.networkInterfaces()
  return networkInterfaces
}

export async function getBatteryInfo() {
  const battery = await si.battery()
  return battery
}

export async function getDiskInfo() {
  const diskLayout = await si.diskLayout()
  const diskUsage = await si.fsSize()
  return { diskLayout, diskUsage }
}

export async function getUsers() {
  const users = await si.users()
  return users
}

export async function getGpuInfo() {
  const graphics = await si.graphics()
  return graphics
}

export default function getSystemInfos() {
  const platform = getPlatform()
  const systemname = platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'MacOS' : 'Linux'

  return {
    getUserInfo,
    getPlatform,
    getSystemName: () => systemname,
    getMemoryInfo,
    getCpuUsage,
    getApps: async () => await getApps(platform),
    getProcesses: async () => await getProcesses(platform),
    getMainboardInfo: async () => await getMainboardInfo(platform),
    getPackageManagerInfo,
    getCpuInfo,
    getOsInfo,
    getNetworkInterfaces,
    getBatteryInfo,
    getDiskInfo,
    getUsers,
    getGpuInfo
  }
}
