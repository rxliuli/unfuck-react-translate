function patchCreateTextNode() {
  const originalCreateTextNode = Document.prototype.createTextNode
  Document.prototype.createTextNode = function (data: string) {
    if (this.nodeType === Node.DOCUMENT_NODE && data.trim() !== '') {
      const span = this.createElement('span')
      span.className = 'auto-wrapped-text-by-patch'
      span.appendChild(originalCreateTextNode.call(this, data))
      return span
    }
    return originalCreateTextNode.call(this, data) as any
  }
  return () => {
    Document.prototype.createTextNode = originalCreateTextNode
  }
}

export default defineUnlistedScript(() => {
  console.log('Inject script loaded')
  patchCreateTextNode()
})
