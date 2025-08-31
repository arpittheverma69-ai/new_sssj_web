"use client"
import { useState, useEffect } from 'react'

interface ShopProfile {
    shopName: string
    gstin: string
    address: string
    city: string
    state: string
    stateCode: string
    vatTin: string
    panNumber: string
    bankName: string
    branchIfsc: string
}

const defaultProfile: ShopProfile = {
    shopName: 'J.V. Jewellers',
    gstin: '',
    address: '',
    city: '',
    state: '',
    stateCode: '',
    vatTin: '',
    panNumber: '',
    bankName: '',
    branchIfsc: ''
}

export const useShopProfile = () => {
    const [shopProfile, setShopProfile] = useState<ShopProfile>(defaultProfile)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchShopProfile = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/setting/shopprofile')
            
            if (!response.ok) {
                // If no profile exists, use default
                if (response.status === 404) {
                    setShopProfile(defaultProfile)
                    return
                }
                throw new Error('Failed to fetch shop profile')
            }
            
            const data = await response.json()
            setShopProfile(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            setShopProfile(defaultProfile) // Fallback to default
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchShopProfile()
    }, [])

    return {
        shopProfile,
        loading,
        error,
        refetch: fetchShopProfile
    }
}
