import React, { useEffect, useRef, useState } from 'react';

const PayPalDonation = ({ amount = '5.00' }) => {
  const paypalRef = useRef();
  const [open, setOpen] = useState(true)

  useEffect(() => {
    // Load the PayPal JavaScript SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
    script.addEventListener('load', setupPayPal);
    document.body.appendChild(script);

    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const setupPayPal = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Donation to Dev-Assist',
                amount: {
                  currency_code: 'USD',
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          // Handle successful donation
          alert(`Thank you for your support! Transaction completed.`);
          console.log('Donation successful', order);
        },
        onError: (err) => {
          console.error('PayPal donation error:', err);
          alert('There was an error processing your donation. Please try again later.');
        },
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'donate'
        }
      }).render(paypalRef.current);
    }
  };

  return (
    <>
      {open && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          {/* Replace the plain text X with an SVG icon */}
          <button
            className="cursor-pointer focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-lg font-medium mb-2">Support Dev-Assist</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you find this tool helpful, please consider supporting our
            development!
          </p>
          <div ref={paypalRef}></div>
        </div>
      )}
    </>
  );
  
};

export default PayPalDonation; 