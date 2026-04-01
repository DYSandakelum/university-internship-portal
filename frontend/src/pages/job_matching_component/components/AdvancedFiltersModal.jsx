import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './AdvancedFiltersModal.css';

export default function AdvancedFiltersModal({
    open,
    title = 'Advanced Search',
    subtitle,
    queryLabel = 'Search query',
    query,
    onQueryChange,
    onClose,
    onSubmit,
    submitLabel = 'Search',
    children
}) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose?.();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="jm-modal-backdrop"
            role="dialog"
            aria-modal="true"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose?.();
            }}
        >
            <div className="jm-modal" onMouseDown={(event) => event.stopPropagation()}>
                <div className="jm-modal-header">
                    <div>
                        <h2 className="jm-modal-title">{title}</h2>
                        {subtitle ? <p className="jm-modal-subtitle">{subtitle}</p> : null}
                    </div>

                    <button className="jm-modal-close" type="button" onClick={() => onClose?.()} aria-label="Close">
                        <FiX />
                    </button>
                </div>

                <div className="jm-modal-body">
                    {typeof query === 'string' && typeof onQueryChange === 'function' ? (
                        <div className="jm-modal-query">
                            <label style={{ fontSize: 12, fontWeight: 800, color: 'var(--secondary-700)' }}>
                                {queryLabel}
                                <input
                                    value={query}
                                    onChange={(e) => onQueryChange(e.target.value)}
                                    placeholder="Title, company, skill, or keyword"
                                    aria-label={queryLabel}
                                />
                            </label>
                        </div>
                    ) : null}

                    {children}
                </div>

                <div className="jm-modal-footer">
                    <button className="btn-secondary" type="button" onClick={() => onClose?.()}>
                        Cancel
                    </button>
                    <button className="btn-primary" type="button" onClick={() => onSubmit?.()}>
                        {submitLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
