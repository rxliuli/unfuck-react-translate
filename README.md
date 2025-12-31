# Unfuck React Translate

Fix React SSR hydration errors when using browser translation tools.

## Problem

Browser translation tools wrap text nodes in `<font>` tags, causing React to detect DOM structure mismatches during hydration and throw errors.

Common error message:

```text
Application error: a client-side exception has occurred (see the browser console for more information).
```

Related discussions:

- <https://github.com/facebook/react/issues/28554>
- <https://dev.to/ivanturashov/preventing-react-crashes-handling-google-translate-5bi0>
- <https://github.com/facebook/react/issues/11538>

## Usage

1. Install the extension
2. Open the webpage you want to translate
3. Click the extension icon to enable
4. Use browser translation as normal

Click the icon to toggle the current website's status. Badge shows "ON" when enabled.

## Installation

Manual installation required:

1. Download or build the extension zip file
2. Open browser extensions page
3. Enable developer mode
4. Drag and drop the zip file to install

## Development

```sh
pnpm install
pnpm dev
```

Development build outputs to `.output/chrome-mv3-dev` directory. Load this directory at `chrome://extensions`.

## Build

```sh
# Chrome/Edge
pnpm zip

# Firefox
pnpm zip:firefox

# Safari (requires macOS and Xcode)
pnpm build:safari
```

For Safari builds, configure your `DEVELOPMENT_TEAM` ID in `.env.local`.

## How It Works

Patches `Document.prototype.createTextNode` to automatically wrap text nodes in span elements, preventing browser translation tools from breaking React hydration.

## License

GPL-3.0 License
