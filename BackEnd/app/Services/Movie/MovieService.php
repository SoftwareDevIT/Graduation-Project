<?php

namespace App\Services\Movie;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class MovieService.
 */
class MovieService
{
    public function index()
    {
        return Movie::with('showtimes')->get();
    }

    public function store(array $data)
    {
        return Movie::create($data);
    }

    public function update(int $id, array $data)
    {
        $movieCategory = Movie::query()->findOrFail($id);
        $movieCategory->update($data);

        return $movieCategory;
    }

    public function delete(int $id)
    {
        $movieCategory = Movie::query()->findOrFail($id);
        return $movieCategory->delete();
    }

    public function show(int $id)
    {
        return Movie::query()->findOrFail($id);
    }

    public function getMovieByMovieName(string $movie_name)
    {
        // Tìm kiếm phim dựa trên tên phim
        $movie = Movie::where('movie_name', 'like', '%' . $movie_name . '%')->get();

        if (!$movie) {
            throw new ModelNotFoundException('Movie not found');
        }
        return $movie;
    }
}
