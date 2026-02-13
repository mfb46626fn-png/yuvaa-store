"use client";

import { TicketList } from "@/components/support/TicketList";
import { Separator } from "@/components/ui/separator";

export default function SupportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Destek Taleplerim</h2>
                <p className="text-muted-foreground">
                    Oluşturduğunuz destek taleplerini buradan takip edebilirsiniz.
                </p>
            </div>
            <Separator />
            <TicketList />
        </div>
    );
}
