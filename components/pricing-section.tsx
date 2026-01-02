"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { StripeCheckoutButton } from "./stripe-checkout-button"
import { SUBSCRIPTION_PRICE_IDS, POINTS_PRODUCTS, POINTS_PRICE_IDS } from "@/lib/stripe"
import { DiscountPriceDisplay, RegularPriceDisplay } from "./discount-price-display"

export function PricingSection() {
  const locale = useLocale()
  const t = useTranslations("pricing")

  const plans = [
    {
      name: t("free.name"),
      price: t("free.price"),
      description: t("free.description"),
      features: [t("free.features.template"), t("free.features.auth"), t("free.features.support")],
      cta: t("free.cta"),
      popular: false,
      priceId: null,
      planType: 'free',
    },
    {
      name: t("pro.name"),
      price: t("pro.price"),
      originalPrice: t("pro.originalPrice"),
      discountPercent: t("pro.discountPercent"),
      savings: t("pro.savings"),
      discountBadge: t("pro.discountBadge"),
      description: t("pro.description"),
      features: [
        t("pro.features.template"),
        t("pro.features.payment"),
        t("pro.features.support"),
      ],
      cta: t("pro.cta"),
      popular: true,
      priceId: SUBSCRIPTION_PRICE_IDS.pro,
      planType: 'pro',
      hasDiscount: true,
    },
    {
      name: t("enterprise.name"),
      price: t("enterprise.price"),
      description: t("enterprise.description"),
      features: [
        t("enterprise.features.custom"),
        t("enterprise.features.deployment"),
        t("enterprise.features.support"),
        t("enterprise.features.training"),
      ],
      cta: t("enterprise.cta"),
      popular: false,
      priceId: null,
      planType: 'enterprise',
    },
  ]

  return (
    <section id="pricing" className="relative py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("title")}</h2>
        </div>

        {/* 订阅计划 */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center mb-8">{locale === 'zh' ? '订阅计划' : 'Subscription Plans'}</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular
                    ? plan.hasDiscount
                      ? "border-cyber-500 shadow-xl scale-105 bg-gradient-to-br from-dark-600 to-dark-600 cyber-glow"
                      : "border-cyber-500 shadow-lg scale-105 cyber-glow-subtle"
                    : "border-border bg-secondary/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground cyber-glow">
                    {t("recommended")}
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>

                  {/* 价格显示区域 */}
                  <div className="mb-4">
                    {plan.hasDiscount ? (
                      <DiscountPriceDisplay
                        originalPrice={plan.originalPrice}
                        discountedPrice={plan.price}
                        discountPercent={plan.discountPercent}
                        savings={plan.savings}
                        discountBadge={plan.discountBadge}
                      />
                    ) : (
                      <RegularPriceDisplay price={plan.price} />
                    )}
                  </div>

                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 根据计划类型显示不同的按钮 */}
                  {plan.planType === 'free' ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.location.href = '/auth/signup'}
                    >
                      {plan.cta}
                    </Button>
                  ) : plan.planType === 'enterprise' ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => window.location.href = 'mailto:support@itsai-agent.com'}
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <StripeCheckoutButton
                      priceId={plan.priceId}
                      planType={plan.planType}
                      className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 cyber-glow" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </StripeCheckoutButton>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 积分购买 */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">{locale === 'zh' ? '一次性购买积分' : 'One-time Points Purchase'}</h3>
          <p className="text-center text-muted-foreground mb-8">
            {locale === 'zh'
              ? '购买积分永不过期，按需使用灵活方便'
              : 'Purchase credits that never expire and use them on-demand'}
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Object.values(POINTS_PRODUCTS).map((product) => (
              <Card
                key={product.id}
                className={`relative ${
                  product.popular
                    ? "border-primary shadow-xl scale-105 cyber-glow"
                    : "border-border bg-secondary/50"
                }`}
              >
                {product.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground cyber-glow">
                    {locale === 'zh' ? '热门' : 'Popular'}
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">
                    {locale === 'zh' ? product.name : product.id === 'starter' ? 'Starter' : product.id === 'popular' ? 'Popular' : 'Premium'}
                  </CardTitle>
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-primary">${product.price}</span>
                      <span className="text-muted-foreground">{locale === 'zh' ? '一次性' : '/one-time'}</span>
                    </div>
                    <div className="text-lg font-semibold text-foreground mt-2">
                      {product.points.toLocaleString()} {locale === 'zh' ? '积分' : 'credits'}
                    </div>
                  </div>
                  <CardDescription>
                    {locale === 'zh' ? product.description : product.id === 'starter' ? 'Perfect for trying out' : product.id === 'popular' ? 'Most popular choice' : 'For heavy users'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm text-foreground">{locale === 'zh' ? '积分永不过期' : 'Credits never expire'}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm text-foreground">{locale === 'zh' ? '按需使用' : 'Use on-demand'}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm text-foreground">{locale === 'zh' ? '无订阅费用' : 'No subscription fees'}</span>
                    </li>
                  </ul>
                  <StripeCheckoutButton
                    priceId={product.priceId}
                    planType={product.id}
                    className={`w-full ${product.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 cyber-glow" : ""}`}
                    variant={product.popular ? "default" : "outline"}
                  >
                    {locale === 'zh' ? '立即购买' : 'Buy Now'}
                  </StripeCheckoutButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
