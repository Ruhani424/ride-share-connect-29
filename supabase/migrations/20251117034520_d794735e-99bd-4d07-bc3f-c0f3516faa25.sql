-- Create rides table for storing all ride information
CREATE TABLE public.rides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  passenger_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  fare DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  type TEXT NOT NULL DEFAULT 'offered' CHECK (type IN ('offered', 'booked')),
  vehicle_make TEXT,
  vehicle_model TEXT,
  vehicle_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Drivers can view their own offered rides
CREATE POLICY "Drivers can view own rides"
  ON public.rides
  FOR SELECT
  USING (auth.uid() = driver_id);

-- Passengers can view rides they've booked
CREATE POLICY "Passengers can view booked rides"
  ON public.rides
  FOR SELECT
  USING (auth.uid() = passenger_id);

-- Drivers can insert their own rides
CREATE POLICY "Drivers can create rides"
  ON public.rides
  FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

-- Drivers can update their own rides
CREATE POLICY "Drivers can update own rides"
  ON public.rides
  FOR UPDATE
  USING (auth.uid() = driver_id);

-- Passengers can update rides they've booked (to mark as completed, etc.)
CREATE POLICY "Passengers can update booked rides"
  ON public.rides
  FOR UPDATE
  USING (auth.uid() = passenger_id);

-- Add trigger for updated_at
CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON public.rides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_passenger_id ON public.rides(passenger_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_date ON public.rides(date);