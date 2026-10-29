# TypeScript / Vue Style Guide

Applies to everything under `frontend/vue-i/`. Stack: Vue 3, TypeScript, Vuetify, Vite, Vitest, Cypress.

This is deliberately lighter than the [Python Style Guide](../../server/STYLEGUIDE.md). The goal is code the rest of the team can read and change, not perfection. When in doubt, copy what the surrounding code does.

If this guide and a tool disagree, the tool wins and this guide gets fixed.

## Must Pass

Before opening a PR, these must succeed from `frontend/vue-i/`:

- `yarn format:check` ([Prettier](https://prettier.io/)): code is formatted.
- `yarn lint` ([ESLint](https://eslint.org/), config in `eslint.config.js`): no lint errors. `yarn lint:fix` fixes what it can.
- `yarn type-check` (`vue-tsc`): no type errors.
- `yarn test:unit --run`: unit tests pass.

Don't silence the type checker or linter to get there. If you really need `// @ts-expect-error` or `// eslint-disable-next-line <rule>`, name the rule and add a reason on the same line.

## Formatting

Prettier owns formatting (config in `.prettierrc.json`: no semicolons, single quotes, line length 100). Run `yarn format` before committing, or install the recommended Prettier VS Code extension and turn on format-on-save. Don't hand-format or argue about whitespace.

- Naming: `camelCase` variables/functions, `PascalCase` components, types, and interfaces, `UPPER_SNAKE_CASE` for true constants.
- Component files are `PascalCase.vue` (`BoxPreview.vue`). Other files are `camelCase.ts`.
- Import with the `@/` alias (`@/components/BoxPreview.vue`) instead of long `../../` paths.

## Components

- Use `<script setup lang="ts">` and the Composition API. Don't use the Options API.
- Reach for a Vuetify component (`v-btn`, `v-text-field`, ...) before writing your own.
- Component names must be two words, to prevent conflicts with current and future HTML tags.
```html
<!-- Bad -->
<button/>
<search/>
<!-- Good -->
<view-button/>
<search-handler />
```
- Type props and emits with the generic form:

```vue
<script setup lang="ts">
const props = defineProps<{
  name: string
  thickness?: number
}>()

const emit = defineEmits<{
  select: [name: string]
}>()
</script>
```

- Keep `<style scoped>` so styles don't leak between components.
- If a component grows past a couple hundred lines, consider splitting it.

## Types

You don't need to annotate everything. Let TypeScript infer where it can.

- Annotate function parameters. Return types are optional unless the function is exported from a shared module.
- Avoid `any`. Prefer `unknown` and narrow it, or write a small type. If you truly need `any`, leave a comment saying why.
- Type data from the API. Write an `interface` that mirrors the server's Pydantic model (check `/docs` on the server for the shape), and keep these in one place (e.g. `src/types/`) instead of redefining them per component.

```ts
// Bad
const box: any = await res.json()

// Good
interface BoxSummary {
  name: string
  description: string
}
const box: BoxSummary = await res.json()
```

## Comments

Comment the *why* behind anything non-obvious. No need for doc comments on every function, just on shared helpers and composables. Don't commit commented-out code or `console.log` debugging.

## Errors

- Handle failed API calls. Show the user something (e.g. a Vuetify `v-alert` or snackbar) instead of failing silently.
- Don't swallow errors with an empty `catch {}`.

## Tests

Unit tests live in `src/**/__tests__/` and use Vitest + Vue Test Utils. Add tests for logic that would be painful to break (API helpers, calculations, form validation). Simple display-only components don't need them.

## Dependencies

- Use `yarn` (there's a `yarn.lock`). Don't commit a `package-lock.json`.
- Before adding a package, check whether Vue, Vuetify, or an existing dependency already does the job.
