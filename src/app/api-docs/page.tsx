'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  SwaggerUIBundleConstructor,
  SwaggerUIInstance,
  SwaggerUIOptions,
  SwaggerUIPreset,
  SwaggerUISpec,
} from 'swagger-ui-dist';

export default function ApiDocsPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const uiRef = useRef<SwaggerUIInstance | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const waitForRef = async (timeoutMs = 3000): Promise<void> => {
      const start = Date.now();
      return new Promise<void>((resolve, reject) => {
        const check = () => {
          if(cancelled) return reject(new Error('init cancelled'));
          if(containerRef.current) return resolve();
          if(Date.now() - start > timeoutMs) return reject(new Error('timeout waiting for containerRef'));
          requestAnimationFrame(check);
        };
        check();
      });
    };

    const init = async () => {
      try {
        console.debug('[swagger] init start');

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css';
        document.head.appendChild(link);
        linkRef.current = link;

        console.debug('[swagger] fetching /api/swagger');
        const res = await fetch('/api/swagger', { cache: 'no-store' });
        if(!res.ok) {
          console.error('[swagger] failed to fetch spec:', res.status, res.statusText);
          setIsLoading(false);
          return;
        }
        const spec = (await res.json()) as SwaggerUISpec;
        console.debug('[swagger] spec fetched, paths:', Object.keys(spec.paths || {}).length);

        await waitForRef(5000);
        console.debug('[swagger] containerRef present');

        const SwaggerUI = (await import(
          'swagger-ui-dist/swagger-ui-es-bundle.js'
        )).default as unknown as SwaggerUIBundleConstructor;

        const SwaggerUIStandalonePreset = (await import(
          'swagger-ui-dist/swagger-ui-standalone-preset.js'
        )).default as unknown as SwaggerUIPreset;

        if(containerRef.current) containerRef.current.innerHTML = '';

        const options: SwaggerUIOptions = {
          domNode: containerRef.current as Element,
          spec,
          presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout',
          deepLinking: true,
          persistAuthorization: true,
        };
        uiRef.current = SwaggerUI(options);

        console.debug('[swagger] UI created', uiRef.current);
      } catch(err) {
        console.error('[swagger] initialization error:', err);
      } finally {
        if(!cancelled) setIsLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      try {
        (uiRef.current as unknown as { destroy?: () => void })?.destroy?.();
      } catch(err) {
        console.warn('ui destroy failed:', err);
      }
      if(linkRef.current && linkRef.current.parentNode) {
        linkRef.current.parentNode.removeChild(linkRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative">
      <div id="swagger-ui" ref={containerRef} style={{ minHeight: '80vh' }} />

      {isLoading && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.8)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <div style={{ fontSize: 16, color: '#111' }}>Loading API Documentation…</div>
          </div>
        </div>
      )}
    </div>
  );
}