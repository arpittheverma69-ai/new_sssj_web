import { InvoiceData, LineItem } from '@/types/invoiceTypes';
import { numberToWords } from '@/utils/numberToWords';

interface ShopProfile {
    shopName: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    stateCode: string;
    vatTin?: string;
    panNumber?: string;
    bankName?: string;
    accountNumber?: string;
    branchIfsc?: string;
    shopProfile?: ShopProfile;
}

interface InvoicePdfData {
    invoiceData: InvoiceData;
    lineItems: LineItem[];
}

export const generateInvoicePDF = (invoiceData: any, lineItems: any[], globalRoundoff: number = 0, shopProfile?: ShopProfile) => {
    // Default shop profile if not provided - should be fetched from database
    const defaultShopProfile: ShopProfile = {
        shopName: 'Shop Name Not Set',
        gstin: 'GSTIN Not Set',
        address: 'Address Not Set',
        city: 'City Not Set',
        state: 'State Not Set',
        stateCode: '00',
        vatTin: '',
        panNumber: '',
        bankName: '',
        accountNumber: '',
        branchIfsc: ''
    };

    console.log("invoiceData", invoiceData);
    console.log("shopProfile", shopProfile);

    const profile = shopProfile || defaultShopProfile;
    // Calculate totals
    const taxableValue = lineItems.reduce((sum, item) => sum + Number(item.taxableValue), 0);

    // Calculate tax rates dynamically from line items if available
    let cgstRate = 1.5; // default
    let sgstRate = 1.5; // default

    // Try to get tax rates from the first line item's taxes
    if (lineItems.length > 0 && lineItems[0].taxes && lineItems[0].taxes.length > 0) {
        const taxes = lineItems[0].taxes;
        const cgstTax = taxes.find((tax: any) => tax.tax_name === 'CGST');
        const sgstTax = taxes.find((tax: any) => tax.tax_name === 'SGST');
        if (cgstTax) cgstRate = Number(cgstTax.tax_rate);
        if (sgstTax) sgstRate = Number(sgstTax.tax_rate);
    }

    const cgstAmount = taxableValue * cgstRate / 100;
    const sgstAmount = taxableValue * sgstRate / 100;
    const totalTax = cgstAmount + sgstAmount;
    const totalBeforeRoundoff = taxableValue + totalTax;
    const totalInvoice = totalBeforeRoundoff + globalRoundoff;

    // Copy types for the 3 pages
    const copyTypes = [
        "ORIGINAL FOR RECIPIENT",
        "DUPLICATE FOR TRANSPORTER",
        "TRIPLICATE FOR SUPPLIER"
    ];

    // numberToWords is imported and used within the template below

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        return `${day}-${month}-${year}`;
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tax Invoice</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body class="bg-white">
    <div class="w-[672.5px] mx-auto text-[10px]">
        <div class="flex justify-between w-[100%]">
            <div class="w-[50%]"></div>
            <div class="w-[50%] flex justify-between">
                <span class="font-bold font-italic">Tax Invoice</span>
                <span class="italic">(DUPLICATE FOR TRANSPORTER)</span>
            </div>
        </div>
        <div class="max-w-4xl mx-auto border border-black">
            <div class="grid grid-cols-2">
                <div class="h-[275px]">
                    <div class="border-b border-black w-[100%] pt-1 ml-0.5 leading-[1.4] h-auto">
                        <h1 class="font-bold">${profile.shopName.toUpperCase()}</h1>
                        <p>${profile.address}</p>
                        <p>${profile.city}</p>
                        <p>GSTIN/UIN: ${profile.gstin}</p>
                        <p>State Name : ${profile.state}, Code : ${profile.stateCode.split(' ')[0] || profile.stateCode}</p>
                    </div>
                    <div class="leading-[1.4] ml-0.5 pt-0.5 h-[75.5px]">
                        <p class="text-[9px]">Buyer (Bill to)</p>
                        <p class="font-bold">${invoiceData.buyer_name}</p>
                        <p>${invoiceData.buyer_address}</p>
                        <div class="flex">
                            <div class="w-[98.2px]">GSTIN/UIN </div>
                            <div>: ${invoiceData.buyer_gstin || ''}</div>
                        </div>
                        <div class="flex">
                            <div class="w-[98.2px]">State Name </div>
                            <div>: ${invoiceData.buyer_state}, Code : ${invoiceData.buyer_state_code}</div>
                        </div>
                    </div>
                </div>
                <div class="border-l border-black">
                    <div class="grid grid-cols-2 border-b border-black h-[30.2px]">
                        <div class="p-1 text-[9px] flex flex-col justify-between">
                            <div class="flex justify-between">
                                <p>Invoice No.</p>
                                <p>e-Way Bill No.</p>
                            </div>
                            <div class="flex justify-between -mt-1">
                                <p class="font-bold text-[10px]">${invoiceData.invoice_number}</p>
                                <p>${invoiceData.eway_bill || ''}</p>
                            </div>
                        </div>
                        <div class="border-l border-black p-1">
                            <div>Dated</div>
                            <div class="text-[11px] font-bold  -mt-1">${formatDate(invoiceData.invoice_date)}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Delivery Note</div>
                        <div class="p-1 border-l border-black">Mode/Terms of Payment</div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Reference No. & Date.</div>
                        <div class="p-1 border-l border-black">Other References</div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Buyer's Order No.</div>
                        <div class="p-1 border-l border-black">Dated</div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Dispatch Doc No.</div>
                        <div class="p-1 border-l border-black">Delivery Note Date</div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Dispatched through</div>
                        <div class="p-1 border-l border-black">Destination</div>
                    </div>
                    <div class="grid grid-cols-2 border-b border-black h-[28.2px]">
                        <div class="p-1">Dispatch Doc No.</div>
                        <div class="p-1 border-l border-black">Delivery Note Date</div>
                    </div>
                    <div class="grid grid-cols-1 h-[70.7px]">
                        <div class="p-1">Terms of Delivery</div>
                    </div>
                </div>
            </div>

            <table class="w-full border-collapse border-t border-b border-black h-[380px]">
                <thead>
                    <tr class="border-b border-black text-[9px] h-[38px]">
                        <th class="border-r border-black w-[15.11px]">SI No.</th>
                        <th class="border-r border-black w-[298px]">Description of Goods</th>
                        <th class="border-r border-black w-[66.14px]">HSN/SAC</th>
                        <th class="border-r border-black w-[68.3px]">Quantity</th>
                        <th class="border-r border-black w-[66.14px]">Rate</th>
                        <th class="border-r border-black w-[26.45px]">per</th>
                        <th class="w-[98.27px]">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map((item, index) => `
                    <tr class=" font-bold max-h-[30px]">
                        <td class="border-r border-black pt-2 text-center">${index + 1}</td>
                        <td class="border-r border-black pt-2">${item.description}</td>
                        <td class="border-r border-black pt-2 text-center">${item.hsn_sac_code}</td>
                        <td class="border-r border-black pt-2 text-right">${Number(item.quantity).toFixed(3)} ${item.unit}</td>
                        <td class="border-r border-black pt-2 text-right">${Number(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="border-r border-black pt-2 text-center">${item.unit}</td>
                        <td class="text-right pt-2">${Number(item.taxableValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    `).join('')}
                    <tr class="font-bold h-[15px]">
                        <td class="border-r border-black pt-3" rowspan="4"></td>
                        <td class="border-r border-black pt-3 text-right">CGST @ ${cgstRate}%</td>
                        <td class="border-r border-black pt-3"></td>
                        <td class="border-r border-black pt-3"></td>
                        <td class="border-r border-black pt-3"></td>
                        <td class="border-r border-black pt-3 text-right"></td>
                        <td class="text-right pt-3">${cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr class="font-bold h-[15px]">
                        <td class="border-r border-black text-right">SGST @ ${sgstRate}%</td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black text-right"></td>
                        <td class="text-right">${sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr class="font-bold h-[15px]">
                        <td class="border-r border-black">
                            <div class="w-full flex justify-between">
                                <div class="font-normal">Less :</div>
                                <div class"font-bold">ROUNDED OFF</div>
                            </div>
                        </td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black text-right"></td>
                        <td class="w-[98.27px] text-right">${globalRoundoff !== 0 ? (globalRoundoff > 0 ? `(+)${globalRoundoff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `(-)${Math.abs(globalRoundoff).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`) : '0.00'}</td>
                    </tr>
                    <tr class="font-bold h-full max-h-auto">
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="w-[98.27px] text-right"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="border-t border-black h-[18.89px] text-[10px] text-center">
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black">Total</td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black font-bold">${lineItems.reduce((sum, item) => sum + item.quantity, 0).toFixed(3)} ${lineItems[0]?.unit || 'KGS'}</td>
                        <td class="border-r border-black"></td>
                        <td class="border-r border-black"></td>
                        <td class="font-bold h-[18.90px] text-[12px]">₹ ${Math.round(totalInvoice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="h-[34px] relative">
                <div class="p-0.5">
                    <p><span class="font-normal">Amount Chargeable (in words)</span></p>
                    <span class="font-bold">Indian ${numberToWords(totalInvoice)}</span>
                </div>
                <p class="text-right absolute right-1 top-1">E. & O.E</p>
            </div>

            <table class="w-full border-collapse border-t border-b border-black h-[60.50px]">
                <thead>
                    <tr class="border-b border-black ">
                        <th class="border-r border-black h-[17px] w-[38%] font-normal" rowspan="2">HSN/SAC</th>
                        <th class="border-r border-black font-normal" rowspan="2">Taxable Value</th>
                        <th class="border-r border-black font-normal h-[17px]" colspan="2">CGST</th>
                        <th class="border-r border-black font-normal" colspan="2">SGST/UTGST</th>
                        <th class="p-1 font-normal" rowspan="2">Total Tax Amount</th>
                    </tr>
                    <tr class="border-b border-black">
                        <th class="border-r border-black font-normal">Rate</th>
                        <th class="border-r border-black font-normal">Amount</th>
                        <th class="border-r border-black font-normal">Rate</th>
                        <th class="border-r border-black font-normal">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${lineItems.map(item => `
                    <tr class="h-[13.22px]">
                        <td class="border-r border-black">${item.hsn_sac_code}</td>
                        <td class="border-r border-black text-right">${item.taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="border-r border-black text-right">${cgstRate.toFixed(2)}%</td>
                        <td class="border-r border-black text-right">${(item.taxableValue * cgstRate / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="border-r border-black text-right">${sgstRate.toFixed(2)}%</td>
                        <td class="border-r border-black text-right">${(item.taxableValue * sgstRate / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="text-right">${(item.taxableValue * (cgstRate + sgstRate) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr class="border-t border-black h-[17px]">
                        <td class="font-bold border-r border-black text-right">Total</td>
                        <td class="font-bold border-r border-black text-right">${taxableValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="border-r border-black text-right"></td>
                        <td class="font-bold border-r border-black text-right">${cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="border-r border-black text-right"></td>
                        <td class="font-bold border-r border-black text-right">${sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td class="font-bold text-right">${(cgstAmount + sgstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="w-full h-full">
                <p class="text-[10px]"><span class="mr-4 p-1">Tax Amount (in words) :</span><span class="font-bold">Indian ${numberToWords(cgstAmount + sgstAmount)}</span></p>

                <div class="grid grid-cols-2 mt-4 p-1">
                    <div>
                        <div class="flex">
                            <div class="w-[138px]">Buyer's VAT TIN</div>
                            <div class="font-bold">: ${invoiceData.buyer_gstin || ''}</div>
                        </div>
                        <div class="flex">
                            <div class="w-[138px]">Company's VAT TIN </div>
                            <div class="font-bold">: ${profile.vatTin || ''}</div>
                        </div>
                        <div class="flex">
                            <div class="w-[138px]">Company's PAN </div>
                            <div class="font-bold">: ${profile.panNumber || ''}</div>
                        </div>
                    </div>
                    <div>
                        <p><span>Company's Bank Details</span></p>
                        <div class="flex">
                            <div class="w-[94.4px]">Bank Name</div>
                            <div class="font-bold">: ${profile.bankName || ''}</div>
                        </div>
                        <div class="flex">
                            <div class="w-[94.4px]">A/c No.</div>
                            <div class="font-bold">: ${profile.accountNumber || ''}</div>
                        </div>
                        <div class="flex">
                            <div class="w-[94.4px]">Branch & IFS Code</div>
                            <div class="font-bold">: ${profile.branchIfsc || ''}</div>
                        </div>
                    </div>
                </div>
                <div class="w-full h-[52.9px] flex">
                    <div class="w-[50%] p-1">
                        <div class="underline">Declaration</div>
                        <span>
                            We declare that this invoice shows the actual price of the goods described and that all
                            particulars are true and correct.
                        </span>
                    </div>
                    <div class="text-right border-l border-t border-black w-[50%] flex flex-col justify-between">
                        <p class="font-bold pr-3">for ${profile.shopName.toUpperCase()}</p>
                        <div class="pr-3">
                            Authorised Signatory
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

// Build combined HTML with up to 3 copies, only header text differs
export function generateInvoiceHTML(data: { invoiceData: InvoiceData; lineItems: LineItem[]; cgstRate?: number; sgstRate?: number; globalRoundoff?: number; copies?: Array<'ORIGINAL FOR RECIPIENT' | 'DUPLICATE FOR TRANSPORTER' | 'TRIPLICATE FOR SUPPLIER'>; shopProfile: ShopProfile; }) {
    const base = generateInvoicePDF(data.invoiceData, data.lineItems, data.globalRoundoff || 0, data.shopProfile);
    const headMatch = base.match(/<head[\s\S]*?<\/head>/i);
    const bodyMatch = base.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const head = headMatch ? headMatch[0] : '<head><meta charset="UTF-8"><title>Tax Invoice</title><script src="https://cdn.tailwindcss.com"></script></head>';
    const body = bodyMatch ? bodyMatch[1] : '';

    const copyTypes: string[] = data.copies && data.copies.length ? data.copies : [
        'ORIGINAL FOR RECIPIENT',
        'DUPLICATE FOR TRANSPORTER',
        'TRIPLICATE FOR SUPPLIER'
    ];

    const pages = copyTypes.map((copy, idx) => {
        const pageHtml = body.replace(/\((?:ORIGINAL FOR RECIPIENT|DUPLICATE FOR TRANSPORTER|TRIPLICATE FOR SUPPLIER)\)/i, `(${copy})`);
        // Add page break after each page except last
        const breakDiv = idx < copyTypes.length - 1 ? '<div class="page-break"></div>' : '';
        return pageHtml + breakDiv;
    }).join('\n');

    const style = `
    <style>
      @media print { .page-break { page-break-after: always; } }
      .page-break { page-break-after: always; }
    </style>
  `;

    return `<!DOCTYPE html><html lang="en">${head.replace('</head>', style + '</head>')}<body class="bg-white">${pages}</body></html>`;
}

export const downloadInvoicePDF = async (data: InvoicePdfData & { cgstRate?: number; sgstRate?: number; globalRoundoff?: number; copies?: string[]; shopProfile: ShopProfile }) => {
    const htmlContent = generateInvoiceHTML({ invoiceData: data.invoiceData, lineItems: data.lineItems, cgstRate: data.cgstRate, sgstRate: data.sgstRate, globalRoundoff: data.globalRoundoff, copies: data.copies as any, shopProfile: data.shopProfile });

    // Create a new window with the HTML content for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        // printWindow.onload = () => {
        //     setTimeout(() => {
        //         printWindow.print();
        //         printWindow.close();
        //     }, 500);
        // };
    }
};

export const generatePDFBlob = async (data: InvoicePdfData & { cgstRate?: number; sgstRate?: number; globalRoundoff?: number; copies?: string[]; shopProfile: ShopProfile }): Promise<Blob> => {
    // For client-side PDF generation, we'll use the browser's print to PDF functionality
    // This requires user interaction but provides exact formatting
    const htmlContent = generateInvoiceHTML({ invoiceData: data.invoiceData, lineItems: data.lineItems, cgstRate: data.cgstRate, sgstRate: data.sgstRate, globalRoundoff: data.globalRoundoff, copies: data.copies as any, shopProfile: data.shopProfile });

    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        iframe.contentDocument?.write(htmlContent);
        iframe.contentDocument?.close();

        // This is a simplified approach - in production, you'd want to use a proper PDF library
        // or server-side PDF generation
        setTimeout(() => {
            const blob = new Blob([htmlContent], { type: 'text/html' });
            document.body.removeChild(iframe);
            resolve(blob);
        }, 1000);
    });
};