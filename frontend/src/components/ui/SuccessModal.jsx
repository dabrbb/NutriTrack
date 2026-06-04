import React from 'react';
import { CheckCircle } from 'lucide-react';

export const SuccessModal = ({ visible, title, message, onClose, buttonText = "Entendido" }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 items-center shadow-2xl flex flex-col">
                <div className="mb-4">
                    <CheckCircle size={48} className="text-green-600" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center text-green-600">
                    {title}
                </h2>
                <p className="text-gray-600 text-center mb-6 leading-5">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl items-center bg-green-600 hover:bg-green-700 transition-colors text-white font-bold text-base"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};