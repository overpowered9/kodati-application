export const orderCompleteTemplate =
  `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #007bff; color: white; text-align: center; padding: 20px;">
      <h1 style="margin: 0; font-size: 24px;">Kodati Order Fulfilled!</h1>
    </div>
    <div style="padding: 20px; background-color: #fff; border-radius: 5px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
      <p>Dear {{Customer}}, <b>{{! Placeholder for customer's name }}</b></p> 
      <p>Your order has been fulfilled. Here are the details:<br></p>
      {{#each OrderItems}}
        <div style="margin-bottom: 20px;">
          <h2 style="margin: 0 0 10px; color: #333; font-size: 20px;">Order Item #{{inc @index}}</h2>
          <ul style="padding: 0; margin: 0;">
            <li style="margin-bottom: 10px; font-size: 16px;">Quantity: {{this.quantity}} <b>{{! Placeholder for the quantity }}</b></li>
            <li style="margin-bottom: 10px; font-size: 16px;">Cards:</li>
            <ul style="padding: 0; margin: 0;">
              {{#each this.Cards}}
                <li style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; font-size: 16px;">Card Number: {{this.card_number}} <b>{{! Placeholder for card number }}</b></li>
                <li style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; font-size: 16px;">Pin Code: {{this.pin_code}} <b>{{! Placeholder for pin code }}</b></li>
              {{/each}}
            </ul>
          </ul>
        </div>
      {{/each}}
      <p style="margin: 0 0 10px; font-size: 16px;"><br>If you have any questions, please contact our support team.</p>
      <p style="margin: 0; font-size: 16px;">Thank you for choosing us!</p>
    </div>
  </div>`;