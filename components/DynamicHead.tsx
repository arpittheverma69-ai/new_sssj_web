"use client"
import { useEffect } from 'react'
import { useShopProfile } from '@/contexts/ShopProfileContext'

export const DynamicHead = () => {
    const { shopProfile, loading } = useShopProfile()

    useEffect(() => {
        if (!loading && shopProfile.shopName) {
            // Update document title
            document.title = `${shopProfile.shopName} - GST Invoice Generator`
            
            // Update meta description
            const metaDescription = document.querySelector('meta[name="description"]')
            if (metaDescription) {
                metaDescription.setAttribute('content', `Professional GST invoice generator for ${shopProfile.shopName}`)
            }
        }
    }, [shopProfile, loading])

    return null // This component doesn't render anything
}
