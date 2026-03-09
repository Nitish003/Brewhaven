/**
 * THE BREW HAVEN — chatbot.js  v2
 * Comprehensive coffee concierge chatbot with full company, product & service coverage
 */

'use strict';

const Chatbot = (() => {

    // ─────────────────────────────────────────────────────────────
    //  KNOWLEDGE BASE
    // ─────────────────────────────────────────────────────────────
    const KB = [

        // ── GREETINGS
        {
            id: 'greet',
            patterns: [/^(hello|hi|hey|namaste|good morning|good evening|good afternoon|howdy|sup|hola|greetings)/i],
            reply: `Hello! ☕ Welcome to **The Brew Haven**. I'm **Brew**, your personal coffee concierge. I can help you with:\n\n• Our coffees & origins\n• Brewing guides & tips\n• Pricing & offers\n• Shipping & delivery\n• Returns & refunds\n• Our story & sustainability\n\nWhat would you like to know?`,
            chips: ['View all products', 'Brewing guides', 'Shipping info', 'Our story'],
        },

        // ── ABOUT THE COMPANY
        {
            id: 'about',
            patterns: [/who are you|about you|about the brew haven|what is brew haven|tell me about|your company|about brewha/i],
            reply: `**The Brew Haven** is a premium Indian specialty coffee brand.\n\nWe source single-origin beans **directly** from family farms in **Coorg (Kodagu)** and **Chikmagalur**, Karnataka — two of India's most celebrated coffee-growing regions.\n\nFounded in 2021, we work without brokers or middlemen. We pay farmers **30%+ above fair trade rates**, roast in small batches in Bangalore, and ship within 48 hours of roasting.\n\n🌿 **Mission**: Bring India's finest coffee to your cup, transparently and ethically.`,
            chips: ['Our products', 'Our story', 'Sustainability', 'Meet the farmers'],
        },

        // ── FOUNDERS / TEAM
        {
            id: 'founders',
            patterns: [/founder|team|who started|who made|created by|started by|behind brew/i],
            reply: `The Brew Haven was founded in 2021 by two travel writers who visited a coffee farm in Coorg on assignment — and never quite recovered from the experience. They spent the next 12 months visiting 40 farms across Coorg and Chikmagalur before launching the brand.\n\nOur small team is based in **Indiranagar, Bangalore**, with on-ground sourcing partners in Kodagu and Chikmagalur.`,
            chips: ['Our story', 'Farm partners', 'Visit us'],
        },

        // ── LOCATION / ROASTERY
        {
            id: 'location',
            patterns: [/where are you|location|address|roastery|bangalore|where.*based|visit you|store/i],
            reply: `**Roastery & HQ**: Indiranagar, Bangalore, Karnataka\n**Sourcing**: Kodagu (Coorg) & Chikmagalur, Karnataka\n\nWe're a direct-to-consumer brand — no retail stores currently. All orders ship pan-India from our Bangalore roastery.\n\n📧 hello@brewhaven.in\n📞 +91 98765 43210 (Mon–Sat · 9am–6pm IST)`,
            chips: ['Contact us', 'Shipping info', 'All products'],
        },

        // ── ALL PRODUCTS
        {
            id: 'all-products',
            patterns: [/all products|your products|what do you sell|what.*offer|full range|collection|catalog/i],
            reply: `We currently offer **8 products**:\n\n☕ **Light Roast**\n• Coorg Light Roast — ₹649 / 250g\n• Chikmagalur Honey Process — ₹849 / 200g\n\n🔥 **Dark Roast**\n• Dark Reserve Blend — ₹749 / 250g\n• Espresso Blend — ₹699 / 250g\n• South Indian Filter Blend — ₹499 / 250g\n\n🧊 **Cold Brew**\n• Cold Brew Concentrate — ₹549 / 500ml\n\n🎁 **Bundles & Equipment**\n• Pour Over Starter Kit — ₹1,849\n• Connoisseur's Subscription Box — ₹1,299/month`,
            chips: ['Shop all', 'Light Roast', 'Dark Roast', 'Subscription Box'],
        },

        // ── COORG LIGHT ROAST
        {
            id: 'coorg',
            patterns: [/coorg light|light roast|coorg roast|jasmine|citrus.*coffee/i],
            reply: `**Single Origin Coorg Light Roast** ☕\n**Price**: ₹649 / 250g\n**Origin**: Kodagu, Karnataka · 1,200m elevation\n**Farm**: Devagiri Estate\n**Process**: Washed\n**Tasting Notes**: Citrus · Jasmine · Honey\n\nGrown at 1,200m in pepper-vine-shaded estates. Handpicked, sun-dried on raised beds. A bright, clean, floral cup — our bestseller. Perfect for pour over or AeroPress.\n\n✅ In stock — added to bag in seconds!`,
            chips: ['Add to Bag', 'How to brew pour over', 'Other light roasts', 'Shop all'],
        },

        // ── DARK RESERVE
        {
            id: 'dark-reserve',
            patterns: [/dark reserve|reserve blend|dark.*roast|molasses|chikmagalur.*dark/i],
            reply: `**Dark Roast Reserve Blend** 🔥\n**Price**: ₹749 / 250g\n**Origin**: Chikmagalur, Karnataka · 1,800m elevation\n**Farm**: Mullayanagiri Hills Estate\n**Process**: Natural\n**Tasting Notes**: Dark Chocolate · Molasses · Oak\n\nFrom the highest coffee-growing hills in South India. Slow-roasted in small batches. Bold, resonant, structured. A coffee that demands to be noticed. Ideal for moka pot, French press, or espresso.`,
            chips: ['Add to Bag', 'How to brew moka pot', 'Shop all', 'Our story'],
        },

        // ── COLD BREW
        {
            id: 'cold-brew',
            patterns: [/cold brew|concentrate|iced coffee|summer|cold.*coffee/i],
            reply: `**Cold Brew Concentrate** 🧊\n**Price**: ₹549 / 500ml\n**Process**: 18-hour cold steep at 4°C\n**Notes**: Caramel · Stone Fruit · Cream\n\nA dual-origin blend (Coorg + Chikmagalur) steeped for exactly 18 hours. Low acid, naturally sweet, silky smooth.\n\n**How to use**: Dilute 1:4 with cold water or milk. Pour over ice. Enjoy.\n\nBuilt for Indian summers. Refrigerate after opening; best within 7 days.`,
            chips: ['Add to Bag', 'Shop all', 'Other coffees'],
        },

        // ── HONEY PROCESS
        {
            id: 'honey',
            patterns: [/honey process|honey.*coffee|chikmagalur honey|kemmanagundi/i],
            reply: `**Chikmagalur Honey Process** 🍯\n**Price**: ₹849 / 200g\n**Origin**: Kemmanagundi Estate, Chikmagalur · 1,500m\n**Process**: Honey (21-day raised bed drying)\n**Notes**: Wildflower Honey · Peach · Brown Sugar\n\nOur rarest lot. The honey process leaves the cherry's natural mucilage on the bean during drying — creating extraordinary sweetness without any added ingredients. Almost dessert-like in the cup.`,
            chips: ['Add to Bag', 'What is honey process?', 'Shop all'],
        },

        // ── ESPRESSO
        {
            id: 'espresso',
            patterns: [/espresso blend|espresso.*coffee|crema|double shot/i],
            reply: `**The Brew Haven Espresso** ☕\n**Price**: ₹699 / 250g\n**Blend**: 60% Coorg Arabica + 40% Chikmagalur Robusta\n**Process**: Natural + Washed\n**Notes**: Dark Caramel · Hazelnut · Cocoa\n\nEngineered for rich crema and a long, lingering finish. Works equally well in a moka pot. The Robusta provides structure and crema body; the Arabica provides sweetness and aroma. At 28 seconds, this delivers what we believe is the perfect espresso extraction.`,
            chips: ['Add to Bag', 'Espresso brewing tips', 'Shop all'],
        },

        // ── FILTER COFFEE
        {
            id: 'filter',
            patterns: [/filter coffee|south indian filter|filter blend|chicory|decoction|brass filter|tumbler/i],
            reply: `**South Indian Filter Blend** 🫖\n**Price**: ₹499 / 250g\n**Blend**: 90% Coorg Arabica + 10% Chicory\n**Notes**: Chicory · Dark Toffee · Smoke\n**Roast**: Dark\n\nOur homage to the most intimate morning ritual in South India. Ground specifically for traditional brass filters. Brew fresh decoction, mix with hot milk, pour back and forth to get that perfect froth. Deeply nostalgic. Our most affordable product.\n\n🏅 Best Seller among Heritage Coffee lovers.`,
            chips: ['Add to Bag', 'How to brew filter coffee', 'Shop all'],
        },

        // ── POUR OVER KIT
        {
            id: 'pour-over-kit',
            patterns: [/pour over kit|starter kit|chemex|beginner|equipment|kit/i],
            reply: `**Pour Over Starter Kit** 🫗\n**Price**: ₹1,849\n**Contents**:\n• 1× 3-cup Chemex carafe (wooden handle)\n• 1× 100g Coorg Light Roast (pre-ground for pour over)\n• 1× pack of 30 Chemex filter papers\n• 1× brew ratio guide card\n• 1× illustrated brewing booklet\n\nThe perfect gift for someone beginning their specialty coffee journey. Everything you need, nothing you don't.`,
            chips: ['Add to Bag', 'How to brew pour over', 'Shop all'],
        },

        // ── SUBSCRIPTION BOX
        {
            id: 'subscription',
            patterns: [/subscription|monthly box|connoisseur|subscribe|recurring|membership/i],
            reply: `**The Connoisseur's Monthly Box** 🎁\n**Price**: ₹1,299 / month\n**Includes**:\n• 2× 150g seasonal bags (your roast preference)\n• Handwritten tasting notes from our head roaster\n• Monthly brewing guide\n• Exclusive member offers\n\n✅ No contracts — cancel anytime, instantly\n✅ New origins curated every month\n✅ Delivered to your door\n\nOur most popular offering. Over 60% of subscribers have been with us 6+ months.`,
            chips: ['Subscribe now', 'Shop all', 'Cancellation policy'],
        },

        // ── HONEY PROCESS EXPLANATION
        {
            id: 'what-is-honey',
            patterns: [/what is honey process|honey process.*mean|explain.*honey/i],
            reply: `**What is Honey Processing?**\n\nIt is a coffee processing method between washed and natural:\n\n1. The outer cherry skin is removed\n2. A precise amount of sticky **mucilage** (naturally rich in sugars) is left on the bean\n3. Beans are dried on raised beds for 18–21 days, turned by hand every few hours\n\nThe result: extraordinary natural sweetness and fruit-like complexity — without any added ingredients. The "honey" refers to the color of the beans during drying, and the sweetness in the cup.`,
            chips: ['Shop Honey Process', 'All products', 'What is washed process?'],
        },

        // ── BREWING — POUR OVER
        {
            id: 'brew-pour-over',
            patterns: [/pour over.*brew|how.*pour over|v60|chemex.*brew|dripper/i],
            reply: `**Pour Over Brewing Guide** 🫗\n\n**Best coffee**: Coorg Light Roast or Honey Process\n**Grind**: Medium-coarse (like sea salt)\n**Water temp**: 92–94°C\n**Ratio**: 15g coffee : 250ml water\n\n**Steps**:\n1. Rinse filter with hot water\n2. Add ground coffee, create a center well\n3. Pour 30ml water, wait 30s (bloom)\n4. Pour remaining water in slow circles over 3 minutes\n5. Total brew time: 3–4 minutes\n\n☕ Result: A clean, bright, floral cup.`,
            chips: ['Shop Coorg Light Roast', 'Other brewing methods', 'Shop Pour Over Kit'],
        },

        // ── BREWING — FRENCH PRESS
        {
            id: 'brew-french-press',
            patterns: [/french press|plunger.*brew|how.*french press/i],
            reply: `**French Press Brewing Guide** 🫖\n\n**Best coffee**: Dark Reserve Blend\n**Grind**: Coarse (like breadcrumbs)\n**Water temp**: 93–96°C\n**Ratio**: 15g coffee : 250ml water\n\n**Steps**:\n1. Add ground coffee to press\n2. Pour hot water, stir gently\n3. Put lid on (don't press yet)\n4. Steep for **4 minutes** exactly\n5. Press plunger slowly and evenly\n6. Pour immediately — don't let it sit\n\n☕ Result: Full-bodied, rich, oily — a bold cup with depth.`,
            chips: ['Shop Dark Reserve', 'Other brewing methods'],
        },

        // ── BREWING — MOKA POT
        {
            id: 'brew-moka',
            patterns: [/moka pot|stovetop|bialetti|how.*moka/i],
            reply: `**Moka Pot Brewing Guide** 🫖\n\n**Best coffee**: Espresso Blend or Dark Reserve\n**Grind**: Medium-fine (like table salt)\n**Ratio**: Fill basket level, water to valve line\n\n**Steps**:\n1. Fill bottom chamber to just below safety valve\n2. Fill basket with coffee, don't tamp\n3. Assemble and place on low heat\n4. Remove from heat when gurgling starts\n5. Run base under cold water to stop extraction\n\n☕ Result: Near-espresso intensity — strong, concentrated, with beautiful aroma.`,
            chips: ['Shop Espresso Blend', 'Shop Dark Reserve', 'Other brewing methods'],
        },

        // ── BREWING — FILTER COFFEE
        {
            id: 'brew-filter',
            patterns: [/how.*filter coffee|south indian.*brew|brass filter.*how|decoction.*how/i],
            reply: `**South Indian Filter Coffee Guide** ☕\n\n**Best coffee**: South Indian Filter Blend\n**Grind**: Medium-fine, slightly finer than pour over\n\n**Steps**:\n1. Add 2 heaped tsp of coffee to the upper filter compartment\n2. Gently press the pressing disc on top\n3. Pour 60–80ml of nearly boiling water\n4. Cover and allow to drip for 10–15 minutes\n5. In a separate tumbler, mix 1 part decoction + 3 parts hot milk\n6. Pour back and forth between tumblers to cool and create froth\n\n☕ Serve with sugar if desired. This is South India at its best.`,
            chips: ['Shop Filter Blend', 'Other brewing methods'],
        },

        // ── BREWING — COLD BREW
        {
            id: 'brew-cold',
            patterns: [/how.*cold brew|make cold brew|steep.*cold/i],
            reply: `**Cold Brew Brewing Guide** 🧊\n\n**Best coffee**: Our ready-made Cold Brew Concentrate (₹549)\n\nOR make your own:\n**Coffee**: Dark Reserve or Espresso Blend\n**Grind**: Extra coarse (like peppercorns)\n**Ratio**: 1:8 (50g coffee : 400ml cold water)\n\n**Steps**:\n1. Combine coffee and filtered cold water in jar\n2. Stir well, cover\n3. Refrigerate for **18–24 hours**\n4. Strain through fine mesh + paper filter\n5. Dilute 1:2 with water or milk before serving\n\nOr just buy our ready-made concentrate — it's steeped and strained already! ☕`,
            chips: ['Buy Cold Brew Concentrate', 'Other methods'],
        },

        // ── BREWING — AEROPRESS
        {
            id: 'brew-aeropress',
            patterns: [/aeropress|aero press|how.*aeropress/i],
            reply: `**AeroPress Brewing Guide** ✈️\n\n**Best coffee**: Coorg Light Roast or Honey Process\n**Grind**: Medium-fine\n**Water temp**: 85–90°C (slightly cooler for lighter roasts)\n**Ratio**: 17g coffee : 220ml water\n\n**Steps (Inverted Method)**:\n1. Assemble AeroPress inverted (plunger end up)\n2. Add ground coffee\n3. Pour water, stir 10 seconds\n4. Steep 1–2 minutes\n5. Cap, flip onto cup, press slowly (30 seconds)\n\n☕ Result: Smooth, concentrated, surprisingly complex. Perfect for travel.`,
            chips: ['Shop Coorg Light Roast', 'Shop Honey Process', 'Other methods'],
        },

        // ── ALL BREWING METHODS
        {
            id: 'brew-all',
            patterns: [/brewing guide|how.*brew|brew.*method|how.*make coffee|best.*brew/i],
            reply: `Here are all our brewing guides:\n\n🫗 **Pour Over** → Best with Coorg Light Roast\n🫖 **French Press** → Best with Dark Reserve Blend\n🇮🇹 **Moka Pot** → Best with Espresso Blend\n🧊 **Cold Brew** → Our ready-made Concentrate\n✈️ **AeroPress** → Best with Coorg Light Roast\n☕ **South Indian Filter** → Best with Filter Blend\n\nWhich method would you like a detailed guide for?`,
            chips: ['Pour Over', 'French Press', 'Moka Pot', 'Filter Coffee', 'Cold Brew'],
        },

        // ── TASTING NOTES / FLAVOUR PROFILE
        {
            id: 'tasting',
            patterns: [/tasting note|flavour|flavor|taste.*like|notes.*coffee|what.*taste/i],
            reply: `Here are the tasting notes for each coffee:\n\n🌿 **Coorg Light Roast** — Citrus · Jasmine · Honey\n🍫 **Dark Reserve** — Dark Chocolate · Molasses · Oak\n🧊 **Cold Brew** — Caramel · Stone Fruit · Cream\n🍯 **Honey Process** — Wildflower Honey · Peach · Brown Sugar\n💛 **Espresso Blend** — Dark Caramel · Hazelnut · Cocoa\n🪵 **Filter Blend** — Chicory · Dark Toffee · Smoke\n\nWould you like more detail about any specific coffee?`,
            chips: ['Shop all', 'Coorg Light Roast', 'Honey Process', 'Dark Reserve'],
        },

        // ── WHICH COFFEE TO BUY
        {
            id: 'recommend',
            patterns: [/which.*coffee|recommend|suggest|best for me|what should i buy|new to coffee|beginner/i],
            reply: `Happy to help! Here's a quick guide:\n\n☕ **If you love light, floral coffees** → Coorg Light Roast (₹649) or Honey Process (₹849)\n\n🔥 **If you love bold, dark coffees** → Dark Reserve Blend (₹749) or Filter Blend (₹499)\n\n☕ **If you love espresso drinks** → Espresso Blend (₹699)\n\n🧊 **If you want refreshing cold coffee** → Cold Brew Concentrate (₹549)\n\n🎁 **If you want to try everything** → Connoisseur's Box (₹1,299/mo)\n\n🫗 **If you're just starting out** → Pour Over Starter Kit (₹1,849, includes coffee + equipment)`,
            chips: ['Shop all', 'Subscription Box', 'Pour Over Kit'],
        },

        // ── PRICING
        {
            id: 'pricing',
            patterns: [/price|cost|how much|₹|rs\.|rupee|expensive|cheap|afford/i],
            reply: `**Our Pricing** (all prices inclusive):\n\n☕ Coorg Light Roast 250g → **₹649**\n🔥 Dark Reserve Blend 250g → **₹749**\n🧊 Cold Brew Concentrate 500ml → **₹549**\n🍯 Honey Process 200g → **₹849**\n💛 Espresso Blend 250g → **₹699**\n☕ South Indian Filter Blend 250g → **₹499**\n🫗 Pour Over Starter Kit → **₹1,849**\n🎁 Connoisseur's Box → **₹1,299 / month**\n\n✅ **Free shipping** on orders above ₹999\n✅ **Express delivery** (1–2 days) available at ₹99 extra`,
            chips: ['Shop all', 'Free shipping details', 'Subscription Box'],
        },

        // ── OFFERS / DISCOUNTS
        {
            id: 'offers',
            patterns: [/discount|offer|coupon|promo|deal|sale|off|voucher|code/i],
            reply: `**Current Offers** 🎉\n\n• **Free shipping** on all orders above ₹999\n• **Subscribe & Save**: Connoisseur's Box members get priority access to limited lots and small-batch specials that are never sold publicly\n• **Newsletter subscribers** receive exclusive first-access codes for new arrivals and seasonal releases\n\n💌 Subscribe to our newsletter to never miss an offer!`,
            chips: ['Subscribe newsletter', 'Shop all', 'Subscription Box'],
        },

        // ── SHIPPING
        {
            id: 'shipping',
            patterns: [/ship|deliver|dispatch|how long|when.*arrive|days.*deliver|express.*delivery|free ship/i],
            reply: `**Shipping & Delivery** 📦\n\n• **Standard**: 3–5 business days across India — **FREE above ₹999**\n• **Express**: 1–2 business days — ₹99 extra\n• **Dispatch**: All orders dispatched within **24 hours** of being placed\n• **Freshness**: Coffee is roasted within 48 hours of your order\n\nWe ship to all major cities and most PIN codes across India. After dispatch you'll receive a tracking link via email.`,
            chips: ['Track my order', 'Return policy', 'Contact us'],
        },

        // ── TRACKING
        {
            id: 'tracking',
            patterns: [/track|tracking|where.*order|status.*order|order.*status/i],
            reply: `**Order Tracking** 🔍\n\nAfter your order is dispatched (within 24 hours of placing), you'll receive:\n• A **confirmation email** with your order summary\n• A **tracking link** via email/SMS once shipped\n\nIf you haven't received a tracking link within 48 hours of ordering, please reach out:\n📧 hello@brewhaven.in\n📞 +91 98765 43210 (Mon–Sat · 9am–6pm IST)`,
            chips: ['Contact us', 'Shipping info', 'Return policy'],
        },

        // ── RETURNS / REFUNDS
        {
            id: 'returns',
            patterns: [/return|refund|replace|exchange|not happy|damaged|wrong.*order|money back/i],
            reply: `**Our Return & Refund Policy** ✅\n\nWe stand behind every bag.\n\n• Contact us within **7 days** of delivery\n• We'll send a **full replacement** or issue a **complete refund** — no questions asked\n• Works for: damaged packaging, incorrect items, quality concerns\n• **Process**: Email hello@brewhaven.in with your order number and a photo\n\nWe process refunds within 3–5 business days to your original payment method.`,
            chips: ['Contact us', 'Shipping info', 'Shop all'],
        },

        // ── PAYMENT
        {
            id: 'payment',
            patterns: [/payment|pay|upi|card|net banking|cod|cash on delivery|checkout/i],
            reply: `**Payment Options** 💳\n\nWe accept:\n• UPI (GPay, PhonePe, Paytm)\n• Credit & Debit Cards (Visa, Mastercard, RuPay)\n• Net Banking\n• Wallets (Paytm, Amazon Pay)\n\n**Is it secure?** Yes — all transactions are SSL-encrypted and processed through a PCI-DSS compliant gateway. We never store your card details.`,
            chips: ['Shipping info', 'Return policy', 'Shop all'],
        },

        // ── SUBSCRIPTION CANCELLATION
        {
            id: 'cancel',
            patterns: [/cancel|cancell|pause.*subscription|stop.*subscription/i],
            reply: `**Cancelling Your Subscription** 📋\n\n• Log into your account and cancel with **one click** — no calls, no forms\n• No cancellation fees, penalties, or lock-in period\n• You'll continue receiving your box until the current billing period ends\n• You can also **pause** (up to 2 months) instead of cancelling\n\nNeed help? Email hello@brewhaven.in and we'll handle it within 24 hours.`,
            chips: ['Subscription Box info', 'Contact us'],
        },

        // ── WHOLESALE / CAFÉS
        {
            id: 'wholesale',
            patterns: [/wholesale|cafe|café|restaurant|bulk|b2b|business.*order|office/i],
            reply: `**Wholesale & Café Partnerships** 🏪\n\nWe work with a **select number of specialty cafés and restaurants** across India.\n\n**What we offer**:\n• Wholesale pricing with minimum order quantities\n• Custom roast profiles on request\n• Branded packaging for café partners\n• Barista training support\n• Consistent small-batch supply\n\n📧 **Apply**: wholesale@brewhaven.in\nWe respond within 48 hours with our wholesale catalogue.`,
            chips: ['Contact us', 'All products'],
        },

        // ── GIFT / GIFTING
        {
            id: 'gift',
            patterns: [/gift|gifting|present|gift set|someone special|friend.*coffee|birthday/i],
            reply: `**Gifting from The Brew Haven** 🎁\n\nOur best gifting options:\n\n🎁 **Connoisseur's Box** — ₹1,299/month — The ultimate coffee lover's gift (they can cancel anytime)\n\n🫗 **Pour Over Starter Kit** — ₹1,849 — Perfect for someone new to specialty coffee\n\n🍯 **Honey Process** — ₹849 — A rare, impressive gift for a coffee connoisseur\n\nAll orders come in our signature dark packaging. Want a **personal note** added? Mention it in your order comments and we'll handwrite it.`,
            chips: ['Shop Subscription Box', 'Shop Pour Over Kit', 'Shop all'],
        },

        // ── SUSTAINABILITY
        {
            id: 'sustainability',
            patterns: [/sustainab|eco|environment|green|planet|packaging.*bio|compost|carbon|tree|forest/i],
            reply: `**Our Sustainability Commitments** 🌿\n\n• **100% biodegradable packaging** — NatureFlex™ plant-based, home-compostable bags\n• **Direct Trade Pricing** — farmers paid 30%+ above fair trade rates\n• **Zero-Waste Roastery** — chaff composted, silver skin repurposed, green energy powered\n• **Carbon-Offset Delivery** — every shipment is offset through Western Ghats reforestation\n\nWe believe that great coffee and genuine sustainability are not in conflict — they are the same thing.`,
            chips: ['Our story', 'View products', 'Direct trade'],
        },

        // ── DIRECT TRADE
        {
            id: 'direct-trade',
            patterns: [/direct trade|fair trade|ethical|farmer.*pay|no.*broker|farm.*partner/i],
            reply: `**Our Direct Trade Model** 🤝\n\nWe buy every coffee directly from the farm — **no brokers, no middlemen**.\n\n• Farmers are paid **before we bottle** (pre-payment on harvest)\n• We pay **30–50% above** commodity fair trade rates\n• We have visited **every farm we source from** in person\n• Our farmers know our names. We know theirs.\n\nThis is not a marketing line for us — it's the whole point of The Brew Haven.`,
            chips: ['Meet the farmers', 'Our story', 'Sustainability'],
        },

        // ── ORIGINS — COORG
        {
            id: 'origin-coorg',
            patterns: [/coorg|kodagu|western ghats.*coorg|coorg.*region/i],
            reply: `**Coorg (Kodagu), Karnataka** 🌿\n\nOne of India's most celebrated coffee regions. Key facts:\n\n• **Elevation**: 900–1,500m\n• **Climate**: Mist-draped, high rainfall, rich volcanic soil\n• **Unique feature**: Coffee grown in the shade of silver oak trees and pepper vines\n• **Variety**: Predominantly Arabica\n• **Our farm**: Devagiri Estate (1,200m)\n\nThe cool nights and humid days create remarkable sweetness and delicate acidity in the bean.`,
            chips: ['Shop Coorg Light Roast', 'Chikmagalur', 'All products'],
        },

        // ── ORIGINS — CHIKMAGALUR
        {
            id: 'origin-chikmagalur',
            patterns: [/chikmagalur|chikkamagaluru|bababudan|babbudan|mullayanagiri/i],
            reply: `**Chikmagalur, Karnataka** ⛰️\n\nWhere Indian coffee was born — in the 1670s, a Sufi saint named Baba Budan smuggled 7 coffee seeds from Mecca and planted them in these hills.\n\n• **Elevation**: 1,200–1,900m (some of South India's highest)\n• **Climate**: Cloud-covered, cool, volcanic terrain\n• **Known for**: Bold, complex, high-altitude coffees\n• **Our farms**: Mullayanagiri Hills Estate & Kemmanagundi Estate\n\nThe bold complexity of our Dark Reserve and Honey Process both come from here.`,
            chips: ['Shop Dark Reserve', 'Shop Honey Process', 'All products'],
        },

        // ── ROASTING
        {
            id: 'roasting',
            patterns: [/roast|how.*roast|small batch|fresh.*roast|roastery|when.*roasted/i],
            reply: `**Our Roasting Process** 🔥\n\n• **Small-batch**: Every production run is 5–15kg maximum — never bulk roasted\n• **Freshness**: Roasted **within 48 hours** of your order (we don't pre-roast stock)\n• **Location**: Our roastery in Indiranagar, Bangalore\n• **Energy**: Green energy-powered roastery\n• **Waste**: All chaff is composted and returned to farm partners\n\nYou receive your coffee at the ideal degassing stage — 3–7 days post-roast — when flavour is at its peak.`,
            chips: ['View products', 'Sustainability', 'Our story'],
        },

        // ── FRESHNESS / SHELF LIFE
        {
            id: 'freshness',
            patterns: [/fresh|shelf life|how long.*last|expiry|best before|store.*coffee|keep.*coffee/i],
            reply: `**Coffee Freshness & Storage** 📦\n\n• Your coffee is roasted **within 48 hours of dispatch** — never pre-roasted stock\n• Best consumed **within 4–6 weeks** of roast date for peak flavour\n• Acceptable quality up to **3 months** if sealed and stored correctly\n\n**How to store**:\n✅ Store in original bag (one-way valve), in a cool, dark place\n✅ Seal tightly after every use\n❌ Don't refrigerate (condensation hurts the bean)\n❌ Don't freeze unless planning long-term storage (1yr+)`,
            chips: ['View products', 'Brewing guides', 'Shop all'],
        },

        // ── GRIND / PRE-GROUND
        {
            id: 'grind',
            patterns: [/grind|ground|whole bean|pre.?ground|grinder|coffee.*ground/i],
            reply: `**Whole Bean or Pre-Ground?** ☕\n\nAll our coffees are available as:\n\n🫘 **Whole Bean** — grind fresh at home for maximum flavour (recommended)\n⚙️ **Pre-Ground** — ground for your specific method (Pour Over / French Press / Moka Pot / Filter Coffee / Cold Brew)\n\n**How to request grind**: Add a note in your order specifying your brewing method (e.g., "Pre-ground for pour over").\n\nWe use a precision grinder calibrated to exact particle sizes for each method.`,
            chips: ['Shop all', 'Brewing guides'],
        },

        // ── ORGANIC / CERTIFIED
        {
            id: 'organic',
            patterns: [/organic|certified|pesticide|chemical|natural|spray/i],
            reply: `**Are your coffees organic?**\n\nAll our farm partners follow **low-chemical and traditional farming practices** — most use no synthetic pesticides or fertilisers. Coorg and Chikmagalur's high-altitude estates have naturally low pest pressure.\n\nFormal organic certification is a process we're pursuing with our farm partners. Currently, we can confirm:\n✅ No synthetic pesticides used at Devagiri Estate (Coorg Light Roast)\n✅ Traditional & shade-grown farming at all partner farms\n✅ No chemical processing aids in our roastery`,
            chips: ['Sustainability', 'Our story', 'Direct trade'],
        },

        // ── CONTACT
        {
            id: 'contact',
            patterns: [/contact|email|phone|call|reach|support|help|customer.*care|customer.*service/i],
            reply: `**Reach The Brew Haven** 📞\n\n📧 **Email**: hello@brewhaven.in\n📞 **Phone**: +91 98765 43210\n🕐 **Hours**: Mon–Sat · 9am–6pm IST\n\n**For specific queries**:\n• Wholesale → wholesale@brewhaven.in\n• Refunds/Returns → hello@brewhaven.in (include order number)\n• Press/Media → press@brewhaven.in\n\nWe typically reply within **24 hours** on business days. You can also use the [Contact form](contact.html) on our website.`,
            chips: ['Visit Contact page', 'Return policy', 'Shipping info'],
        },

        // ── THANK YOU
        {
            id: 'thanks',
            patterns: [/thank|thanks|thank you|great|amazing|awesome|love|helpful|brilliant/i],
            reply: `That means everything to us! ☕ We're here whenever you need help.\n\nHappy brewing — and may every sip tell a story. 🌿`,
            chips: ['Shop all', 'Brewing guides', 'Ask another question'],
        },

        // ── FAREWELL
        {
            id: 'bye',
            patterns: [/bye|goodbye|see you|later|take care|ciao/i],
            reply: `Goodbye! ☕ Come back whenever you need coffee wisdom. The cup is always warm here at The Brew Haven. 🌿`,
            chips: ['Shop all', 'Come back anytime'],
        },

        // ── FALLBACK (must be last)
        {
            id: 'fallback',
            patterns: [/.+/],
            reply: `I appreciate your question! ☕ As The Brew Haven's coffee concierge, I can help with:\n\n• **Products** — our 8 coffees, prices, tasting notes\n• **Brewing** — detailed guides for every method\n• **Orders** — shipping, tracking, returns, payment\n• **Company** — our story, sustainability, direct trade\n• **Recommendations** — finding the right coffee for you\n\nTry asking something like: *"Which coffee is best for espresso?"* or *"How long does shipping take?"*`,
            chips: ['View all products', 'Brewing guides', 'Shipping info', 'Recommend a coffee'],
        },
    ];

    function getResponse(input) {
        const lower = input.toLowerCase().trim();
        for (const r of KB) {
            for (const p of r.patterns) {
                if (p.test(lower)) return r;
            }
        }
        return KB[KB.length - 1];
    }

    // ─────────────────────────────────────────────────────────────
    //  UI
    // ─────────────────────────────────────────────────────────────
    let isOpen = false;
    let isTyping = false;

    function init() {
        if (document.getElementById('chatbotBtn')) return;

        const btn = document.createElement('button');
        btn.id = 'chatbotBtn';
        btn.className = 'chatbot-btn';
        btn.setAttribute('aria-label', 'Open chat with Brew');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span class="chatbot-badge" id="chatbotBadge">1</span>`;
        document.body.appendChild(btn);

        const win = document.createElement('div');
        win.id = 'chatbotWindow';
        win.className = 'chatbot-window';
        win.setAttribute('role', 'dialog');
        win.setAttribute('aria-label', 'Chat with Brew');
        win.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-avatar">☕</div>
        <div class="chatbot-header-info">
          <strong>Brew</strong>
          <span>Coffee Concierge · The Brew Haven</span>
        </div>
        <button class="chatbot-close" id="chatbotClose" aria-label="Close chat">✕</button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages" aria-live="polite"></div>
      <div class="chatbot-chips" id="chatbotChips"></div>
      <div class="chatbot-input-row">
        <input type="text" id="chatbotInput" class="chatbot-input" placeholder="Ask about our coffees, shipping, brewing…" autocomplete="off" maxlength="200" />
        <button id="chatbotSend" class="chatbot-send" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
        </button>
      </div>
    `;
        document.body.appendChild(win);

        btn.addEventListener('click', toggleChat);
        document.getElementById('chatbotClose').addEventListener('click', closeChat);
        document.getElementById('chatbotSend').addEventListener('click', handleSend);
        document.getElementById('chatbotInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Welcome after 3s
        setTimeout(() => {
            openChat();
            addBotMessage(
                `Hello! ☕ I'm **Brew**, The Brew Haven's coffee concierge.\n\nI know everything about our **coffees, brewing methods, pricing, shipping, returns, sustainability**, and more. Just ask!`,
                ['View all products', 'Recommend a coffee', 'Shipping info', 'How to brew']
            );
            document.getElementById('chatbotBadge').style.display = 'none';
        }, 3000);
    }

    function toggleChat() { isOpen ? closeChat() : openChat(); }

    function openChat() {
        isOpen = true;
        document.getElementById('chatbotWindow').classList.add('open');
        document.getElementById('chatbotBtn').classList.add('active');
        document.getElementById('chatbotBadge').style.display = 'none';
        setTimeout(() => { const i = document.getElementById('chatbotInput'); if (i) i.focus(); }, 350);
    }

    function closeChat() {
        isOpen = false;
        document.getElementById('chatbotWindow').classList.remove('open');
        document.getElementById('chatbotBtn').classList.remove('active');
    }

    function addUserMessage(text) {
        const msgs = document.getElementById('chatbotMessages');
        const el = document.createElement('div');
        el.className = 'chat-msg chat-msg--user';
        el.textContent = text;
        msgs.appendChild(el);
        scroll(msgs);
    }

    function addBotMessage(text, chips = []) {
        const msgs = document.getElementById('chatbotMessages');
        const typing = document.createElement('div');
        typing.className = 'chat-msg chat-msg--bot chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        msgs.appendChild(typing);
        scroll(msgs);

        const delay = 700 + Math.min(text.length * 1.2, 900);
        setTimeout(() => {
            typing.remove();
            const el = document.createElement('div');
            el.className = 'chat-msg chat-msg--bot';
            el.innerHTML = text
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
            msgs.appendChild(el);
            scroll(msgs);
            renderChips(chips);
        }, delay);
    }

    function renderChips(chips) {
        const c = document.getElementById('chatbotChips');
        if (!c) return;
        c.innerHTML = chips.map(ch => `<button class="chat-chip">${ch}</button>`).join('');
        c.querySelectorAll('.chat-chip').forEach(chip => {
            chip.addEventListener('click', () => processInput(chip.textContent));
        });
    }

    function handleSend() {
        const input = document.getElementById('chatbotInput');
        const text = (input.value || '').trim();
        if (!text || isTyping) return;
        input.value = '';
        processInput(text);
    }

    function processInput(text) {
        addUserMessage(text);
        document.getElementById('chatbotChips').innerHTML = '';
        isTyping = true;
        const r = getResponse(text);
        const reply = typeof r.reply === 'function' ? r.reply() : r.reply;
        addBotMessage(reply, r.chips || []);
        setTimeout(() => { isTyping = false; }, 1500);
    }

    function scroll(el) { setTimeout(() => { el.scrollTop = el.scrollHeight; }, 60); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { open: openChat, close: closeChat };
})();
