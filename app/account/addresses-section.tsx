"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Plus, Edit, Trash2, Home, Building, Check } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"

interface Address {
  id: string
  type: "home" | "office" | "other"
  name: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function AddressesSection() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    type: "home",
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    isDefault: false,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockAddresses = [
          {
            id: "addr1",
            type: "home",
            name: "John Doe",
            phone: "+234 123 456 7890",
            street: "123 Main Street",
            city: "Lagos",
            state: "Lagos",
            postalCode: "100001",
            country: "Nigeria",
            isDefault: true,
          },
          {
            id: "addr2",
            type: "office",
            name: "John Doe",
            phone: "+234 987 654 3210",
            street: "456 Business Avenue",
            city: "Abuja",
            state: "FCT",
            postalCode: "900001",
            country: "Nigeria",
            isDefault: false,
          },
        ] as Address[]

        setAddresses(mockAddresses)
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "Failed to load addresses",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [toast])

  const resetForm = () => {
    setFormData({
      type: "home",
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Nigeria",
      isDefault: false,
    })
    setCurrentAddress(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address)
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAddresses((prev) => prev.filter((address) => address.id !== id))

      toast({
        title: "Address Deleted",
        description: "Address has been removed successfully",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address.id === id,
        })),
      )

      toast({
        title: "Default Address Updated",
        description: "Your default address has been updated",
      })
    } catch (error) {
      console.error("Error setting default address:", error)
      toast({
        title: "Error",
        description: "Failed to update default address",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (currentAddress) {
        // Update existing address
        setAddresses((prev) =>
          prev.map((address) => {
            if (address.id === currentAddress.id) {
              return {
                ...address,
                ...formData,
              }
            }
            // If setting a new default, update other addresses
            if (formData.isDefault && address.isDefault) {
              return {
                ...address,
                isDefault: false,
              }
            }
            return address
          }),
        )

        toast({
          title: "Address Updated",
          description: "Your address has been updated successfully",
        })
      } else {
        // Add new address
        const newAddress: Address = {
          id: `addr${addresses.length + 1}`,
          ...(formData as any),
        }

        // If setting as default, update other addresses
        if (formData.isDefault) {
          setAddresses((prev) =>
            prev.map((address) => ({
              ...address,
              isDefault: false,
            })),
          )
        }

        setAddresses((prev) => [...prev, newAddress])

        toast({
          title: "Address Added",
          description: "Your new address has been added successfully",
        })
      }

      resetForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Addresses</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{currentAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Address Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" value={formData.state} onChange={handleInputChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                </div>

                <div className="md:col-span-2 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isDefault" className="font-normal">
                    Set as default address
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setIsAddDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size={16} className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">No addresses found</h3>
            <p className="text-blue-600 mb-6">Add your first address to make checkout easier</p>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                resetForm()
                setIsAddDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 relative ${
                  address.isDefault ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check className="h-3 w-3 mr-1" />
                    Default
                  </div>
                )}

                <div className="flex items-start mb-3">
                  <div
                    className={`p-2 rounded-full mr-3 ${
                      address.type === "home"
                        ? "bg-green-100 text-green-600"
                        : address.type === "office"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {address.type === "home" ? (
                      <Home className="h-5 w-5" />
                    ) : address.type === "office" ? (
                      <Building className="h-5 w-5" />
                    ) : (
                      <MapPin className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">
                      {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
                    </h3>
                    <p className="text-sm text-blue-600">{address.name}</p>
                  </div>
                </div>

                <div className="ml-10 space-y-1 text-sm text-blue-700">
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="mt-2">{address.phone}</p>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200"
                      onClick={() => handleSetDefaultAddress(address.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-600 border-amber-200"
                    onClick={() => handleEditAddress(address)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

