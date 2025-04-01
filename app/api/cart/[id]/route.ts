import { NextResponse } from "next/server";

// Mock cart data (same as in route.ts)
const cartItems = [
  {
    id: "1",
    productId: "1",
    product: {
      id: "1",
      name: "Azure Ceramic Vase",
      price: 49.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      quantity: 15,
    },
    quantity: 1,
  },
  {
    id: "2",
    productId: "3",
    product: {
      id: "3",
      name: "Navy Blue Table Lamp",
      price: 79.99,
      imageUrl: "/placeholder.svg?height=400&width=400",
      quantity: 10,
    },
    quantity: 2,
  },
];

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id;
//     const itemIndex = cartItems.findIndex((item) => item.id === id);

//     if (itemIndex === -1) {
//       return NextResponse.json(
//         { message: "Cart item not found" },
//         { status: 404 }
//       );
//     }

//     const data = await request.json();

//     if (data.quantity !== undefined) {
//       // Ensure quantity is valid
//       if (data.quantity <= 0) {
//         return NextResponse.json(
//           { message: "Quantity must be greater than 0" },
//           { status: 400 }
//         );
//       }

//       // Check if quantity exceeds available stock
//       if (data.quantity > cartItems[itemIndex].product.quantity) {
//         data.quantity = cartItems[itemIndex].product.quantity;
//       }

//       cartItems[itemIndex].quantity = data.quantity;
//     }

//     return NextResponse.json(cartItems[itemIndex]);
//   } catch (error) {
//     console.error("Error updating cart item:", error);
//     return NextResponse.json(
//       { message: "Failed to update cart item" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const id = params.id
//   const itemIndex = cartItems.findIndex((item) => item.id === id)

//   if (itemIndex === -1) {
//     return NextResponse.json({ message: "Cart item not found" }, { status: 404 })
//   }

//   // Remove item from cart
//   const removedItem = cartItems.splice(itemIndex, 1)[0]

//   return NextResponse.json(removedItem)
// }
