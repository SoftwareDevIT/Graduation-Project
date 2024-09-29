<?php

namespace App\Services\Movie;

use App\Models\Movie;
use App\Models\Rating;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

/**
 * Class MovieService.
 */
class RatingService
{
    public function index() {}

    public function store(array $data)
    {

        if (!Auth::check()) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $user_id = Auth::id();
        $movie_id = $data['movie_id']; // Lấy giá trị movie_id từ mảng $data

        $existingRating = Rating::where('user_id',  $user_id)
            ->where('movie_id',  $movie_id)
            ->first();

        // if ($existingFavorite) {
        //     return response()->json(['message' => 'Movie already in rating'], 409);
        // }

        if ($existingRating) {
            // Nếu đánh giá đã tồn tại, ta sẽ chỉ cập nhật mà không tạo mới
            $existingRating->rating = $data['rating'];
            $existingRating->review = $data['review'];
            $existingRating->save();
    
            $message = 'Rating updated successfully';
        } else {
            // Nếu đánh giá chưa tồn tại, ta sẽ tạo mới
            $existingRating = Rating::create([
                'user_id'    => $user_id,
                'movie_id'   => $movie_id,
                'rating'     => $data['rating'],
                'review'     => $data['review'],
            ]);
            $message = 'Rating created successfully';
        }    

        // Tính toán lại đánh giá trung bình
        $averageRating = Rating::where('movie_id', $movie_id)->avg('rating');

        // Cập nhật đánh giá trung bình vào bảng movies
        $movie = Movie::find($movie_id);
        $movie->rating = $averageRating;
        $movie->save();

        return response()->json([
            'message' => $message,
            'rating'  => $existingRating
        ]);
    }

    public function update(int $id, array $data) {}

    public function delete(int $id)
    {
        $favorite = Rating::where('user_id', Auth::id())
            ->where('movie_id', $id)
            ->firstOrFail();
        return $favorite->delete();
    }

    public function show(int $id) {}
}
