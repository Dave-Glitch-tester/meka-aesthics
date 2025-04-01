"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Plus } from "lucide-react"

export default function PaymentMethodsSection() {
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const { toast } = useToast()

  const handleAddPayment = () => {
    setIsAddingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsAddingPayment(false)
      toast({
        title: "Feature Coming Soon",
        description: "Payment method management will be available in a future update",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No payment methods saved</h3>
          <p className="text-blue-600 mb-6">Add a payment method for faster checkout</p>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddPayment} disabled={isAddingPayment}>
            <Plus className="mr-2 h-4 w-4" />
            {isAddingPayment ? "Processing..." : "Add Payment Method"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

