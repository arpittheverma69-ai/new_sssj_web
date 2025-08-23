"use client"
import React, { useState } from 'react';
import { Download, FileText, Printer, Eye } from 'lucide-react';
import { InvoiceData, LineItem } from '@/types/invoiceTypes';
import { generateInvoiceHTML, downloadInvoicePDF } from '@/utils/invoicePdfGenerator';

interface PDFGeneratorButtonProps {
  invoiceData: InvoiceData;
  lineItems: LineItem[];
  cgstRate: number;
  sgstRate: number;
  className?: string;
}

const PDFGeneratorButton: React.FC<PDFGeneratorButtonProps> = ({
  invoiceData,
  lineItems,
  cgstRate,
  sgstRate,
  className = ""
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleGeneratePDF = async (action: 'download' | 'preview' | 'print') => {
    setIsGenerating(true);
    try {
      const pdfData = {
        invoiceData,
        lineItems,
        cgstRate,
        sgstRate
      };

      switch (action) {
        case 'download':
          await downloadInvoicePDF(pdfData);
          break;
        case 'preview':
          const htmlContent = generateInvoiceHTML(pdfData);
          const previewWindow = window.open('', '_blank');
          if (previewWindow) {
            previewWindow.document.write(htmlContent);
            previewWindow.document.close();
          }
          break;
        case 'print':
          const htmlContent2 = generateInvoiceHTML(pdfData);
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(htmlContent2);
            printWindow.document.close();
            printWindow.onload = () => {
              setTimeout(() => {
                printWindow.print();
              }, 500);
            };
          }
          break;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
      setShowOptions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isGenerating}
        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-[16px] font-medium hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isGenerating ? 'Generating...' : 'Generate PDF'}
      </button>

      {showOptions && !isGenerating && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-[12px] shadow-lg shadow-black/10 z-10 overflow-hidden">
          <button
            onClick={() => handleGeneratePDF('download')}
            className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
          >
            <Download className="w-4 h-4 text-blue-500" />
            <div>
              <div className="font-medium text-foreground">Download PDF</div>
              <div className="text-xs text-muted-foreground">Save invoice as PDF file</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGeneratePDF('preview')}
            className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 border-t border-border"
          >
            <Eye className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium text-foreground">Preview Invoice</div>
              <div className="text-xs text-muted-foreground">View invoice in new tab</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGeneratePDF('print')}
            className="w-full p-3 text-left hover:bg-muted/50 transition-colors flex items-center gap-3 border-t border-border"
          >
            <Printer className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-medium text-foreground">Print Invoice</div>
              <div className="text-xs text-muted-foreground">Open print dialog</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFGeneratorButton;
