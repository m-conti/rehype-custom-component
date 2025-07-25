import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeCustomComponent from '../src/index.js';
import type { Root, Element } from 'hast';

describe('rehype-custom-component', () => {
  const createProcessor = (options = {}) =>
    unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeCustomComponent, options);

  it('transforms basic custom component shortcodes in text nodes', async () => {
    const processor = createProcessor();
    // Create a tree with text content containing the shortcode
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Check this out <CustomComponent name="button" {"type": "primary"} />' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children).toHaveLength(2);
    expect(pElement.children[0]).toEqual({
      type: 'text',
      value: 'Check this out '
    });
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'button',
        props: { type: 'primary' }
      },
      children: []
    });
  });

  it('transforms custom component with complex props', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Like this <CustomComponent name="card" {"title": "Hello", "meta": {"author": "John"}} />' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children).toHaveLength(2);
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'card',
        props: { title: 'Hello', meta: { author: 'John' } }
      },
      children: []
    });
  });

  it('transforms multiple custom components in the same text', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'I love <CustomComponent name="button" {"type": "primary"} /> and <CustomComponent name="icon" {"name": "heart"} /> coding!' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children).toHaveLength(5);
    expect(pElement.children[0]).toEqual({
      type: 'text',
      value: 'I love '
    });
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'button',
        props: { type: 'primary' }
      },
      children: []
    });
    expect(pElement.children[2]).toEqual({
      type: 'text',
      value: ' and '
    });
    expect(pElement.children[3]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'icon',
        props: { name: 'heart' }
      },
      children: []
    });
    expect(pElement.children[4]).toEqual({
      type: 'text',
      value: ' coding!'
    });
  });

  it('supports custom tag name', async () => {
    const processor = createProcessor({ tagName: 'my-component' });
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Custom <CustomComponent name="button" {"type": "primary"} />' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'my-component',
      properties: {
        name: 'button',
        props: { type: 'primary' }
      },
      children: []
    });
  });

  it('handles multi-line custom components', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: `Multi-line <CustomComponent 
  name="complex" 
  {"config": {"theme": "dark", "size": "large"}} 
/>` 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'complex',
        props: { config: { theme: 'dark', size: 'large' } }
      },
      children: []
    });
  });

  it('handles custom component without props', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Simple <CustomComponent name="simple" />' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children).toHaveLength(2);
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'simple',
        props: {}
      },
      children: []
    });
  });

  it('ignores text without custom component shortcodes', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Just regular text here' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children).toHaveLength(1);
    expect(pElement.children[0]).toEqual({
      type: 'text',
      value: 'Just regular text here'
    });
  });

  it('handles malformed shortcodes gracefully', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Malformed <CustomComponent name="test" invalid /> text' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    // Should remain unchanged since it doesn't match the regex
    expect(pElement.children).toHaveLength(1);
    expect(pElement.children[0]).toEqual({
      type: 'text',
      value: 'Malformed <CustomComponent name="test" invalid /> text'
    });
  });

  it('handles empty props object', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            { 
              type: 'text', 
              value: 'Empty props <CustomComponent name="simple" {} />' 
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const pElement = result.children[0] as Element;
    
    expect(pElement.children[1]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'simple',
        props: {}
      },
      children: []
    });
  });

  it('preserves other content', async () => {
    const processor = createProcessor();
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {},
          children: [
            {
              type: 'element',
              tagName: 'strong',
              properties: {},
              children: [{ type: 'text', value: 'Bold' }]
            },
            { 
              type: 'text', 
              value: ' <CustomComponent name="test" {"id": 1} /> ' 
            },
            {
              type: 'element',
              tagName: 'em',
              properties: {},
              children: [{ type: 'text', value: 'italic' }]
            }
          ]
        }
      ]
    };
    const result = await processor.run(tree) as Root;
    const divElement = result.children[0] as Element;
    
    expect(divElement.children).toHaveLength(5);
    expect(divElement.children[0]).toEqual({
      type: 'element',
      tagName: 'strong',
      properties: {},
      children: [{ type: 'text', value: 'Bold' }]
    });
    expect(divElement.children[1]).toEqual({
      type: 'text',
      value: ' '
    });
    expect(divElement.children[2]).toEqual({
      type: 'element',
      tagName: 'custom-component',
      properties: {
        name: 'test',
        props: { id: 1 }
      },
      children: []
    });
    expect(divElement.children[3]).toEqual({
      type: 'text',
      value: ' '
    });
    expect(divElement.children[4]).toEqual({
      type: 'element',
      tagName: 'em',
      properties: {},
      children: [{ type: 'text', value: 'italic' }]
    });
  });
});
