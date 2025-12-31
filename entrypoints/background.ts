import { get, set } from 'idb-keyval'
import { PublicPath } from 'wxt/browser'

const STORAGE_KEY = 'contentScriptEnabled'

async function getEnabledOrigins(): Promise<string[]> {
  const enabled = await get<string[]>(STORAGE_KEY)
  return enabled ?? []
}

async function setEnabledOrigins(origins: string[]): Promise<void> {
  await set(STORAGE_KEY, origins)
}

async function updateContentScripts() {
  const origins = await getEnabledOrigins()
  const registered = await browser.scripting.getRegisteredContentScripts()
  await browser.scripting.unregisterContentScripts({
    ids: registered.map((script) => script.id),
  })
  for (const origin of origins) {
    await browser.scripting.registerContentScripts(
      origins.map((origin) => ({
        id: origin,
        matches: [`${origin}/*`],
        js: ['/inject.js'] as PublicPath[],
        runAt: 'document_start',
        world: 'MAIN',
      })),
    )
  }
}

async function toggleContentScript(url?: string): Promise<void> {
  if (!url) {
    return
  }
  const origin = new URL(url).origin
  const origins = await getEnabledOrigins()
  const isOriginEnabled = origins.includes(origin)
  if (isOriginEnabled) {
    origins.splice(origins.indexOf(origin), 1)
  } else {
    origins.push(origin)
  }
  await setEnabledOrigins(origins)
  await updateContentScripts()
  await setIcon(url)
  await browser.tabs.reload()
}

async function setIcon(url?: string) {
  const enabled =
    url && (await getEnabledOrigins()).includes(new URL(url).origin)
  await browser.action.setBadgeText({ text: enabled ? 'ON' : '' })
  await browser.action.setBadgeBackgroundColor({
    color: enabled ? '#4CAF50' : '#000000',
  })
}

export default defineBackground(() => {
  browser.action.onClicked.addListener(async (ev) => {
    if (!ev.url) {
      return
    }
    console.log('Action icon clicked')
    await toggleContentScript(ev.url)
  })

  browser.runtime.onInstalled.addListener(async () => {
    await updateContentScripts()
    await browser.action.setBadgeText({ text: 'ON' })
    await browser.action.setBadgeBackgroundColor({ color: '#4CAF50' })
  })

  browser.tabs.onActivated.addListener(async (tabInfo) => {
    const tab = await browser.tabs.get(tabInfo.tabId)
    setIcon(tab.url)
  })
  browser.tabs.onCreated.addListener(async (tab) => {
    setIcon(tab.url)
  })
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    setIcon(tab.url)
  })
})
