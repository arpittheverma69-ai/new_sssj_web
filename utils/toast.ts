import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const showToast = {
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    error: (message: string, options?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...options });
    },

    info: (message: string, options?: ToastOptions) => {
        toast.info(message, { ...defaultOptions, ...options });
    },

    warning: (message: string, options?: ToastOptions) => {
        toast.warn(message, { ...defaultOptions, ...options });
    },

    loading: (message: string, options?: ToastOptions) => {
        return toast.loading(message, { ...defaultOptions, ...options });
    },

    // Update a loading toast to success/error
    update: (toastId: any, type: 'success' | 'error' | 'info' | 'warning', message: string, options?: ToastOptions) => {
        toast.update(toastId, {
            render: message,
            type,
            isLoading: false,
            ...defaultOptions,
            ...options
        });
    },

    dismiss: (toastId?: any) => {
        toast.dismiss(toastId);
    }
};

// Utility functions for common scenarios
export const apiToast = {
    // For API calls with loading state
    async call<T>(
        apiCall: () => Promise<T>,
        messages: {
            loading: string;
            success: string;
            error?: string;
        }
    ): Promise<T> {
        const toastId = showToast.loading(messages.loading);

        try {
            const result = await apiCall();
            showToast.update(toastId, 'success', messages.success);
            return result;
        } catch (error) {
            const errorMessage = messages.error ||
                (error instanceof Error ? error.message : 'An error occurred');
            showToast.update(toastId, 'error', errorMessage);
            throw error;
        }
    },

    // For simple success/error without loading
    handleResponse: (
        success: boolean,
        successMessage: string,
        errorMessage: string
    ) => {
        if (success) {
            showToast.success(successMessage);
        } else {
            showToast.error(errorMessage);
        }
    }
};
