export type Busqueda = { tema: string }

declare module 'claude-code' {
  interface PluginState {
    'buscador-skills': { recientes: Busqueda[] }
  }
}
