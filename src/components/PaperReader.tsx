import { useEffect, useRef } from 'react';
import { Arrow, WellMark } from './Icons';
import { PaperText, paperSource } from './PaperText';

const contents = ['Introduction', 'The exact identity', 'Turning radii & bound', 'Threshold normalization', 'Topology (context)', 'Normal form (context)', 'Diffusivity (context)', 'Proposed protocol', 'Discussion'];

export default function PaperReader({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  const jump = (id: string) => ref.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  return (
    <dialog ref={ref} className="paper-reader" onCancel={(event) => { event.preventDefault(); onClose(); }} aria-label="Complete source research paper">
      <div className="reader-header">
        <div className="reader-brand"><WellMark /><span>THE SOURCE PAPER</span></div>
        <div><a className="text-link" href="/research-paper.md" download>Source .md <Arrow direction="down" /></a><button autoFocus className="reader-close" type="button" onClick={onClose}>Back to the essay <span aria-hidden="true">&times;</span></button></div>
      </div>
      <div className="reader-body">
        <aside className="reader-contents" aria-label="Paper contents">
          <p className="eyebrow">CONTENTS</p>
          {contents.map((title, index) => <button type="button" key={title} onClick={() => jump(`source-section-${index + 1}`)}><span>{String(index + 1).padStart(2, '0')}</span>{title}</button>)}
          <button type="button" onClick={() => jump('source-appendix')}><span>A</span>Code &amp; original log</button>
          <button type="button" onClick={() => jump('source-references')}><span>R</span>References</button>
        </aside>
        <article className="full-paper">
          <aside className="source-review-note"><strong>Editorial review note.</strong> The supplied log reports inconsistent small-threshold onset values. Eq. (7a) gives <strong>0.002430</strong> for alpha 0.05 and <strong>0.008452</strong> for alpha 0.10; the log prints 0.006024 and 0.010300. The source text, code, and log below are preserved for review. The live lab evaluates Eq. (7a).</aside>
          <PaperText text={paperSource} headingIds />
          <div className="reader-downloads"><a href="/downloads/appendix_a.py" download>Download Appendix A (.py) <Arrow direction="down" /></a><a href="/downloads/original-output.txt" download>Original logged output <Arrow direction="down" /></a><a href="/downloads/figure1.svg" download>Recomputed Figure 1 (.svg) <Arrow direction="down" /></a></div>
        </article>
      </div>
    </dialog>
  );
}