import PlanPaymentView from '@/Components/plans/PlanPaymentView';

export default function RegisterPayment({ pending, canSkipPayment = false, mpPublicKey = null, payerEmail = null }) {
    return (
        <PlanPaymentView
            context="registration"
            pending={pending}
            canSkipPayment={canSkipPayment}
            mpPublicKey={mpPublicKey}
            payerEmail={payerEmail}
        />
    );
}
