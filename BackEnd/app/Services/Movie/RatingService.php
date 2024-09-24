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
        $movie_id = $data['movie_id']; // Lấy giá trị movie_id từ mảng $data

        $existingFavorite = Rating::where('user_id', operator: Auth::id())
            ->where('movie_id',  $movie_id)
            ->first();

        if ($existingFavorite) {
            return response()->json(['message' => 'Movie already in rating'], 409);
        }

        $rating =  Rating::create([
            'user_id' => Auth::id(),
            'movie_id' => $movie_id,
            'rating' => $data['rating'],
            'review' => $data['review'],
        ]);

        // Tính toán lại đánh giá trung bình
        $averageRating = Rating::where('movie_id', $movie_id)->avg('rating');

        // Cập nhật đánh giá trung bình vào bảng movies
        $movie = Movie::find($movie_id);
        $movie->rating = $averageRating;
        $movie->save();

        return $rating;
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
