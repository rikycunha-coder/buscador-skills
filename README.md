# Buscador de skills para Claude

Mod para Claude Code que añade un panel fijo **Buscador de skills**: escribes un tema (o pulsas un atajo) y Claude busca, revisa e instala skills para esa tarea usando la skill `buscador-de-skills`.

- Campo **Tema** + Enter para buscar
- Atajos: Edición de vídeo, Obra y construcción, Godot / juegos, Apps Android, Documentos y PDF
- Botón **Ver mis skills instaladas**
- Últimas 5 búsquedas
- Comandos: `/buscar-skill <tema>` y `/panel-skills`

## Instalación

En el prompt de una sesión de Claude Code en la terminal:

```
/plugin install buscador-skills --marketplace rikycunha-coder/buscador-skills
```

Responde `y` para añadir el marketplace y elige el ámbito *user* con Enter.

Desde una terminal normal:

```
claude plugin install buscador-skills --marketplace rikycunha-coder/buscador-skills
```

En la app de escritorio (donde `/plugin` no funciona): pulsa **+** junto al cuadro de mensaje → **Plugins** → **Add marketplace** con `rikycunha-coder/buscador-skills` → **Add plugin**.
