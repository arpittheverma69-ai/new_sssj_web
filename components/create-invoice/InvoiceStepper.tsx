import React from 'react';

interface InvoiceStepperProps {
    currentStep: number;
}

const InvoiceStepper: React.FC<InvoiceStepperProps> = ({ currentStep }) => {
    return (
        <div className="mt-8 mb-6 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center text-sm">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            } font-bold`}
                    >
                        1
                    </div>
                    <span
                        className={`ml-2 ${currentStep >= 1 ? 'font-semibold text-blue-600' : 'font-medium text-gray-500'
                            }`}
                    >
                        Invoice Details
                    </span>
                </div>
                <div className="flex-auto border-t-2 border-gray-200 mx-4"></div>
                <div className="flex items-center text-sm">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            } font-bold`}
                    >
                        2
                    </div>
                    <span
                        className={`ml-2 ${currentStep >= 2 ? 'font-semibold text-blue-600' : 'font-medium text-gray-500'
                            }`}
                    >
                        Line Items
                    </span>
                </div>
                <div className="flex-auto border-t-2 border-gray-200 mx-4"></div>
                <div className="flex items-center text-sm">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                            } font-bold`}
                    >
                        3
                    </div>
                    <span
                        className={`ml-2 ${currentStep >= 3 ? 'font-semibold text-blue-600' : 'font-medium text-gray-500'
                            }`}
                    >
                        Review & Generate
                    </span>
                </div>
            </div>
        </div>
    );
};

export default InvoiceStepper;