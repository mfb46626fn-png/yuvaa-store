-- Table to store ecommerce interaction events (views, add to cart, checkout start, etc.)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL, -- To track anonymous users across the session
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional, if logged in
    event_type TEXT NOT NULL, -- e.g., 'add_to_cart', 'begin_checkout'
    event_data JSONB DEFAULT '{}'::jsonb, -- e.g., cart items, total amount
    path TEXT, -- URL path where event occurred
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster analytics querying
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events(created_at);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anonymous users (and anyone) can insert events
CREATE POLICY "Anyone can insert an analytics event" 
    ON public.analytics_events FOR INSERT 
    WITH CHECK (true);

-- Only Admins can view analytics data
CREATE POLICY "Admins can view all analytics" 
    ON public.analytics_events FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
