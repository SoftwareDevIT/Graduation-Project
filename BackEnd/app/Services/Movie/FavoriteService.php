<?php

namespace App\Services\Movie;

use App\Models\Favorite;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class MovieService.
 */
class FavoriteService
{
    public function index(): Collection
    {
        return Favorite::all();
    }

    public function store($movie): Favorite
    {
        $existingFavorite = Favorite::where('user_id', Auth::id())
            ->where('movie_id', $movie)
            ->first();
    
        if ($existingFavorite) {
            throw new HttpException(409, 'Phim đã được yêu thích!');
        }
    
        return Favorite::create([
            'user_id' => Auth::id(),
            'movie_id' => $movie,
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
