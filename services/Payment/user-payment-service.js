const Payment = require('../../database/models/payment-model');
const AppError = require('../../utils/appError');
const { checkAndCreateCart } = require('../Carts/user-cart-service');
const userCouponService = require('../Coupons/user-coupon-service');

exports.getCheckout = async (userId, code) => {
  try {
    const userCart = await checkAndCreateCart(userId);

    let subTotal = 0;
    let discount = 0;
    let coupon;

    for (const item of userCart.items) {
      if (!item.product) continue;
      subTotal += item.product.price * item.quantity;
    }
    if (code) {
      coupon = await userCouponService.checkCode(code);

      discount = subTotal * (coupon.discount_percentage / 100);
    }

    const checkout = {
      items: userCart.items,
      subTotal: subTotal,
      discount: discount,
      totalPrice: subTotal - discount,
    };

    return { checkout, coupon };
  } catch (err) {
    throw err;
  }
};

// exports.createPayment = async (user, order) => {
//   try {
//     if (!order.total) return;

//     const myHeaders = new Headers();
//     myHeaders.append('Authorization', `TOKEN ${process.env.PAYMOB_SECRET_KEY}`);
//     myHeaders.append('Content-Type', 'application/json');

//     const raw = JSON.stringify({
//       amount: order.total * 100,
//       currency: 'EGP',
//       payment_methods: [+process.env.PAYMOB_INTEGRATION_ID],
//       items: [],
//       billing_data: {
//         first_name: user.firstName,
//         last_name: user.lastName,
//         phone_number: '+201098843979',
//       },
//     });

//     const requestOptions = {
//       method: 'POST',
//       headers: myHeaders,
//       body: raw,
//       redirect: 'follow',
//     };

//     // fetch('https://accept.paymob.com/v1/intention/', requestOptions)
//     //   .then((response) => response.text())
//     //   .then((result) => console.log(result))
//     //   .catch((error) => console.log('error', error));

//     let response = await fetch(
//       'https://accept.paymob.com/v1/intention/',
//       requestOptions
//     );

//     if (response.status >= 400) {
//       console.log(await response.text());
//       throw new AppError('Internal server error', 500);
//     }

//     response = await response.json();

//     console.log(response);

//     await Payment.create({
//       order_id: order.id,
//       paymob_transaction_id: response.id,
//     });

//     const link = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${response.client_secret}`;

//     return link;
//   } catch (err) {
//     throw err;
//   }
// };

exports.createPayment = async (user, order) => {
  try {
    if (!order.total) return;

    const { token } = await getToken();
    const paymobOrder = await createPaymobOrder(order, token);
    const paymentData = await createPayment(order, paymobOrder.id, user, token);

    await Payment.create({
      order_id: order.id,
      paymob_transaction_id: paymobOrder.id,
    });

    const link = `https://accept.paymob.com/api/acceptance/iframes/837653?payment_token=${paymentData.token}`;

    return link;
  } catch (err) {
    throw err;
  }
};

const getToken = async () => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        api_key: process.env.PAYMOB_API_KEY,
      }),
      redirect: 'follow',
    };

    const response = await fetch(
      'https://accept.paymob.com/api/auth/tokens',
      requestOptions
    );

    if (response >= 400) {
      console.log(await response.text());
      throw new AppError('Internal Server Error', 500);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};

const createPaymobOrder = async (order, token) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: order.total * 100,
        merchant_order_id: order.id,
        items: [],
      }),
      redirect: 'follow',
    };

    const response = await fetch(
      'https://accept.paymob.com/api/ecommerce/orders',
      requestOptions
    );

    if (response >= 400) {
      console.log(await response.text());
      throw new AppError('Internal Server Error', 500);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};

const createPayment = async (order, paymobOrderId, user, token) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        auth_token: token,
        expiration: 3600,
        amount_cents: order.total * 100,
        order_id: paymobOrderId,
        billing_data: {
          apartment: 'NA',
          floor: 'NA',
          street: 'NA',
          building: 'NA',
          shipping_method: 'NA',
          state: 'NA',
          postal_code: 'NA',
          city: 'NA',
          country: 'NA',
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone_number: '+201098843979',
        },
        currency: 'EGP',
        integration_id: process.env.PAYMOB_INTEGRATION_ID,
      }),
      redirect: 'follow',
    };

    const response = await fetch(
      'https://accept.paymob.com/api/acceptance/payment_keys',
      requestOptions
    );

    if (response >= 400) {
      console.log(await response.text());
      throw new AppError('Internal Server Error', 500);
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
};
