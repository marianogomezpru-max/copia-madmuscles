import { useEffect } from 'react'
import Logo from '../components/Logo.jsx'

// Hosts Hotmart's post-purchase Downsell widget for Emoción y Dinero —
// same pattern as UpsellDominaTuDineroPage.jsx, hosted on our own domain
// instead of a paid Hotmart Pages page.
export default function DownsellEmocionYDineroPage() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js'
    script.async = true
    script.onload = () => {
      window.checkoutElements?.init('salesFunnel').mount('#hotmart-sales-funnel')
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Logo className="w-12 h-12 mb-6" />
      <div id="hotmart-sales-funnel" className="w-full max-w-lg" />
    </div>
  )
}
