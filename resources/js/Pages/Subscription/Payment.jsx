import PlanPaymentView from '@/Components/plans/PlanPaymentView';

export default function SubscriptionPayment({ pending, canSkipPayment = false }) {
    return <PlanPaymentView context="subscription" pending={pending} canSkipPayment={canSkipPayment} />;
}
