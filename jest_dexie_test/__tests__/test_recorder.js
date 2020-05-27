import Dexie from 'dexie'
import setGlobalVars from '@indexeddbshim/indexeddbshim'
import { JSDOM } from 'jsdom'

test('test', async () => {
  const { window } = new JSDOM('',  {
    url: 'https://example.com/',
  })
  setGlobalVars(window)
  global.XMLHttpRequest = window.XMLHttpRequest
  global.Blob = window.Blob;

  const { createObjectURL, xmlHttpRequestOverrideMimeType} = await import('typeson-registry/polyfills/createObjectURL-cjs.js');
  URL.createObjectURL = createObjectURL
  XMLHttpRequest.prototype.overrideMimeType = xmlHttpRequestOverrideMimeType()

  const db = new Dexie('recordings', {indexedDB: window.shimIndexedDB, IDBKeyRange: window.IDBKeyRange})
  db.version(1).stores({files: 'name'})
  const table = db.files
  const blob = new window.Blob([new Uint8Array([1, 2, 3])])
  await table.put({name: 'file.bin', data: blob})
})
