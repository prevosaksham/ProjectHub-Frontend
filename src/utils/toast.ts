import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        duration: 3000,
        style: {
            borderRadius: '8px',
            background: '#4caf50',
            color: '#fff',
        },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        duration: 3000,
        style: {
            borderRadius: '8px',
            background: '#f44336',
            color: '#fff',
        },
    });
};

export const showInfoToast = (message: string) => {
    toast(message, {
        duration: 3000,
        style: {
            borderRadius: '8px',
            background: '#2196f3',
            color: '#fff',
        },
    });
};