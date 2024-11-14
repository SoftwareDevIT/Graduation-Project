<?php

namespace App\Services\Cinema;

use App\Models\Room;
use App\Models\Seats;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class LocationService.
 */
class RoomService
{

    public function index(): Collection
    {

        return Room::all();
    }


    public function store(array $data): Room
    {
        return Room::create($data);
    }
    public function getRoomByCinema(int $cinemaId): Collection
    {
        return Room::where('cinema_id', $cinemaId)->get();
    }


    public function update(int $id, array $data): Room
    {
        $room = Room::findOrFail($id);

        // Lưu trữ giá trị volume cũ
        $oldVolume = $room->volume;

        // Cập nhật thông tin phòng
        $room->update($data);

        // Nếu volume thay đổi
        if (isset($data['volume']) && $data['volume'] !== $oldVolume) {
            $newVolume = (int) $data['volume'];
            $seatsPerRow = 15;

            // Tính số hàng mới cần thiết
            $numberOfRows = ceil($newVolume / $seatsPerRow);
            $existingSeats = Seats::where('room_id', $room->id)->get();

            // Xóa ghế nếu volume giảm
            if ($newVolume < $oldVolume) {
                $seatsToDelete = $existingSeats->slice($newVolume);
                foreach ($seatsToDelete as $seat) {
                    $seat->delete();
                }
            }

            // Thêm ghế nếu volume tăng
            if ($newVolume > $oldVolume) {
                $existingRows = $existingSeats->pluck('row')->unique();
                $existingSeatsCount = $existingSeats->count();

                // Thêm ghế cho hàng mới
                for ($rowIndex = 0; $rowIndex < $numberOfRows; $rowIndex++) {
                    $row = chr(65 + $rowIndex);
                    for ($seatNumber = 1; $seatNumber <= $seatsPerRow; $seatNumber++) {
                        $seatIndex = ($rowIndex * $seatsPerRow) + $seatNumber;
                        if ($seatIndex > $existingSeatsCount && $seatIndex <= $newVolume) {
                            Seats::create([
                                'room_id' => $room->id,
                                'row' => $row,
                                'number' => $seatNumber,
                            ]);
                        }
                    }
                }
            }
        }

        return $room;
    }



    public function delete(int $id): ?bool
    {
        $room = Room::findOrFail($id);
        return $room->delete();
    }

    public function get(int $id): Room
    {
        $room = Room::findOrFail($id);
        return $room;
    }

    // public function getShowtimesByMovieName(string $movie_name)
    // {
    //     // Tìm kiếm phim dựa trên tên phim
    //     $movie = Movie::where('movie_name', 'like', '%' . $movie_name . '%')->first();

    //     if (!$movie) {
    //         throw new ModelNotFoundException('Movie not found');
    //     }
    //     return $movie->showtimes;
    // }

}