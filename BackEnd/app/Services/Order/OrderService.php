<?php

namespace App\Services\Order;

use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

/**
 * Class LocationService.
 */
class OrderService
{
    public function index()
    {
        $order = Booking::with('showtime.movie','showtime.room','user','payMethod','seats','combos')->get();
        return $order;
    }

    public function show($id)
    {
        $order = Booking::with('showtime.movie','showtime.room','user','payMethod','seats','combos')->findOrFail($id);
        return $order;
    }

    public function destroy($id)
    {
        $order = Booking::find($id);
        $order->delete();
        return $order;
    }

    public function update(array $data,int $id)
    {
        $order = Booking::findOrFail($id);
        $order->update($data);
        return $order;
    }

    public function order(){
        $order = Booking::where('user_id',Auth::user()->id)->with('showtime.movie','showtime.room','user','payMethod','seats','combos')->get();
        return $order;
    }
}
