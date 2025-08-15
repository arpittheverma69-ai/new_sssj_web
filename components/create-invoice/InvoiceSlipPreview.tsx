import { LineItem } from '@/types/invoiceTypes';
import { numberToWords } from '@/utils/numberToWords';
import React from 'react'

interface InvoiceSlipPreviewProps {
    invoiceData: any;
    lineItems: LineItem[];
    cgstRate: number;
    sgstRate: number;
}

const InvoiceSlipPreview: React.FC<InvoiceSlipPreviewProps> = ({
    invoiceData,
    lineItems,
    cgstRate,
    sgstRate,
}) => {
    const taxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const cgstAmount = taxableValue * (cgstRate / 100);
    const sgstAmount = taxableValue * (sgstRate / 100);
    const totalInvoice = taxableValue + cgstAmount + sgstAmount;
    const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);
    const unit = lineItems.length > 0 ? lineItems[0].unit : 'KGS';

    // Format date as DD-MMM-YY
    const invoiceDate = new Date(invoiceData.invoice_date);
    const formattedDate = invoiceDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
    }).replace(',', '');

    // Extract city from address (simple approach)
    const addressParts = invoiceData.buyer_address.split(',');
    const city = addressParts.length > 1 ? addressParts[addressParts.length - 2].trim() : 'N/A';

    return (
        <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Invoice Slip Preview</h3>

            <div id="invoice-slip-container" className="border rounded-lg p-4 bg-gray-50">
                <div id="invoice-content" className="bg-white p-4 mx-auto" style={{ width: '210mm', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
                    {/* Header Section */}
                    <div className="flex justify-between items-center">
                        <div className="w-[40%]"></div>
                        <div className="flex justify-between items-center w-[60%]">
                            <div className="text-center font-bold text-[16px] tracking-wide">Tax Invoice</div>
                            <i id="invoice-title" className="text-right text-xs">(ORIGINAL FOR RECIPIENT)</i>
                        </div>
                    </div>

                    {/* Main Info Block */}
                    <div className="grid grid-cols-2 border border-black h-[220px]">
                        {/* Left Column: Seller and Buyer Info */}
                        <div className="py-1 border-r border-black text-xs px-0.5">
                            <div className="font-bold">J.V. JEWELLERS</div>
                            <div>SHOP NO. -2, KRISHNA HIEGHT, JAY SINGH PURA</div>
                            <div>MATHURA</div>
                            <div className="">GSTIN/UIN: 09ADCPV2673H1Z7</div>
                            <div>State Name : Uttar Pradesh, Code : 09</div>
                            <hr className="my-0.5 border-t border-black" />
                            <div className="font-bold">Buyer (Bill to)</div>
                            <div className="font-bold mt-1">{invoiceData.buyer_name}</div>
                            <div className="font-bold">{city.toUpperCase()}</div>
                            <div className="mt-1">GSTIN/UIN: {invoiceData.buyer_gstin || 'N/A'}</div>
                            <div>
                                State Name: {invoiceData.buyer_state === 'UP' ? 'Uttar Pradesh, Code : 09' : 'Maharashtra, Code : 27'}
                            </div>
                        </div>

                        {/* Right Column: Invoice Metadata Table */}
                        <div>
                            <table className="text-xs">
                                <tbody>
                                    <tr className="divide-x divide-black">
                                        <td className="w-1/2 border-0 border-b border-black">
                                            <p>Invoice No.</p>
                                            <strong className="text-sm font-bold">{invoiceData.invoice_number}</strong>
                                        </td>
                                        <td className="w-1/2 border-0 border-b border-r-0 border-black">
                                            <p>Dated</p>
                                            <strong className="text-sm font-bold">{formattedDate}</strong>
                                        </td>
                                    </tr>
                                    <tr className="divide-x divide-black text-[11px]">
                                        <td className="border-b border-black">
                                            <p>Delivery Note</p>
                                            <div className="h-4"></div>
                                        </td>
                                        <td className="border-b border-r-0 border-black">
                                            <p>Mode/Terms of Payment</p>
                                            <div className="h-4"></div>
                                        </td>
                                    </tr>
                                    <tr className="divide-x divide-black text-[11px]">
                                        <td className="border-b border-black">
                                            <p>Buyer's Order No.</p>
                                            <div className="h-4"></div>
                                        </td>
                                        <td className="border-b border-r-0 border-black">
                                            <p>Dated</p>
                                            <div className="h-4"></div>
                                        </td>
                                    </tr>
                                    <tr className="divide-x divide-black text-[11px]">
                                        <td colSpan={2} className="border-b-0 border-r-0">
                                            <p>Terms of Delivery</p>
                                            <div className="h-4"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Items Table */}
                    <table className="border border-black border-t-0">
                        <thead>
                            <tr className="divide-x divide-black text-center font-bold">
                                <td className="w-[5%]">Sl No.</td>
                                <td className="w-[35%]">Description of Goods</td>
                                <td className="w-[10%]">HSN/SAC</td>
                                <td className="w-[11%]">Quantity</td>
                                <td className="w-[11%]">Rate</td>
                                <td className="w-[8%]">per</td>
                                <td className="w-[15%]">Amount</td>
                            </tr>
                        </thead>
                        <tbody id="slip-line-items" className="h-[420px]">
                            {lineItems.map((item, index) => (
                                <tr key={item.id} className="divide-x divide-black">
                                    <td className="text-center">{index + 1}</td>
                                    <td className="">
                                        <div className="flex flex-col justify-between h-full">
                                            <p className="font-bold mt-1">{item.description}</p>
                                            <div>
                                                <div className="text-right mt-1 space-y-px pt-4">
                                                    <p>CGST</p>
                                                    <p>SGST</p>
                                                    <p className="font-bold">ROUNDED OFF</p>
                                                </div>
                                                <p className="mt-[-15px]">Less :</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">{item.hsn_sac_code}</td>
                                    <td className="text-center font-bold">
                                        {item.quantity.toFixed(3)} {item.unit}
                                    </td>
                                    <td className="text-right font-bold">
                                        {item.rate.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </td>
                                    <td className="text-center font-bold">{item.unit}</td>
                                    <td className="text-right">
                                        <div className="flex flex-col justify-between h-full font-bold">
                                            <p className="mt-1">
                                                {item.taxableValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            </p>
                                            <div className="space-y-px">
                                                <p>
                                                    {(item.taxableValue * (cgstRate / 100))
                                                        .toFixed(2)
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                </p>
                                                <p>
                                                    {(item.taxableValue * (sgstRate / 100))
                                                        .toFixed(2)
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                </p>
                                                <p>
                                                    (-)
                                                    {(totalInvoice - Math.round(totalInvoice))
                                                        .toFixed(2)
                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="divide-x divide-black font-bold">
                                <td colSpan={3} className="text-center">
                                    Total
                                </td>
                                <td className="text-center">
                                    {totalQuantity.toFixed(3)} {unit}
                                </td>
                                <td colSpan={2}></td>
                                <td className="text-right">
                                    <div className="flex justify-between items-center">
                                        <span>₹ {Math.round(totalInvoice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={7} className="font-bold p-2">
                                    <div className="flex justify-between">
                                        <span>
                                            Amount Chargeable (in words)<br />
                                            <span className="font-[700] text-[13px]">
                                                Indian Rupees {numberToWords(Math.round(totalInvoice))} Only
                                            </span>
                                        </span>
                                        <span className="font-normal text-[10px] ml-4">E. & O.E</span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Tax Summary Table */}
                    <table className="no-top-border border border-black border-t-0">
                        <thead>
                            <tr className="divide-x divide-black text-center font-bold">
                                <td rowSpan={2} className="align-middle w-[280px]">
                                    HSN/SAC
                                </td>
                                <td rowSpan={2} className="align-middle">
                                    Taxable Value
                                </td>
                                <td colSpan={2}>CGST</td>
                                <td colSpan={2}>SGST/UTGST</td>
                                <td rowSpan={2} className="align-middle">
                                    Total Tax Amount
                                </td>
                            </tr>
                            <tr className="divide-x divide-black text-center font-bold">
                                <td>Rate</td>
                                <td>Amount</td>
                                <td>Rate</td>
                                <td>Amount</td>
                            </tr>
                        </thead>
                        <tbody id="slip-tax-summary">
                            {lineItems.map((item) => (
                                <tr key={item.id} className="divide-x divide-black">
                                    <td className="text-center">{item.hsn_sac_code}</td>
                                    <td className="text-right">
                                        {item.taxableValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </td>
                                    <td className="text-center">{cgstRate}%</td>
                                    <td className="text-right">
                                        {(item.taxableValue * (cgstRate / 100))
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </td>
                                    <td className="text-center">{sgstRate}%</td>
                                    <td className="text-right">
                                        {(item.taxableValue * (sgstRate / 100))
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </td>
                                    <td className="text-right">
                                        {(item.taxableValue * ((cgstRate + sgstRate) / 100))
                                            .toFixed(2)
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="divide-x divide-black font-[800]">
                                <td className="text-center">Total</td>
                                <td className="text-right">
                                    {taxableValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </td>
                                <td className="text-right" colSpan={2}>
                                    {cgstAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </td>
                                <td className="text-right" colSpan={2}>
                                    {sgstAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </td>
                                <td className="text-right">
                                    {(cgstAmount + sgstAmount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="border border-y-0 border-black p-2">
                        <p className="text-[12px]">
                            Tax Amount (in words) :{' '}
                            <span className="font-[700] text-[13px]">
                                Indian Rupees {numberToWords(cgstAmount + sgstAmount)} Only
                            </span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 border border-t-0 border-black text-[12px] h-[155px]">
                        <div className="p-2">
                            <p>Company's VAT TIN               : <b>09627100742</b></p>
                            <p>Buyer's VAT TIN                     : <b>09871300591</b></p>
                            <p>Company's PAN                     : <b>ADCPV2673H</b></p>
                            <br />
                            <p className="font-bold underline">Declaration</p>
                            <p>
                                We declare that this invoice shows the actual price of the goods described and that all
                                particulars are true and correct.
                            </p>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div>
                                <p>Company's Bank Details</p>
                                <p>Bank Name             : ICICI BANK C/A NO. 027405001417 (JVM)</p>
                                <p>A/c No.                    : </p>
                                <p>Branch & IFS Code : </p>
                            </div>
                            <div className="text-end border-t border-black py-0.5 px-2 border-l border-black">
                                <p className="font-bold pb-7">for J.V. JEWELLERS</p>
                                <p className="">Authorised Signatory</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4 text-xs font-semibold">
                        This is a Computer Generated Invoice
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceSlipPreview;