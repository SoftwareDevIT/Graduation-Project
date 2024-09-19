<?php

namespace App\Services\Movie;

use App\Models\Favorite;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

/**
 * Class MovieService.
 */
class FavoriteService
{
    public function index(): Collection
    {
        return Favorite::all();
    }

    public function store(array $data): Favorite
    {
        $movie_id = $data['movie_id']; // Lấy giá trị movie_id từ mảng $data

        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('movie_id', $movie_id)
            ->first();
    
        if ($existingFavorite) {
            return response()->json(['message' => 'Movie already in favorites'], 409);
        }
    
        return Favorite::create([
            'user_id' => Auth::id(),
            'movie_id' => $movie_id,
        ]);
    }

    public function delete(int $id): ?bool
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('movie_id', $id)
            ->firstOrFail();
        return $favorite->delete();
    }

    public function get(int $id): Favorite
    {
        return Favorite::query()->findOrFail($id);
    }
}
