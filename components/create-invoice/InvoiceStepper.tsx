import React from 'react';
import { FileText, List, CheckCircle } from 'lucide-react';

interface InvoiceStepperProps {
    currentStep: number;
}

const InvoiceStepper: React.FC<InvoiceStepperProps> = ({ currentStep }) => {
    const steps = [
        { id: 1, label: 'Invoice Details', icon: FileText, description: 'Basic invoice information' },
        { id: 2, label: 'Line Items', icon: List, description: 'Add products and services' },
        { id: 3, label: 'Review & Generate', icon: CheckCircle, description: 'Final review and generation' }
    ];

    return (
        <div className="mb-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between relative">
                    {/* Progress Bar */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full">
                        <div 
                            className="h-1 bg-primary rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Steps */}
                    {steps.map((step, index) => {
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        const Icon = step.icon;

                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                {/* Step Circle */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isCompleted 
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                                        : isActive 
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/20' 
                                            : 'bg-muted text-muted-foreground'
                                }`}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : (
                                        <Icon className="w-6 h-6" />
                                    )}
                                </div>

                                {/* Step Label */}
                                <div className="mt-3 text-center">
                                    <div className={`font-semibold text-sm transition-colors duration-300 ${
                                        isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                        {step.label}
                                    </div>
                                    <div className={`text-xs mt-1 transition-colors duration-300 ${
                                        isActive || isCompleted ? 'text-foreground/70' : 'text-muted-foreground'
                                    }`}>
                                        {step.description}
                                    </div>
                                </div>

                                {/* Step Number */}
                                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                                    isCompleted 
                                        ? 'bg-green-500 text-white' 
                                        : isActive 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                }`}>
                                    {step.id}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Step Progress Text */}
                <div className="text-center mt-6">
                    <div className="text-sm text-muted-foreground">
                        Step {currentStep} of {steps.length}
                    </div>
                    <div className="text-lg font-semibold text-foreground mt-1">
                        {steps[currentStep - 1]?.label}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceStepper;