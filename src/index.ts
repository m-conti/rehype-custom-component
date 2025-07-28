import { visit } from 'unist-util-visit';
import type { Element, Text, Root, Parent } from 'hast';

interface CustomComponentOptions {
  tagName?: string; // Name of the custom element to create
  matchName?: string; // Name of the custom component to match
}

export default function rehypeCustomComponent({
  tagName = 'custom-component',
  matchName = 'CustomComponent',
}: CustomComponentOptions = {}) {

  // Regex to match custom component shortcodes with XML attributes: <CustomComponent name="iconname" attr="value" flag />
  const REGEX = /<MATCH\s+([^>]*?)\/>/;
  const CC_REGEX = new RegExp(REGEX.source.replace('MATCH', matchName), 'gs');

  const processTextNode = (text: string): (Text | Element)[] => {
    const nodes: (Text | Element)[] = [];
    let lastIndex = 0;

    // Use matchAll for modern iteration over all matches
    for (const match of text.matchAll(CC_REGEX)) {
      const [fullMatch, attributesString] = match;
      const startIndex = match.index ?? 0;

      // If there's text before the match, add it as a text node
      if (startIndex > lastIndex) {
        nodes.push({
          type: 'text',
          value: text.slice(lastIndex, startIndex)
        });
      }

      // Parse XML attributes using modern ES6+ approach
      const properties = [...attributesString.matchAll(/(\w+)(?:=(?:"([^"]*)"|([^\s>]+)))?/g)]
        .reduce((acc, [, attrName, quotedValue, unquotedValue]) => ({
          ...acc,
          [attrName]: quotedValue ?? unquotedValue ?? true
        }), {} as Record<string, any>);
      
      nodes.push({
        type: 'element',
        tagName,
        properties,
        children: []
      });

      lastIndex = startIndex + fullMatch.length;
    }

    // Add remaining text if any exists
    if (lastIndex < text.length) {
      nodes.push({
        type: 'text',
        value: text.slice(lastIndex)
      });
    }

    return nodes.length > 0 ? nodes : [{ type: 'text', value: text }];
  };

  const onVisit = (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined || !('children' in parent)) return;

      const processed = processTextNode(node.value);

      // Replace only if we found CustomComponent matches
      if (processed.length > 1 || processed[0]?.type === 'element') {
        parent.children.splice(index, 1, ...processed);
      }
    };

  // Return the transformer function
  return (tree: Root) => {
    visit(tree, 'text', onVisit);
    visit(tree, 'raw', onVisit);
  };
}

export type { CustomComponentOptions };
