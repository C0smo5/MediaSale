import PlanPaymentView from '@/Components/plans/PlanPaymentView';

export default function SubscriptionPayment({ pending, canSkipPayment = false, mpPublicKey = null }) {
    return (
        <PlanPaymentView
            context="subscription"
            pending={pending}
            canSkipPayment={canSkipPayment}
            mpPublicKey={mpPublicKey}
        />
    );
}
