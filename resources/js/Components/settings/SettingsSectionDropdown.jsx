import { useEffect, useRef, useState } from 'react';

const ChevronIcon = ({ open }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 transition-transform"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        aria-hidden
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/**
 * @param {object} props
 * @param {Array<{ key: string, label: string, description: string, icon?: () => JSX.Element }>} props.sections
 * @param {string} props.activeKey
 * @param {(key: string) => void} props.onSelect
 */
export default function SettingsSectionDropdown({ sections, activeKey, onSelect }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const active = sections.find((s) => s.key === activeKey) ?? sections[0];
    const ActiveIcon = active?.icon;

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, []);

    const handleSelect = (key) => {
        onSelect(key);
        setOpen(false);
    };

    return (
        <div className="relative" ref={rootRef}>
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6b6b8a' }}>
                Menu de configuracoes
            </p>
            <button
                type="button"
                id="settings-section-menu-button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="mt-2 flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-[#f8f7ff]"
                style={{
                    borderColor: open ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.18)',
                    backgroundColor: '#ffffff',
                    color: '#1a1040',
                    boxShadow: open ? '0 8px 24px rgba(124,58,237,0.12)' : undefined,
                }}
            >
                {ActiveIcon && (
                    <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(124,58,237,0.12)', color: '#7c3aed' }}
                    >
                        <ActiveIcon />
                    </span>
                )}
                <span className="min-w-0 flex-1">
                    <span className="block font-semibold" style={{ color: '#7c3aed' }}>
                        {active.label}
                    </span>
                    <span className="block text-xs font-normal" style={{ color: '#6b6b8a' }}>
                        {active.description}
                    </span>
                </span>
                <ChevronIcon open={open} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-labelledby="settings-section-menu-button"
                    className="absolute left-0 right-0 z-30 mt-2 max-h-[min(360px,50vh)] overflow-y-auto rounded-xl border py-1 shadow-lg"
                    style={{
                        borderColor: 'rgba(124,58,237,0.18)',
                        backgroundColor: '#ffffff',
                    }}
                >
                    {sections.map((section) => {
                        const isActive = section.key === activeKey;
                        const SectionIcon = section.icon;

                        return (
                            <li key={section.key} role="option" aria-selected={isActive}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(section.key)}
                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#f0eeff]"
                                    style={{
                                        backgroundColor: isActive ? '#f0eeff' : 'transparent',
                                        color: isActive ? '#7c3aed' : '#1a1040',
                                    }}
                                >
                                    {SectionIcon && (
                                        <span
                                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                                            style={{
                                                backgroundColor: isActive ? 'rgba(124,58,237,0.15)' : 'rgba(124,58,237,0.08)',
                                                color: isActive ? '#7c3aed' : '#6b6b8a',
                                            }}
                                        >
                                            <SectionIcon />
                                        </span>
                                    )}
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium">{section.label}</span>
                                        <span className="block text-xs" style={{ color: '#6b6b8a' }}>
                                            {section.description}
                                        </span>
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
