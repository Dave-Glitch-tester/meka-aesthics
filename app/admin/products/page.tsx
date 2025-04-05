"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Plus, Search, Filter, Upload } from "lucide-react";
import PageLoading from "@/components/page-loading";

interface Product {
  _id: string;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  featured: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    productName: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "living-room",
    quantity: "",
    featured: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin, redirect if not
    if (!user) {
      router.push("/login?redirect=/admin/products");
      return;
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    fetchProducts();
  }, [user, isAdmin, router, toast]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      productName: "",
      description: "",
      price: "",
      imageUrl: "",
      category: "living-room",
      quantity: "",
      featured: false,
    });
    setIsEditing(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
      };

      const url = isEditing ? `/api/products/${formData._id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast({
          title: isEditing ? "Product Updated" : "Product Added",
          description: isEditing
            ? `${formData.productName} has been updated successfully`
            : `${formData.productName} has been added to your inventory`,
        });

        resetForm();
        setShowForm(false);
        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      _id: product._id,
      productName: product.productName,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
      quantity: product.quantity.toString(),
      featured: product.featured,
    });
    setIsEditing(true);
    setShowForm(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({
          title: "Product Deleted",
          description: `${name} has been removed from your inventory`,
        });

        fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // BACKEND INTEGRATION: This function would handle image uploads to your storage service
  // You would implement a proper API endpoint that connects to your storage service
  // (like AWS S3, Cloudinary, etc.) and returns the URL of the uploaded image
  const handleImageUpload = () => {
    // In a real implementation, this would open a file picker and upload the image
    toast({
      title: "Image Upload",
      description: "This feature would upload images to your storage service",
    });
  };

  const filteredProducts = products
    .filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (product) =>
        categoryFilter === "all" || product.category === categoryFilter
    );

  if (loading && !products.length) {
    return <PageLoading message="Loading products..." />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">
            Add, edit, and manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 shadow-md border-0">
          <CardContent className="pt-6">
            <form onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="living-room">Living Room</SelectItem>
                        <SelectItem value="bedroom">Bedroom</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="bathroom">Bathroom</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity in Stock</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="/placeholder.svg?height=400&width=400"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleImageUpload}
                        className="flex-shrink-0"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {/* BACKEND INTEGRATION: This would show a preview of the uploaded image */}
                      Enter a URL or upload an image (max 5MB, JPG or PNG)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        handleSwitchChange("featured", checked)
                      }
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {isEditing ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="living-room">Living Room</SelectItem>
              <SelectItem value="bedroom">Bedroom</SelectItem>
              <SelectItem value="kitchen">Kitchen</SelectItem>
              <SelectItem value="bathroom">Bathroom</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No products found. Try adjusting your search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden shadow-md border-0 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={
                    product.imageUrl || "/placeholder.svg?height=400&width=400"
                  }
                  alt={product.productName}
                  fill
                  className="object-cover"
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.productName}
                  </h3>
                  <span className="font-bold text-blue-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Stock:{" "}
                    <span
                      className={
                        product.quantity < 5 ? "text-red-500 font-medium" : ""
                      }
                    >
                      {product.quantity}
                    </span>
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() =>
                        handleDeleteProduct(product._id, product.productName)
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
