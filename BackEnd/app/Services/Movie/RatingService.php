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
    public function index() {
       return Rating::all();
    }
       
    public function store(array $data)
    {
        $existingRating = Rating::where('user_id',  Auth::id())
            ->where('movie_id',  $data['movie_id'])
            ->first();

        if ($existingRating) {
            // Nếu đánh giá đã tồn tại, ta sẽ chỉ cập nhật mà không tạo mới
            $existingRating->rating = $data['rating'];
            $existingRating->review = $data['review'];
            $existingRating->save();

            $message = 'Rating updated successfully';
        } else {
            // Nếu đánh giá chưa tồn tại, ta sẽ tạo mới
            $existingRating = Rating::create([
                'user_id'    => Auth::id(),
                'movie_id'   => $data['movie_id'],
                'rating'     => $data['rating'],
                'review'     => $data['review'],
            ]);
            $message = 'Rating created successfully';
        }

        $averageRating = Rating::where('movie_id', $data['movie_id'])->avg('rating');

        $movie = Movie::find($data['movie_id']);
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

    public function show(int $id) {
        $movie = Rating::where('movie_id', $id)->get();

        return $movie;
    }

    
}
