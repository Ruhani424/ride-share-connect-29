import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's JWT
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const {
      from,
      to,
      date,
      time,
      seats,
      price,
      vehicleMake,
      vehicleModel,
      vehicleNumber,
      notes,
      noSmoking,
      musicOk,
      ac,
      petsOk,
      luggage,
    } = await req.json();

    // Validate required fields
    if (!from || !to || !date || !time || !seats || !price) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate seats
    const seatsNum = parseInt(seats);
    if (isNaN(seatsNum) || seatsNum < 1 || seatsNum > 6) {
      return new Response(
        JSON.stringify({ error: "Seats must be between 1 and 6" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return new Response(
        JSON.stringify({ error: "Price must be a positive number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Combine date and time into a timestamp
    const departureDateTime = new Date(`${date}T${time}`);
    
    // Check if the date is in the future
    if (departureDateTime <= new Date()) {
      return new Response(
        JSON.stringify({ error: "Departure time must be in the future" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert ride into database
    const { data: rideData, error: insertError } = await supabaseClient
      .from("rides")
      .insert({
        driver_id: user.id,
        from_location: from,
        to_location: to,
        departure_date: date,
        departure_time: time,
        available_seats: seatsNum,
        price_per_seat: priceNum,
        vehicle_make: vehicleMake || null,
        vehicle_model: vehicleModel || null,
        vehicle_number: vehicleNumber || null,
        notes: notes || null,
        no_smoking: noSmoking || false,
        music_ok: musicOk || false,
        ac: ac || false,
        pets_ok: petsOk || false,
        luggage: luggage || false,
        status: "active",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting ride:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create ride", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Ride created successfully",
        ride: rideData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in create-ride function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});