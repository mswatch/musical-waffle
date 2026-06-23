export default function Account() {
  return (
    <div data-testid="account-page" className="px-4 md:px-8 max-w-[1100px] mx-auto pt-8 md:pt-12">
      <p className="text-xs uppercase tracking-[0.4em] text-muted mb-3">Member</p>
      <h1 className="font-display text-5xl md:text-7xl">Your Account</h1>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Orders" desc="Track your timepiece journey" />
        <Card title="Fast Delivery" desc="Track your shipment status" />
        <Card title="Addresses" desc="Manage shipping destinations" />
        <Card title="Boutique" desc="Visit our Ajmer atelier" />
        <Card title="Concierge" desc="Personal styling on WhatsApp" />
        <Card title="Settings" desc="Preferences & notifications" />
      </div>
      <p className="mt-12 text-xs text-muted">Sign-in flow will activate when Shopify Customer Accounts are connected.</p>
    </div>
  );
}

const Card = ({ title, desc }) => (
  <div className="rounded-3xl glass-card p-6 hover:translate-y-[-2px] transition">
    <p className="font-display text-2xl">{title}</p>
    <p className="text-sm text-muted mt-1">{desc}</p>
  </div>
);
