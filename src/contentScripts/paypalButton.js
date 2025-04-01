// Create and inject PayPal button container
const createPayPalContainer = () => {
  const container = document.createElement('div');
  container.id = 'dev-assist-paypal-container';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e5e7eb;
    width: 300px;
  `;
  return container;
};

// Create close button
const createCloseButton = (container) => {
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #6b7280;
  `;
  closeButton.onclick = () => container.remove();
  return closeButton;
};

// Create PayPal button
const createPayPalButton = () => {
  const script = document.createElement('script');
  script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=USD';
  script.onload = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '5.00' // Default donation amount
              },
              description: 'Support Dev-Assist Development'
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            // Send message back to extension
            chrome.runtime.sendMessage({
              type: 'DONATION_COMPLETE',
              details: details
            });
          });
        }
      }).render('#dev-assist-paypal-button');
    }
  };
  document.head.appendChild(script);
};

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received message:', request);
  
  if (request.type === 'SHOW_PAYPAL') {
    console.log('Showing PayPal button');
    
    // Remove existing container if any
    const existingContainer = document.getElementById('dev-assist-paypal-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    // Create new container
    const container = createPayPalContainer();
    
    // Add close button
    container.appendChild(createCloseButton(container));
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Support Dev-Assist';
    title.style.cssText = `
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    `;
    container.appendChild(title);

    // Add PayPal button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'dev-assist-paypal-button';
    container.appendChild(buttonContainer);

    // Add container to page
    document.body.appendChild(container);

    // Create PayPal button
    createPayPalButton();
  }
  
  // Return true to indicate we will send a response asynchronously
  return true;
}); 