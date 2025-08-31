"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

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

interface ShopProfileContextType {
    shopProfile: ShopProfile
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
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

const ShopProfileContext = createContext<ShopProfileContextType | undefined>(undefined)

export const useShopProfile = () => {
    const context = useContext(ShopProfileContext)
    if (context === undefined) {
        throw new Error('useShopProfile must be used within a ShopProfileProvider')
    }
    return context
}

interface ShopProfileProviderProps {
    children: ReactNode
}

export const ShopProfileProvider: React.FC<ShopProfileProviderProps> = ({ children }) => {
    const [shopProfile, setShopProfile] = useState<ShopProfile>(defaultProfile)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchShopProfile = async () => {
        try {
            setLoading(true)
            setError(null)
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

    const value: ShopProfileContextType = {
        shopProfile,
        loading,
        error,
        refetch: fetchShopProfile
    }

    return (
        <ShopProfileContext.Provider value={value}>
            {children}
        </ShopProfileContext.Provider>
    )
}
