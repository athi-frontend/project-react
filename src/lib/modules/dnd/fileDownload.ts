export const handleFileDownloadUtil = (file, blob?: Blob) => {
  if (typeof document !== 'undefined') {
    const url = ''
    const a = document.createElement('a')
    a.href = url
    a.download = file?.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}
