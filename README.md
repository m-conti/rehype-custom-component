# rehype-custom-component

![npm](https://img.shields.io/npm/v/rehype-custom-component)
![license](https://img.shields.io/github/license/m-conti/rehype-custom-component)
![bundle size](https://img.shields.io/bundlephobia/min/rehype-custom-component)

A [rehype](https://github.com/rehypejs/rehype) plugin to transform custom component shortcodes into HTML elements for React integration.

## Installation

```bash
npm install rehype-custom-component
# or
yarn add rehype-custom-component
# or
pnpm add rehype-custom-component
```

## Usage

This plugin transforms `<CustomComponent>` shortcodes with props into custom HTML elements that can be handled by React or other frameworks.

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

const input = `<p>Check out this component: <CustomComponent name="button" {"type": "primary", "size": "large"} /></p>`;
const result = await processor.process(input);
console.log(String(result));
// Output: <p>Check out this component: <custom-component name="button" props="{&quot;type&quot;: &quot;primary&quot;, &quot;size&quot;: &quot;large&quot;}"></custom-component></p>
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

Here's a custom component: <CustomComponent name="card" {"title": "Hello", "theme": "dark"} />`;

const result = await processor.process(markdown);
```

## Shortcode Format

The plugin recognizes shortcodes in the format:

```
<CustomComponent name="componentName" {"prop1": "value1", "prop2": "value2"} />
```

### Multi-line Support

The plugin supports multi-line shortcodes:

```
<CustomComponent 
  name="complexComponent" 
  {
    "title": "My Title",
    "settings": {
      "theme": "dark",
      "size": "large"
    }
  } 
/>
```

### Examples

```typescript
// Simple component
<CustomComponent name="button" {"type": "primary"} />
// → <custom-component name="button" props="{&quot;type&quot;: &quot;primary&quot;}"></custom-component>

// Complex component with nested props
<CustomComponent name="card" {"title": "Hello", "meta": {"author": "John", "date": "2025-01-01"}} />
// → <custom-component name="card" props="{&quot;title&quot;: &quot;Hello&quot;, &quot;meta&quot;: {&quot;author&quot;: &quot;John&quot;, &quot;date&quot;: &quot;2025-01-01&quot;}}"></custom-component>

// Component without props
<CustomComponent name="simple" />
// → <custom-component name="simple" props="{}"></custom-component>

// Component with empty props
<CustomComponent name="button" {} />
// → <custom-component name="button" props="{}"></custom-component>
```

## Options

### `tagName`

- Type: `string`
- Default: `'custom-component'`

The HTML tag name to use for the generated elements.

```typescript
.use(rehypeCustomComponent, { tagName: 'my-component' })

// <CustomComponent name="button" {"type": "primary"} />
// → <my-component name="button" props="{&quot;type&quot;: &quot;primary&quot;}"></my-component>
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
const CustomComponentRenderer = ({ name, props, ...rest }) => {
  const parsedProps = typeof props === 'string' ? JSON.parse(props) : props;
  
  switch (name) {
    case 'button':
      return <Button {...parsedProps} />;
    case 'card':
      return <Card {...parsedProps} />;
    default:
      return <div data-unknown-component={name} {...parsedProps} />;
  }
};

// Register in your MDX or HTML processor
const components = {
  'custom-component': CustomComponentRenderer,
  // other components...
};
```

## Requirements

- Node.js 16 or higher
- `unist-util-visit` (peer dependency)

## License

MIT © Matthieu Conti

## Contributing

Issues and pull requests are welcome! Please check the existing issues before creating a new one.

## Related

- [rehype](https://github.com/rehypejs/rehype) - HTML processor powered by plugins
- [MDX](https://mdxjs.com/) - Markdown for the component era
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit) - Utility to visit nodes
