import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Busqueda } from '../types'

const PANEL = 'buscador-skills'
const TITULO = 'Buscador de skills'
const recientes = atom({ plugin: 'buscador-skills', key: 'recientes' } as const, [] as Busqueda[])

const ATAJOS = ['Edición de vídeo', 'Obra y construcción', 'Godot / juegos', 'Apps Android', 'Documentos y PDF']

/** Texto que se envía a Claude para lanzar la búsqueda con la skill. */
export function peticion(tema: string): string {
  return `Usa la skill buscador-de-skills: busca e instálame una skill para «${tema.trim()}».`
}

/** Guarda la búsqueda en recientes y se la pide a Claude (como si la escribieras tú). */
async function buscar($: EngineInterface, tema: string): Promise<boolean> {
  const limpio = tema.trim()
  if (!limpio) return false
  await update($, recientes, l => [{ tema: limpio }, ...l.filter(b => b.tema !== limpio)].slice(0, 5))
  void $.prompt.submit({ text: peticion(limpio), asUser: true })
  $.ui.toast(`Buscando skills para «${limpio}»…`)
  return true
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'buscar-skill', description: 'Busca e instala una skill: /buscar-skill <tema>' })
    await $.command.register({ name: 'panel-skills', description: 'Abre el panel del buscador de skills' })
    void $.ui.open({ id: PANEL, title: TITULO })
    return next(e)
  })

  on('command.run', { command: 'buscar-skill' }, async ($, e) => {
    const tema = e.args.trim()
    if (!tema) {
      await $.ui.open({ id: PANEL, title: TITULO, focus: true })
      return { text: 'Escribe el tema en el panel, o usa /buscar-skill <tema>.' }
    }
    // Un comando no puede lanzar un turno mientras se ejecuta: se envía justo después.
    $.clock.after(200, () => void buscar($, tema))
    return { text: `Buscando skills para «${tema}»…` }
  })

  on('command.run', { command: 'panel-skills' }, async $ => {
    await $.ui.open({ id: PANEL, title: TITULO, focus: true })
    return { text: 'Panel del buscador de skills abierto.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANEL }, async ($, e) => {
    const { Box, Text, Button, Input } = $.ui.resolve(e)
    const lista = await read($, recientes)

    return (
      <Box flexDirection="column" gap={1}>
        <Text bold>🔎 Buscador de skills</Text>
        <Input
          key="tema"
          label="Tema:"
          placeholder="¿Qué quieres que Claude sepa hacer?"
          submitLabel="buscar"
          autoFocus
          onSubmit={valor => void buscar($, valor)}
        />
        <Box flexDirection="column">
          <Text dimColor>Atajos</Text>
          {ATAJOS.map(t => (
            <Button key={`atajo-${t}`} onPress={() => void buscar($, t)}>{t}</Button>
          ))}
        </Box>
        <Button
          key="mis-skills"
          variant="primary"
          onPress={() => void $.prompt.submit({ text: 'Enséñame las skills que tengo instaladas.', asUser: true })}
        >
          Ver mis skills instaladas
        </Button>
        {lista.length > 0 && (
          <Box flexDirection="column">
            <Text dimColor>Búsquedas recientes</Text>
            {lista.map(b => (
              <Button key={`rec-${b.tema}`} onPress={() => void buscar($, b.tema)}>{b.tema}</Button>
            ))}
          </Box>
        )}
      </Box>
    )
  })
}
