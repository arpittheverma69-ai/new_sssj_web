export const numberToWords = (num: number): string => {
    const single = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertTwoDigit = (num: number): string => {
        if (num === 0) return '';
        if (num < 10) return single[num];
        if (num < 20) return double[num - 10];
        const tenDigit = Math.floor(num / 10);
        const unitDigit = num % 10;
        return tens[tenDigit] + (unitDigit > 0 ? ' ' + single[unitDigit] : '');
    };

    let str = '';
    let rupees = Math.floor(num);
    let paise = Math.round((num - rupees) * 100);

    // Handle crores
    const crores = Math.floor(rupees / 10000000);
    if (crores > 0) {
        str += convertTwoDigit(crores) + ' Crore';
        rupees %= 10000000;
    }

    // Handle lakhs
    const lakhs = Math.floor(rupees / 100000);
    if (lakhs > 0) {
        if (str) str += ' ';
        str += convertTwoDigit(lakhs) + ' Lakh';
        rupees %= 100000;
    }

    // Handle thousands
    const thousands = Math.floor(rupees / 1000);
    if (thousands > 0) {
        if (str) str += ' ';
        str += convertTwoDigit(thousands) + ' Thousand';
        rupees %= 1000;
    }

    // Handle hundreds
    const hundreds = Math.floor(rupees / 100);
    if (hundreds > 0) {
        if (str) str += ' ';
        str += single[hundreds] + ' Hundred';
        rupees %= 100;
    }

    // Handle remaining tens and units
    if (rupees > 0) {
        if (str) str += ' ';
        str += convertTwoDigit(rupees);
    }

    // Add "Rupees" if there's any amount
    if (str) {
        str += ' Rupees';
    }

    // Handle paise
    if (paise > 0) {
        if (str) str += ' and ';
        str += convertTwoDigit(paise) + ' Paise';
    }

    return str.trim() || 'Zero Rupees';
};