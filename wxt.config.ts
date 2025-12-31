import { defineConfig, UserManifest } from 'wxt'

export default defineConfig({
  manifestVersion: 3,
  manifest: (env) => {
    const manifest: UserManifest = {
      name: 'Unfuck React Translate',
      description:
        'Automatically wrap text nodes created by React in a span for better translation support.',
      permissions: ['scripting', 'activeTab'],
      host_permissions: ['<all_urls>'],
      web_accessible_resources: [
        {
          matches: ['<all_urls>'],
          resources: ['inject.js'],
        },
      ],
      author: {
        email: 'rxliuli@gmail.com',
      },
      action: {},
      homepage_url: 'https://rxliuli.com/project/unfuck-react-translate',
    }
    if (env.browser === 'firefox') {
      manifest.browser_specific_settings = {
        gecko: {
          id:
            manifest.name!.toLowerCase().replaceAll(/[^a-z0-9]/g, '-') +
            '@rxliuli.com',
          // @ts-expect-error https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#data_collection_permissions
          data_collection_permissions: {
            required: ['none'],
          },
        },
      }
      // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/author
      // @ts-expect-error
      manifest.author = 'rxliuli'
    }
    return manifest
  },
  webExt: {
    disabled: true,
  },
})
