<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('seats', function ($user) {
    return true; // Hoặc điều kiện xác thực nếu cần thiết
});

Broadcast::channel('seats-{roomId}', function ($user, $roomId) {
    // return $user != null && $user->hasRoomAccess($roomId); // Hoặc điều kiện của bạn
    return true;
});

