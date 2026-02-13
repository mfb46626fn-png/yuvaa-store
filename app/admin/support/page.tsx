"use client";

import { TicketList } from "@/components/support/TicketList";
import { Separator } from "@/components/ui/separator";

export default function AdminSupportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Destek Talepleri</h2>
                <p className="text-muted-foreground">
                    Müşteri destek taleplerini buradan yönetebilirsiniz.
                </p>
            </div>
            <Separator />
            <TicketList isAdmin={true} />
        </div>
    );
}
