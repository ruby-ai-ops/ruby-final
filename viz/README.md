# [Ruby](https://ruby.ad)

Build RubyUI before starting or building Viz, from the repository root:

```sh
npm -w ui run build
npm -w viz run dev
```

RubyUI is used by Viz's own UI. Generated Frames continue to use the existing runtime imports.
Import individual components through RubyUI's exported `dist/esm/*` paths to avoid unrelated CSS side effects from the package entry point. The slideshow icons use Viz's existing styles. Styled components such as Document will require a separate integration of RubyUI's theme, which changes typography and colors used by saved Frames.

Embedded Frames receive Ruby's resolved theme through `?theme=light|dark`. Changing Ruby's theme reloads the iframe and resets its local state. Missing or invalid theme values and PDF rendering use light mode. Theme support uses Viz's existing semantic colors and emitted dark variants.
