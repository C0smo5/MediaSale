import PlanPaymentView from '@/Components/plans/PlanPaymentView';

export default function RegisterPayment({ pending, canSkipPayment = false }) {
    return <PlanPaymentView context="registration" pending={pending} canSkipPayment={canSkipPayment} />;
}
