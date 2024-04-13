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

exports.createPayment = async (user, order) => {
  try {
    if (!order.total) return;

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `TOKEN ${process.env.PAYMOB_SECRET_KEY}`);
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      amount: order.total * 100,
      currency: 'EGP',
      payment_methods: [+process.env.PAYMOB_INTEGRATION_ID],
      items: [],
      billing_data: {
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: '+201098843979',
      },
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    // fetch('https://accept.paymob.com/v1/intention/', requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log('error', error));

    let response = await fetch(
      'https://accept.paymob.com/v1/intention/',
      requestOptions
    );

    if (response.status >= 400) {
      console.log(await response.text());
      throw new AppError('Internal server error', 500);
    }

    response = await response.json();

    console.log(response);

    await Payment.create({
      order_id: order.id,
      paymob_transaction_id: response.id,
    });

    const link = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${response.client_secret}`;

    return link;
  } catch (err) {
    throw err;
  }
};
