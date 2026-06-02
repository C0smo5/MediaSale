/**
 * @param {string | null | undefined} name
 */
export function getUserInitials(name) {
    const safe = (name ?? '').trim();

    if (safe === '') {
        return '?';
    }

    return safe
        .split(/\s+/)
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

/**
 * @param {string | null | undefined} name
 */
export function getUserFirstName(name) {
    const safe = (name ?? '').trim();

    if (safe === '') {
        return 'Usuario';
    }

    return safe.split(/\s+/)[0];
}
