"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, Eye, Flag, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const [cRes, iRes] = await Promise.all([
          fetch(`/api/customers/${id}`),
          fetch(`/api/customers/${id}/invoices`),
        ]);
        const cData = cRes.ok ? await cRes.json() : null;
        const iData = iRes.ok ? await iRes.json() : { invoices: [] };
        setCustomer(cData);
        setInvoices(iData.invoices || []);
      } catch (e) {
        toast.error('Failed to load customer');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const stats = useMemo(() => {
    const count = invoices.length;
    const total = invoices.reduce((s, inv) => s + Number(inv.total_invoice_value || 0), 0);
    const estimatedProfit = total * 0.2; // Estimated profit (20%)
    const flagged = invoices.filter((inv) => inv.flagged).length;
    const lastPurchase = invoices[0]?.invoice_date ? new Date(invoices[0].invoice_date) : null;
    return { count, total, estimatedProfit, flagged, lastPurchase };
  }, [invoices]);

  const previewInvoice = async (inv: any) => {
    try {
      const { generateInvoiceHTML } = await import('@/utils/invoicePdfGenerator');
      const spRes = await fetch('/api/setting/shopprofile');
      const shopProfile = spRes.ok ? await spRes.json() : null;
      const html = generateInvoiceHTML({
        invoiceData: inv,
        lineItems: (inv.line_items || []).map((li: any) => ({
          hsn_sac_code: li.hsn_sac_code,
          description: li.description,
          quantity: Number(li.quantity),
          unit: li.unit,
          rate: Number(li.rate),
          taxableValue: Number(li.taxable_value),
        })),
        cgstRate: 1.5,
        sgstRate: 1.5,
        globalRoundoff: inv.roundoff ? Number(inv.roundoff) : 0,
        copies: ['ORIGINAL FOR RECIPIENT','DUPLICATE FOR TRANSPORTER','TRIPLICATE FOR SUPPLIER'],
        shopProfile: shopProfile || { shopName: 'Business', gstin: '', address: '', city: '', state: '', stateCode: '' },
      } as any);
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(html);
        w.document.close();
      }
    } catch {
      toast.error('Failed to preview invoice');
    }
  };

  const downloadInvoice = async (inv: any) => {
    try {
      const res = await fetch('/api/invoices/bulk-export', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [inv.id] })
      });
      if (!res.ok) throw new Error('export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `Invoice_${inv.invoice_number}.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download invoice');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!customer) return <div className="p-6">Customer not found</div>;

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Back */}
      <button onClick={() => router.back()} className="text-sm text-muted-foreground hover:underline">← Back to Clients</button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{customer.name}</h1>
          <div className="text-muted-foreground">{customer.business_name || customer.buyer_name || '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2 bg-card border border-border rounded-[16px]">
          <div className="p-4 border-b border-border font-semibold">Client Information</div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Client Type</div>
              <div className="font-medium">Jeweler</div>
            </div>
            <div>
              <div className="text-muted-foreground">Loyalty Level</div>
              <div className="font-medium">Low</div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{customer.phone || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{customer.email || 'Not provided'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">City</div>
              <div className="font-medium">{customer.city || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">State</div>
              <div className="font-medium">{customer.state?.state_name || '—'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-muted-foreground">Address</div>
              <div className="font-medium">{customer.address || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">GST Number</div>
              <div className="font-medium">{customer.gstin || '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Business Name</div>
              <div className="font-medium">{customer.business_name || '—'}</div>
            </div>
          </div>
        </div>

        {/* Revenue & Profit */}
        <div className="bg-card border border-border rounded-[16px]">
          <div className="p-4 border-b border-border font-semibold">Revenue & Profit</div>
          <div className="p-4 space-y-4">
            <div>
              <div className="text-muted-foreground text-sm">Total Revenue</div>
              <div className="text-2xl font-bold">₹{stats.total.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Total Profit (est.)</div>
              <div className="text-2xl font-bold">₹{stats.estimatedProfit.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-[12px] p-3">
                <div className="text-muted-foreground">Total Purchases</div>
                <div className="font-semibold text-lg">{stats.count}</div>
              </div>
              <div className="bg-muted rounded-[12px] p-3">
                <div className="text-muted-foreground">Last Purchase</div>
                <div className="font-semibold text-lg">{stats.lastPurchase ? stats.lastPurchase.toLocaleDateString('en-IN') : '—'}</div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-[10px] bg-muted text-xs">jewellery</span>
                <span className="px-2 py-1 rounded-[10px] bg-muted text-xs">silver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-card border border-border rounded-[16px] overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <div className="font-semibold">Invoices</div>
        </div>
        <div className="divide-y divide-border">
          {invoices.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No invoices yet</div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="p-4 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3 font-semibold">{inv.invoice_number}</div>
                <div className="col-span-2 text-sm">{new Date(inv.invoice_date).toLocaleDateString('en-IN')}</div>
                <div className="col-span-2 text-sm">{inv.transaction_type}</div>
                <div className="col-span-2 text-sm">Items: {inv.line_items?.length || 0}</div>
                <div className="col-span-2 font-semibold">₹{Number(inv.total_invoice_value).toFixed(2)}</div>
                <div className="col-span-1 flex justify-end gap-2">
                  <button className="px-2 py-1 rounded bg-muted text-sm flex items-center gap-1" onClick={() => previewInvoice(inv)}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-2 py-1 rounded bg-muted text-sm flex items-center gap-1" onClick={() => downloadInvoice(inv)}>
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}



