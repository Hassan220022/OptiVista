import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowUpRight,
  CreditCard,
} from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/utils"

// Mock data
const mockBalance = {
  available: 3245.50,
  pending: 1250.00,
  lastPayout: 2500.00,
  lastPayoutDate: "2024-01-10T10:00:00Z",
}

const mockPayouts = [
  { id: "1", amount: 2500.00, status: "completed", method: "Bank Transfer", created_at: "2024-01-10T10:00:00Z" },
  { id: "2", amount: 1800.00, status: "completed", method: "Bank Transfer", created_at: "2023-12-25T10:00:00Z" },
  { id: "3", amount: 3200.00, status: "completed", method: "Bank Transfer", created_at: "2023-12-10T10:00:00Z" },
  { id: "4", amount: 2100.00, status: "completed", method: "Bank Transfer", created_at: "2023-11-25T10:00:00Z" },
]

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "default" },
  completed: { label: "Completed", variant: "success" },
  failed: { label: "Failed", variant: "secondary" },
}

export function Payouts() {
  return (
    <div className="flex flex-col">
      <Header title="Payouts" description="Manage your earnings and withdrawals" />

      <div className="p-6 space-y-6">
        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(mockBalance.available)}
              </div>
              <Button size="sm" className="mt-3">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                Withdraw
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Balance
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(mockBalance.pending)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available in 3-5 business days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Payout
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockBalance.lastPayout)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDateTime(mockBalance.lastPayoutDate)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Payout Method
              <Button variant="outline" size="sm">Change</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-muted-foreground">****4532 · Chase Bank</p>
              </div>
              <Badge variant="success" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => {
                const status = statusConfig[payout.status]
                return (
                  <TableRow key={payout.id}>
                    <TableCell className="text-sm">
                      {formatDateTime(payout.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payout.amount)}
                    </TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
