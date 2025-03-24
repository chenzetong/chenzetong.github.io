'use client';

import { useEffect, useState } from 'react';

export default function Debug() {
  const [info, setInfo] = useState({
    path: '',
    href: '',
    origin: '',
    host: ''
  });

  useEffect(() => {
    setInfo({
      path: window.location.pathname,
      href: window.location.href,
      origin: window.location.origin,
      host: window.location.host
    });
  }, []);

  return (
    <main>
      <h1>调试信息</h1>
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1rem', 
        borderRadius: '0.25rem',
        marginTop: '1rem'
      }}>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(info, null, 2)}
        </pre>
      </div>
    </main>
  );
} 