"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Mail, User, ShieldCheck, UserX } from "lucide-react"
import PageLoading from "@/components/page-loading"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  status: "active" | "inactive"
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { user, isAdmin } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin, redirect if not
    if (!user) {
      router.push("/login?redirect=/admin/users")
      return
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    fetchUsers()
  }, [user, isAdmin, router, toast])

  const fetchUsers = async () => {
    try {
      // In a real app, this would be an API call to fetch users
      // For demo purposes, we'll use mock data
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      const mockUsers: UserData[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          createdAt: "2023-01-15T10:30:00Z",
          status: "active",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          createdAt: "2023-02-20T14:45:00Z",
          status: "active",
        },
        {
          id: "admin1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: "2022-12-01T09:00:00Z",
          status: "active",
        },
        {
          id: "user1",
          name: "Regular User",
          email: "user@example.com",
          role: "user",
          createdAt: "2023-03-10T11:20:00Z",
          status: "active",
        },
        {
          id: "5",
          name: "Michael Johnson",
          email: "michael@example.com",
          role: "user",
          createdAt: "2023-04-05T16:15:00Z",
          status: "inactive",
        },
        {
          id: "6",
          name: "Sarah Williams",
          email: "sarah@example.com",
          role: "user",
          createdAt: "2023-05-12T13:40:00Z",
          status: "active",
        },
      ]

      setUsers(mockUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true)

      // In a real app, this would be an API call to update the user's role
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

      // Update the user's role in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "User Updated",
        description: `User role has been updated to ${newRole}`,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserStatus = async (userId: string, newStatus: "active" | "inactive") => {
    try {
      setLoading(true)

      // In a real app, this would be an API call to update the user's status
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API delay

      // Update the user's status in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

      toast({
        title: "User Updated",
        description: `User status has been updated to ${newStatus}`,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter)
    .filter((user) => statusFilter === "all" || user.status === statusFilter)

  if (loading && users.length === 0) {
    return <PageLoading message="Loading users..." />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">User Management</h1>
          <p className="text-gray-600">View and manage user accounts</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="w-full md:w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No users found. Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((userData) => (
            <Card key={userData.id} className="overflow-hidden shadow-md border-0">
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <CardTitle className="text-lg flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  {userData.name}
                  {userData.role === "admin" && <ShieldCheck className="h-4 w-4 ml-2 text-green-600" />}
                </CardTitle>
                <Badge
                  className={userData.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                >
                  {userData.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center mb-3">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm text-gray-600">{userData.email}</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">Joined: {formatDate(userData.createdAt)}</p>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Role:</span>
                    <Select
                      defaultValue={userData.role}
                      onValueChange={(value) => handleUpdateUserRole(userData.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Select
                      defaultValue={userData.status}
                      onValueChange={(value) => handleUpdateUserStatus(userData.id, value as "active" | "inactive")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() =>
                    handleUpdateUserStatus(userData.id, userData.status === "active" ? "inactive" : "active")
                  }
                >
                  <UserX className="h-4 w-4 mr-2" />
                  {userData.status === "active" ? "Deactivate User" : "Activate User"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

