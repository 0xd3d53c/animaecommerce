
import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import CheckoutForm from '@/components/checkout/checkout-form';
import CheckoutSummary from '@/components/checkout/checkout-summary';
import { getCartItems } from '@/lib/cart-server';
import { createServerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Checkout | Anima',
  description: 'Complete your purchase and check out your order.',
};

export default async function CheckoutPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=checkout');
  }

  const { data: cartItems, error } = await getCartItems();

  if (error || !cartItems || cartItems.length === 0) {
    // Redirect to cart page if there are no items
    redirect('/cart');
  }

  return (
    <main className="container grid gap-12 py-10 md:grid-cols-[1fr,500px] lg:grid-cols-[1fr,600px] xl:gap-16">
      <div className="flex-1">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>
        <Suspense fallback={<div>Loading form...</div>}>
          <CheckoutForm />
        </Suspense>
      </div>

      <div className="md:order-last md:flex-shrink-0">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Order Summary</h2>
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <ScrollArea className="h-[400px]">
              <Suspense fallback={<div>Loading summary...</div>}>
                <CheckoutSummary items={cartItems} />
              </Suspense>
            </ScrollArea>
            <Separator className="my-6" />
            <div className="flex items-center justify-between font-bold">
              <span>Total</span>
              <span>
                {/* This will be updated to calculate total with new shipping costs */}
                ₹{cartItems.reduce((acc, item) => acc + item.products.price * item.quantity, 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
