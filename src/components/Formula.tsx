import { memo } from 'react';
import katex from 'katex';

export const MathText = memo(function MathText({
  children,
  className = '',
}: {
  children: string;
  className?: string;
}) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    output: 'htmlAndMathml',
    strict: false,
  });
  return <span className={`math-inline ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
});

export const Equation = memo(function Equation({
  children,
  number,
  className = '',
}: {
  children: string;
  number?: string;
  className?: string;
}) {
  const html = katex.renderToString(children, {
    displayMode: true,
    throwOnError: false,
    output: 'htmlAndMathml',
    strict: false,
  });
  return (
    <div className={`equation ${className}`}>
      <div className="equation-scroll" tabIndex={0} role="region" aria-label={number ? `Equation ${number}, scroll horizontally if needed` : 'Mathematical equation, scroll horizontally if needed'} dangerouslySetInnerHTML={{ __html: html }} />
      {number && <span className="equation-number">({number})</span>}
    </div>
  );
});