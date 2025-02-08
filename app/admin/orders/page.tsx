"use client"

import { client } from "@/lib/client"
import { useEffect, useState } from "react"
import { FaFilter, FaSearch } from "react-icons/fa"
import type React from "react"

const ThemedIcon = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => (
  <Icon className={className || ""} />
)

interface Order {
  _id: string
  customerName: string
  address: string
  orderId: string
  city: string
  postalCode: string
  country: string
  cardNumber: string
  totalPrice: number
  items: Array<{
    _ref: string
    _type: string
  }>
  status: "Pending" | "Processing" | "Shipped" | "Delivered"
  createdAt: string
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [suggestions, setSuggestions] = useState<Order[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"] {
          _id,
          customerName,
          address,
          orderId,
          city,
          postalCode,
          country,
          cardNumber,
          totalPrice,
          items,
          status,
          createdAt
        }`
        const data = await client.fetch(query)
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const delayDebounceFn = setTimeout(() => {
      const filtered = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, orders])

  const handleSuggestionClick = (order: Order) => {
    setSearchTerm(order.orderId || order.customerName)
    setShowSuggestions(false)
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (sortBy === "totalPrice") {
      return b.totalPrice - a.totalPrice
    } else if (sortBy === "orderId") {
      return a.orderId.localeCompare(b.orderId)
    } else if (sortBy === "customerName") {
      return a.customerName.localeCompare(b.customerName)
    }
    return 0
  })

  const filteredOrders = sortedOrders.filter(
    (order) =>
      (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent mb-2 pt-14">
            Order Management
            <span className="ml-2 md:ml-4 text-2xl">📦</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all customer orders</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <ThemedIcon
              icon={FaSearch}
              className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((order) => (
                  <div
                    key={order._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handleSuggestionClick(order)}
                  >
                    <p className="text-gray-700 font-medium">
                      {order.orderId.split(new RegExp(`(${searchTerm})`, "i")).map((part, index) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <span key={index} className="text-blue-500">
                            {part}
                          </span>
                        ) : (
                          <span key={index}>{part}</span>
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <select
              className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm md:text-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            <ThemedIcon
              icon={FaFilter}
              className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
            />
          </div>

          <select
            className="w-full px-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Sort by Date</option>
            <option value="totalPrice">Sort by Total Price</option>
            <option value="orderId">Sort by Order ID</option>
            <option value="customerName">Sort by Customer Name</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-xl md:rounded-2xl bg-white/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Loading Orders...</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Please wait while we fetch your data</p>
          </div>
        ) : (
          <div className="bg-white/90 rounded-xl md:rounded-2xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="w-full min-w-[800px] md:min-w-0">
              <thead className="bg-gradient-to-r from-blue-800 to-purple-800 text-white">
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Address",
                    "Total Price",
                    "Items",
                    "Status",
                    "Created At",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base font-medium text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">{order.customerName}</td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">
                      {`${order.address}, ${order.city}, ${order.postalCode}, ${order.country}`}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 font-semibold text-sm md:text-base">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-center text-sm md:text-base">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Shipped"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4">
                      <button className="text-blue-500 hover:text-blue-700">View</button>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 md:py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-lg md:text-xl font-medium">No orders found</p>
                        <p className="mt-1 text-xs md:text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
