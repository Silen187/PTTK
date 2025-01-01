
import { sequelize, Product, Order } from "@/lib/sequelize";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return;
  }

  const {
    name, email, city,
    postalCode, streetAddress, country,
    cartProducts,
  } = req.body;

  try {
    // Đảm bảo kết nối cơ sở dữ liệu
    await sequelize.authenticate();

    // Lấy danh sách ID sản phẩm từ giỏ hàng
    const productIds = cartProducts;
    const uniqueIds = [...new Set(productIds)];

    // Truy vấn thông tin sản phẩm từ MySQL
    const productsInfos = await Product.findAll({
      where: {
        id: uniqueIds,
      },
    });

    let line_items = [];

    // Tạo danh sách line_items cho Stripe
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p.id === productId);
      const quantity = productIds.filter(id => id === productId)?.length || 0;
      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: { name: productInfo.title },
            unit_amount: Math.round(productInfo.price * 100),
          },
        });
      }
    }

    // Tạo đơn hàng trong cơ sở dữ liệu
    const orderDoc = await Order.create({
      line_items: JSON.stringify(line_items),
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      paid: false,
    });

    // Tạo phiên Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      success_url: process.env.PUBLIC_URL + '/cart?success=1',
      cancel_url: process.env.PUBLIC_URL + '/cart?canceled=1',
      metadata: { orderId: orderDoc.id, test: 'ok' },
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
