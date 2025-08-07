'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function CustomToastContainer() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={true}
            draggable={true}
            pauseOnHover={true}
            closeButton={false} 
            toastClassName={() =>
                'text-center w-[300px] bg-black text-white font-mono border border-blue-500 rounded-md px-4 py-3 shadow-[0_0_12px_#00ffff] tracking-wider text-sm'
            }
        />


    );
}
