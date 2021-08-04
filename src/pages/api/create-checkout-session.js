const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req,res) => {
    const { items, email } = req.body;

    console.log(items);
    console.log(email);


    const transformedItems = items.map(item => ({
        description: item.product.description,
        quantity: item.cnt,
        price_data : {
            currency : 'inr',
            unit_amount: item.product.price * 100,
            product_data : {
                name : item.product.title,
                images: [item.product.image],
            },
        },
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        shipping_rates: ['shr_1JKO35SH2NO4UplAfMsL2xaY'],
        shipping_address_collection: {
            allowed_countries: ['IN','GB','US','CA']
        },
        line_items: transformedItems,
        mode: 'payment',
        success_url: `${process.env.HOST}/success`,
        cancel_url: `${process.env.HOST}/checkout`,
        metadata: {
            email,
            images: JSON.stringify(items.map(item => item.product.image)),
        },
    });

    res.status(200).json({
        id: session.id,
    })

};