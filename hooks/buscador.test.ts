import { expect, mock, test } from 'claude-code/testing'

test('/buscar-skill pide a Claude la búsqueda con la skill', async ($, on) => {
  const reloj = mock.clock(on)
  on('ui.toast', async () => ({ value: {} }) as never)
  const enviados: string[] = []
  on('prompt.submit', async (_$, e) => {
    enviados.push(e.text)
    return { text: e.text } as never
  })
  const r = await $.command.run({ command: 'buscar-skill', args: ' edición de vídeo ' } as never)
  expect(r.text).toContain('edición de vídeo')
  await reloj.advance(300)
  expect(enviados).toEqual(['Usa la skill buscador-de-skills: busca e instálame una skill para «edición de vídeo».'])
})

test('/buscar-skill sin tema no envía nada', async ($, on) => {
  const enviados: string[] = []
  on('prompt.submit', async (_$, e) => { enviados.push(e.text); return { text: e.text } as never })
  on('ui.open', async () => ({ value: { isPlaced: true } }) as never)
  const r = await $.command.run({ command: 'buscar-skill', args: '' } as never)
  expect(r.text).toContain('panel')
  expect(enviados.length).toBe(0)
})
