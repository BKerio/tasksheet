-- Create tourism_sites table
CREATE TABLE public.tourism_sites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    image_url TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tourism_sites ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view tourism sites)
CREATE POLICY "Anyone can view tourism sites" 
ON public.tourism_sites 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage sites (admin functionality)
CREATE POLICY "Authenticated users can insert tourism sites" 
ON public.tourism_sites 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tourism sites" 
ON public.tourism_sites 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete tourism sites" 
ON public.tourism_sites 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tourism_sites_updated_at
BEFORE UPDATE ON public.tourism_sites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for Nyandarua tourism sites
INSERT INTO public.tourism_sites (name, description, location, image_url, price, rating) VALUES
('Aberdare National Park', 'A stunning mountain range with dense forests, waterfalls, and diverse wildlife including elephants, buffaloes, and rare bongos.', 'Aberdare Ranges, Nyandarua', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', 2500.00, 4.8),
('Mount Kinangop', 'The highest peak in the Aberdare Range, offering breathtaking views and excellent hiking trails through moorland vegetation.', 'Kinangop, Nyandarua', 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800', 1500.00, 4.5),
('Karura Falls', 'A magnificent waterfall surrounded by indigenous forest, perfect for nature walks and photography.', 'South Kinangop, Nyandarua', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800', 800.00, 4.2),
('Dragon Teeth Caves', 'Ancient volcanic caves with fascinating geological formations, offering a unique adventure experience.', 'Ol Kalou, Nyandarua', 'https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=800', 1200.00, 4.0),
('Njabini Coffee Farm', 'Experience authentic Kenyan coffee from farm to cup with guided tours through scenic highland coffee plantations.', 'Njabini, Nyandarua', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', 600.00, 4.6);