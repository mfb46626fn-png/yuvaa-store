-- Migration to add Product Reviews Table
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[] DEFAULT '{}',
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for public access (Read only approved reviews)
CREATE POLICY "Approved reviews are viewable by everyone." 
    ON public.product_reviews FOR SELECT 
    USING (is_approved = true);

-- Policies for insertion (Anyone can insert a review)
CREATE POLICY "Anyone can insert a review." 
    ON public.product_reviews FOR INSERT 
    WITH CHECK (true);

-- Admin policies (Admins can do anything)
CREATE POLICY "Admins can manage all reviews." 
    ON public.product_reviews FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Create a storage bucket for review images if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'reviews' bucket
CREATE POLICY "Public reviews images are viewable by everyone"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'reviews');

CREATE POLICY "Anyone can upload review images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'reviews');

CREATE POLICY "Users can update their own review images / Admins everything"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'reviews' AND (auth.uid() = owner OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )));

CREATE POLICY "Users can delete their own review images / Admins everything"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'reviews' AND (auth.uid() = owner OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )));
