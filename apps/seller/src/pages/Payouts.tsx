import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Wallet, DollarSign, Clock, ArrowUpRight, CreditCard, Loader2 } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { useSellerPayouts, useSellerStats } from "@/hooks/useSupabaseData"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" }> = {
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "default" },
  completed: { label: "Completed", variant: "success" },
  failed: { label: "Failed", variant: "secondary" },
}

export function Payouts() {
  const { data: payouts = [], isLoading: payoutsLoading } = useSellerPayouts()
  const { data: stats, isLoading: statsLoading } = useSellerStats()

  if (payoutsLoading || statsLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Payouts" description="Manage your earnings and withdrawals" />
        <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    )
  }

  const completedPayouts = payouts.filter((payout) => payout.status === "completed")
  const paidOut = completedPayouts.reduce((sum, payout) => sum + payout.amount, 0)
  const pendingPayouts = payouts.filter((payout) => payout.status === "pending" || payout.status === "processing").reduce((sum, payout) => sum + payout.amount, 0)
  const available = Math.max((stats?.totalRevenue ?? 0) - paidOut - pendingPayouts, 0)
  const lastPayout = completedPayouts[0]

  return (
    <div className="flex flex-col">
      <Header title="Payouts" description="Manage your earnings and withdrawals" />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle><Wallet className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{formatCurrency(available)}</div><Button size="sm" className="mt-3" disabled><ArrowUpRight className="h-4 w-4 mr-1" />Withdraw</Button></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingPayouts)}</div><p className="text-xs text-muted-foreground mt-1">Pending or processing payouts</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Last Payout</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent><div className="text-2xl font-bold">{lastPayout ? formatCurrency(lastPayout.amount, lastPayout.currency) : "No payouts yet"}</div><p className="text-xs text-muted-foreground mt-1">{lastPayout ? formatDateTime(lastPayout.processed_at ?? lastPayout.created_at) : "Completed payouts will appear here"}</p></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Payout Method</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><CreditCard className="h-6 w-6 text-primary" /></div>
              <div><p className="font-medium">{payouts[0]?.payout_method ?? "Not configured"}</p><p className="text-sm text-muted-foreground">Payout method comes from seller_payouts records</p></div>
              <Badge variant={payouts[0]?.payout_method ? "success" : "secondary"} className="ml-auto">{payouts[0]?.payout_method ? "Configured" : "Missing"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No payouts found</TableCell></TableRow>
              ) : payouts.map((payout) => {
                const status = statusConfig[payout.status]
                return <TableRow key={payout.id}><TableCell className="text-sm">{formatDateTime(payout.created_at)}</TableCell><TableCell className="font-medium">{formatCurrency(payout.amount, payout.currency)}</TableCell><TableCell>{payout.payout_method ?? "Not set"}</TableCell><TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell></TableRow>
              })}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
