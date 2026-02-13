-- Create enum for ticket status
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    status ticket_status DEFAULT 'open' NOT NULL,
    priority ticket_priority DEFAULT 'medium' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES profiles(id) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_admin_reply BOOLEAN DEFAULT FALSE
);

-- RLS Policies for support_tickets
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" 
    ON support_tickets FOR SELECT 
    USING (auth.uid() = user_id);

-- Users can create tickets
CREATE POLICY "Users can create tickets" 
    ON support_tickets FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets" 
    ON support_tickets FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update tickets (status, priority)
CREATE POLICY "Admins can update tickets" 
    ON support_tickets FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for support_messages
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages for their tickets
CREATE POLICY "Users can view messages for their tickets" 
    ON support_messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM support_tickets 
            WHERE id = ticket_id AND user_id = auth.uid()
        )
    );

-- Users can insert messages to their tickets
CREATE POLICY "Users can insert messages to their tickets" 
    ON support_messages FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM support_tickets 
            WHERE id = ticket_id AND user_id = auth.uid()
        )
         AND auth.uid() = sender_id
    );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" 
    ON support_messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can reply (insert messages)
CREATE POLICY "Admins can reply" 
    ON support_messages FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Helper to update updated_at on ticket reply
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE support_tickets
    SET updated_at = NOW()
    WHERE id = NEW.ticket_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_timestamp_trigger
AFTER INSERT ON support_messages
FOR EACH ROW
EXECUTE FUNCTION update_ticket_timestamp();
