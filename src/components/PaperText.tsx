import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import source from '../../research-paper.md?raw';

export { source as paperSource };

// The draft uses single-line display delimiters; normalize presentation only.
export function typesetMarkdown(text: string) {
  let inCode = false;
  return text.split('\n').map((line) => {
    if (line.startsWith('```')) inCode = !inCode;
    if (inCode) return line;
    const trimmed = line.trim();
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      return `\n$$\n${trimmed.slice(2, -2)}\n$$\n`;
    }
    if (/^\[\d+\]/.test(line)) return `\n${line}`;
    return line;
  }).join('\n');
}

export function sectionText(number: number) {
  const start = source.indexOf(`## ${number}.`);
  const next = source.indexOf('\n## ', start + 1);
  return source.slice(start, next > -1 ? next : undefined).split('\n').slice(1).join('\n').replace(/\n---\s*$/, '');
}

export function PaperText({ text, headingIds = false }: { text: string; headingIds?: boolean }) {
  return (
    <div className="paper-prose">
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false }]]}
        components={{
          table: ({ children }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Scrollable research data table"><table>{children}</table></div>,
          pre: ({ children }) => <pre tabIndex={0} role="region" aria-label="Source code or original logged output, scroll to read">{children}</pre>,
          span: ({ className, children, node: _node, ...rest }) => {
            const displayMath = className?.split(' ').includes('katex-display');
            return <span {...rest} className={className} tabIndex={displayMath ? 0 : rest.tabIndex} role={displayMath ? 'region' : rest.role} aria-label={displayMath ? 'Display equation, scroll horizontally if needed' : rest['aria-label']}>{children}</span>;
          },
          h2: ({ children }) => {
            const label = String(children);
            const number = label.match(/^(\d+)\./)?.[1];
            const id = number ? `source-section-${number}` : label.startsWith('Appendix') ? 'source-appendix' : 'source-references';
            return <h2 id={headingIds ? id : undefined}>{children}</h2>;
          },
        }}
      >{typesetMarkdown(text)}</Markdown>
    </div>
  );
}