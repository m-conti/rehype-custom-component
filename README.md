# rehype-custom-component

![npm](https://img.shields.io/npm/v/rehype-custom-component)
![license](https://img.shields.io/github/license/m-conti/rehype-custom-component)
![bundle size](https://img.shields.io/bundlephobia/min/rehype-custom-component)

A modern [rehype](https://github.com/rehypejs/rehype) plugin to transform custom component shortcodes with XML attributes into HTML elements for React integration.

## Installation

```bash
npm install rehype-custom-component
# or
yarn add rehype-custom-component
# or
pnpm add rehype-custom-component
```

## Usage

This plugin transforms `<CustomComponent>` shortcodes with standard XML/HTML attributes into custom HTML elements that can be handled by React or other frameworks.

### Basic Usage

```typescript
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeCustomComponent from 'rehype-custom-component';

const processor = unified()
  .use(rehypeParse)
  .use(rehypeCustomComponent)
  .use(rehypeStringify);

const input = `<p>Check out this component: <CustomComponent name="button" type="primary" /></p>`;
const result = await processor.process(input);
console.log(String(result));
// Output: <p>Check out this component: <custom-component name="button" type="primary"></custom-component></p>
```

### With Markdown

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeCustomComponent from 'rehype-custom-component';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeCustomComponent)
  .use(rehypeStringify);

const markdown = `# My Page

Here's a custom component: <CustomComponent name="card" title="Hello" theme="dark" />`;

const result = await processor.process(markdown);
```

## Shortcode Format

The plugin recognizes shortcodes with standard XML/HTML attribute syntax:

```xml
<CustomComponent name="componentName" attr1="value1" attr2="value2" />
```

### Supported Attribute Formats

```xml
<!-- Quoted values -->
<CustomComponent name="button" type="primary" />

<!-- Unquoted values -->
<CustomComponent name="icon" size=large />

<!-- Boolean attributes (flags) -->
<CustomComponent name="input" required disabled />

<!-- Mixed attributes -->
<CustomComponent name="card" title="Hello" active priority=high />
```

### Multi-line Support

The plugin supports multi-line shortcodes with flexible formatting:

```xml
<!-- Standard multi-line -->
<CustomComponent 
  name="complexComponent" 
  title="My Title"
  theme="dark"
  size="large"
/>

<!-- Minimal multi-line -->
<CustomComponent
  data="value"
  />
```

### Examples

```xml
<!-- Simple component -->
<CustomComponent name="button" type="primary" />
→ <custom-component name="button" type="primary"></custom-component>

<!-- Complex component with multiple attributes -->
<CustomComponent name="card" title="Hello" author="John" published />
→ <custom-component name="card" title="Hello" author="John" published></custom-component>

<!-- Component without additional attributes -->
<CustomComponent name="simple" />
→ <custom-component name="simple"></custom-component>

<!-- Component with boolean flags -->
<CustomComponent name="input" required disabled />
→ <custom-component name="input" required disabled></custom-component>
```

## Options

### `tagName`

- Type: `string`
- Default: `'custom-component'`

The HTML tag name to use for the generated elements.

```typescript
.use(rehypeCustomComponent, { tagName: 'my-component' })

// <CustomComponent name="button" type="primary" />
// → <my-component name="button" type="primary"></my-component>
```

### `matchName`

- Type: `string`
- Default: `'CustomComponent'`

The component name to match in the source text.

```typescript
.use(rehypeCustomComponent, { matchName: 'MyComponent' })

// <MyComponent name="button" type="primary" />
// → <custom-component name="button" type="primary"></custom-component>
```

## TypeScript

This package includes TypeScript declarations and supports both CommonJS and ES modules.

```typescript
import rehypeCustomComponent, { CustomComponentOptions } from 'rehype-custom-component';

const options: CustomComponentOptions = {
  tagName: 'my-component'
};
```

## React Integration

The generated HTML elements can be easily handled in React:

```jsx
// Create a custom component handler
const CustomComponentRenderer = ({ name, ...props }) => {
  switch (name) {
    case 'button':
      return <Button {...props} />;
    case 'card':
      return <Card {...props} />;
    case 'icon':
      return <Icon {...props} />;
    default:
      return <div data-unknown-component={name} {...props} />;
  }
};

// Register in your MDX or HTML processor
const components = {
  'custom-component': CustomComponentRenderer,
  // other components...
};

// Usage example with the generated attributes
// <CustomComponent name="button" type="primary" size="large" disabled />
// becomes:
// <Button type="primary" size="large" disabled />
```

## Advanced Usage

### Custom Component Names

You can configure the plugin to match different component names:

```typescript
// Match React-style components
.use(rehypeCustomComponent, { 
  matchName: 'ReactComponent',
  tagName: 'react-component' 
})

// Match Vue-style components
.use(rehypeCustomComponent, { 
  matchName: 'VueComponent',
  tagName: 'vue-component' 
})
```

### Processing Pipeline

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeCustomComponent from 'rehype-custom-component';
import rehypeStringify from 'rehype-stringify';

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeCustomComponent, {
    tagName: 'my-component',
    matchName: 'Component'
  })
  .use(rehypeStringify, { allowDangerousHtml: true });

const markdown = `
# My Document

<Component name="hero" title="Welcome" subtitle="Get started" primary />

Regular markdown content continues here.
`;

const result = await processor.process(markdown);
```

## Requirements

- Node.js 16 or higher
- Modern ES6+ environment supporting `matchAll()`, nullish coalescing (`??`), and spread syntax

## Features

- ✅ **Modern ES6+ implementation** with array destructuring and functional programming patterns
- ✅ **XML/HTML attribute syntax** - familiar and standard
- ✅ **Multi-line component support** with flexible formatting
- ✅ **Boolean attributes** for flags and toggles
- ✅ **Quoted and unquoted values** support
- ✅ **Configurable component names** and output tag names
- ✅ **TypeScript support** with full type definitions
- ✅ **Zero dependencies** except for peer dependencies

## License

MIT © Matthieu Conti

## Contributing

Issues and pull requests are welcome! Please check the existing issues before creating a new one.

## Related

- [rehype](https://github.com/rehypejs/rehype) - HTML processor powered by plugins
- [MDX](https://mdxjs.com/) - Markdown for the component era
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - Utility to visit nodes
