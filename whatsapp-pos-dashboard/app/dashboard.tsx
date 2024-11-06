
'use client'

import { useState } from 'react'
import { Bell, Menu, MessageSquare, ShoppingCart, Send, User, Settings, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

// Mock data for WhatsApp messages
const mockMessages = [
  { id: 1, sender: '+1234567890', message: 'Hello, Id like to place an order', timestamp: '2023-04-10 10:30:00' },
  { id: 2, sender: '+9876543210', message: 'Whats your current promotion?', timestamp: '2023-04-10 11:15:00' },
  { id: 3, sender: '+1122334455', message: 'Is item X still in stock?', timestamp: '2023-04-10 12:00:00' },
]

// Mock data for orders
const mockOrders = [
  { id: 1, customer: 'John Doe', items: ['Pizza', 'Coke'], total: 15.99, status: 'Completed', initiatedBy: 'Sarah (Staff)', date: '2023-04-10' },
  { id: 2, customer: 'Jane Smith', items: ['Burger', 'Fries', 'Shake'], total: 22.50, status: 'In Progress', initiatedBy: 'Mike (Staff)', date: '2023-04-11' },
  { id: 3, customer: 'Bob Johnson', items: ['Salad', 'Water'], total: 8.99, status: 'Pending', initiatedBy: 'Lisa (Staff)', date: '2023-04-12' },
  { id: 4, customer: 'Alice Brown', items: ['Pasta', 'Garlic Bread'], total: 18.50, status: 'Completed', initiatedBy: 'John (Manager)', date: '2023-04-13' },
  { id: 5, customer: 'Charlie Wilson', items: ['Steak', 'Mashed Potatoes'], total: 32.99, status: 'Pending', initiatedBy: 'Emma (Staff)', date: '2023-04-14' },
]

export default function Dashboard() {
  const [view, setView] = useState('whatsapp')
  const [messages, setMessages] = useState(mockMessages)
  const [orders, setOrders] = useState(mockOrders)
  const [newOrder, setNewOrder] = useState({ customer: '', items: '', total: '' })
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')

  const handleAddOrder = () => {
    if (newOrder.customer && newOrder.items && newOrder.total) {
      const order = {
        id: orders.length + 1,
        customer: newOrder.customer,
        items: newOrder.items.split(','),
        total: parseFloat(newOrder.total),
        status: 'Pending',
        initiatedBy: 'Current User (Staff)', // This would be dynamic in a real app
        date: new Date().toISOString().split('T')[0]
      }
      setOrders([...orders, order])
      setNewOrder({ customer: '', items: '', total: '' })
    }
  }

  const handleReply = () => {
    if (selectedMessage !== null && replyText.trim() !== '') {
      console.log(`Replying to ${selectedMessage} with: ${replyText}`)
      
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        message: replyText,
        timestamp: new Date().toLocaleString(),
      }
      setMessages([...messages, newMessage])
      setReplyText('')
      setSelectedMessage(null)
    }
  }

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const completedOrders = filteredOrders.filter(order => order.status === 'Completed')
  const pendingOrders = filteredOrders.filter(order => order.status === 'Pending')

  const getFilteredCompletedOrders = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)

    switch (orderFilter) {
      case 'daily':
        return completedOrders.filter(order => new Date(order.date).toDateString() === today.toDateString())
      case 'monthly':
        return completedOrders.filter(order => new Date(order.date) >= thirtyDaysAgo)
      case 'quarterly':
        return completedOrders.filter(order => new Date(order.date) >= ninetyDaysAgo)
      default:
        return completedOrders
    }
  }

  const filteredCompletedOrders = getFilteredCompletedOrders()

  const renderContent = () => {
    switch (view) {
      case 'whatsapp':
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Messages</CardTitle>
                <CardDescription>Recent messages from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Sender</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead className="hidden md:table-cell">Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell className="font-medium">{msg.sender}</TableCell>
                        <TableCell>{msg.message}</TableCell>
                        <TableCell className="hidden md:table-cell">{msg.timestamp}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMessage(msg.id)}
                          >
                            Reply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Reply to Message</CardTitle>
                <CardDescription>
                  {selectedMessage 
                    ? `Replying to message #${selectedMessage}` 
                    : 'Select a message to reply'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={selectedMessage === null}
                  />
                  <Button 
                    onClick={handleReply} 
                    disabled={selectedMessage === null || replyText.trim() === ''}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'pos':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mr-2"
                />
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{filteredOrders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{filteredCompletedOrders.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{pendingOrders.length}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="new">
              <TabsList>
                <TabsTrigger value="new">New Order</TabsTrigger>
                <TabsTrigger value="pending">Pending Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="new">
                <Card>
                  <CardHeader>
                    <CardTitle>New Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="customer">Customer Name</Label>
                          <Input 
                            id="customer" 
                            value={newOrder.customer}
                            onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="items">Items (comma-separated)</Label>
                          <Input 
                            id="items" 
                            value={newOrder.items}
                            onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="total">Total</Label>
                          <Input 
                            id="total" 
                            type="number" 
                            value={newOrder.total}
                            onChange={(e) => setNewOrder({...newOrder, total: e.target.value})}
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleAddOrder}>Add Order</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="pending">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Initiated By</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items.join(', ')}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>{order.initiatedBy}</TableCell>
                            <TableCell>
                              <Select defaultValue={order.status}>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="completed">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Initiated By</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCompletedOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.items.join(', ')}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell>{order.initiatedBy}</TableCell>
                            <TableCell>{order.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email Notifications</span>
                    <Switch id="email-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Push Notifications</span>
                    <Switch id="push-notifications" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="mt-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Language</h3>
                <div className="mt-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 'login':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground">
        <div className="flex-1 p-4 w-full">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <nav className="space-y-2">
            <Button 
              variant={view === 'whatsapp' ? 'secondary' : 'ghost'} 
              className="w-full justify-start text-primary-foreground"
              onClick={() => setView('whatsapp')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              WhatsApp Messages
            </Button>
            <Button 
              variant={view === 'pos' ? 'secondary' : 'ghost'} 
              className="w-full justify-start text-primary-foreground"
              onClick={() => setView('pos')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              POS System
            </Button>
            <Button 
              variant={view === 'settings' ? 'secondary' : 'ghost'} 
              className="w-full justify-start text-primary-foreground"
              onClick={() => setView('settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
        <div className="p-4">
          <Button 
            variant={view === 'login' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground"
            onClick={() => setView('login')}
          >
            <User className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Navigate through your dashboard
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <Button 
                    variant={view === 'whatsapp' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setView('whatsapp')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp Messages
                  </Button>
                  <Button 
                    variant={view === 'pos' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setView('pos')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    POS System
                  </Button>
                  <Button 
                    variant={view === 'settings' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setView('settings')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant={view === 'login' ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => {
                      setView('login')
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="md:hidden font-semibold">
              {view === 'whatsapp' ? 'WhatsApp' : view === 'pos' ? 'POS' : view === 'settings' ? 'Settings' : 'Login'}
            </div>
            <div className="flex items-center">
              <Bell className="h-6 w-6 mr-4" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setView('login')}
              >
                <User className="h-6 w-6" />
                <span className="sr-only">User menu</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}