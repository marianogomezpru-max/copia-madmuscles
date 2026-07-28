import { useEffect } from 'react'
import Logo from '../components/Logo.jsx'

// Hosts Hotmart's own post-purchase Upsell widget — the funnel stage
// created in Hotmart's "Embudo de Ventas" points here instead of a paid
// Hotmart Pages page, since the widget is just a <script> + mount point
// and works on any page we control.
export default function UpsellDominaTuDineroPage() {
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
