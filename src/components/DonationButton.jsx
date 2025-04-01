import React from 'react';

const DonationButton = () => {
  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Support Us</h3>
      <p className="text-sm text-gray-600 mb-2">
        If you find Dev-Assist helpful, please consider supporting our work!
      </p>
      <form action="https://www.paypal.com/donate" method="post" target="_blank">
  <input type="hidden" name="business" value="proShop1@proShop1.com" />
  <input type="hidden" name="currency_code" value="USD" />
  <input type="hidden" name="item_name" value="Support Dev-Assist" />
  <input
    type="image"
    src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
    name="submit"
    title="PayPal - The safer, easier way to pay online!"
    alt="Donate with PayPal button"
  />
</form>

    </div>
  );
};

export default DonationButton; 