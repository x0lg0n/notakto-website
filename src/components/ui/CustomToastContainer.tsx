'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VT323 } from "next/font/google";

const vt323 = VT323({
  weight: "400", 
  subsets: ["latin"],
});


export function CustomToastContainer() {
    return (
        <ToastContainer
            position="top-center"   // shows toast at top-center ... many other options have available
            autoClose={4000}        // This can be changed accordingly 
            hideProgressBar={true}  // keep this true always
            newestOnTop={false}     // older toasts stay on top
            closeOnClick={false}  
            rtl={false}             // we dont want right-to-left layout
            pauseOnFocusLoss={true} 
            draggable={true}        // draggable
            pauseOnHover={true}     // The Toast Notification pauses on hover
            closeButton={false}     // Close X Button
            toastClassName={() =>
                `${vt323.className} text-[22px] text-center w-[280px] bg-black text-white font-mono border border-blue-500 rounded-md px-4 py-3 shadow-[0_0_12px_#00ffff] tracking-wider`
            }
        />


    );
}
