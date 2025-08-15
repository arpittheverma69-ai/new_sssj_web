export const numberToWords = (num: number): string => {
    const single = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const formatTenth = (digit: number, prev: number) => {
        return digit === 0 ? '' : ' ' + (digit === 1 ? double[prev] : tens[digit]);
    };

    const formatOther = (digit: number, next: number, denom: string) => {
        return (digit !== 0 && next !== 1 ? ' ' + single[digit] : '') + (next !== 0 || digit > 0 ? ' ' + denom : '');
    };

    let str = '';
    let rupees = Math.floor(num);
    let paise = Math.round((num - rupees) * 100);

    str += rupees > 0 ? formatOther(Math.floor(rupees / 10000000) % 100, 0, 'Crore') : '';
    str += rupees > 0 ? formatOther(Math.floor(rupees / 100000) % 100, 0, 'Lakh') : '';
    str += rupees > 0 ? formatOther(Math.floor(rupees / 1000) % 100, 0, 'Thousand') : '';
    str += rupees > 0 ? formatOther(Math.floor(rupees / 100) % 10, 0, 'Hundred') : '';

    if (rupees > 0) {
        const tensValue = Math.floor(rupees % 100);
        if (tensValue > 0) {
            str += tensValue < 10 ? ' ' + single[tensValue] :
                tensValue < 20 ? ' ' + double[tensValue - 10] :
                    ' ' + tens[Math.floor(tensValue / 10)] + (tensValue % 10 > 0 ? ' ' + single[tensValue % 10] : '');
        }
        str += ' Rupees';
    }

    if (paise > 0) {
        if (rupees > 0) str += ' and';
        const tensValue = Math.floor(paise % 100);
        if (tensValue > 0) {
            str += tensValue < 10 ? ' ' + single[tensValue] :
                tensValue < 20 ? ' ' + double[tensValue - 10] :
                    ' ' + tens[Math.floor(tensValue / 10)] + (tensValue % 10 > 0 ? ' ' + single[tensValue % 10] : '');
        }
        str += ' Paise';
    }

    return str.trim() || 'Zero Rupees';
};