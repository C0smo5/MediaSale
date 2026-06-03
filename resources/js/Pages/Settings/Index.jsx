import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AccountSettingsPanel } from './AccountSettingsPanel';

export { AccountSettingsPanel } from './AccountSettingsPanel';

export default function SettingsIndex(props) {
    return (
        <AuthenticatedLayout>
            <Head title="Configuracoes" />
            <AccountSettingsPanel {...props} />
        </AuthenticatedLayout>
    );
}
