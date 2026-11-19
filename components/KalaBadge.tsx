'use client';

import React, { useEffect, useState } from 'react';
import { getKalaStatus, KalaStatus } from '@/lib/logic';

export default function KalaBadge() {
  const [status, setStatus] = useState<KalaStatus | null>(null);

  useEffect(() => {
    // Initial calculation on mount
    setStatus(getKalaStatus());

    // Update every minute
    const interval = setInterval(() => {
      setStatus(getKalaStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (!status) {
    return (
      <div className="kala-chip" aria-live="polite">
        <span className="kala-dot" aria-hidden="true" />
        <span>Monokala Coffee · Buka 07.00 – 23.00 WIB</span>
      </div>
    );
  }

  return (
    <div className="kala-chip" aria-live="polite">
      <span
        className={`kala-dot ${status.isOpen ? 'kala-dot-open' : 'kala-dot-closed'}`}
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: status.isOpen ? '#2ecc71' : '#e74c3c',
          marginRight: '6px',
        }}
      />
      <span>{status.chipText}</span>
    </div>
  );
}
