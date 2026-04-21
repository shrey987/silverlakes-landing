'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  onWidthChange: (w: number) => void;
}

export default function NdaPdfViewer({ onWidthChange }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        setContainerWidth(w);
        onWidthChange(w);
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [onWidthChange]);

  const onDocLoad = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  return (
    <div className="pdf-container" ref={containerRef}>
      <Document
        file="/nda.pdf"
        onLoadSuccess={onDocLoad}
        loading={
          <div style={{ color: 'rgba(255,255,255,0.3)', padding: '40px', fontSize: '13px' }}>
            Loading document...
          </div>
        }
        error={
          <div style={{ color: '#f87171', padding: '40px', fontSize: '13px' }}>
            Failed to load document.
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, i) => (
          <div key={i} className="pdf-page-wrap">
            <Page
              pageNumber={i + 1}
              width={Math.max(200, containerWidth - 32)}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
