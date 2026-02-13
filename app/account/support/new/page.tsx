"use client";

import { CreateTicketForm } from "@/components/support/CreateTicketForm";
import { Separator } from "@/components/ui/separator";

export default function NewTicketPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Yeni Destek Talebi</h2>
                <p className="text-muted-foreground">
                    Sorununuzu bize bildirin, en kısa sürede yardımcı olalım.
                </p>
            </div>
            <Separator />
            <CreateTicketForm />
        </div>
    );
}
