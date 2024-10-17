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
        $movies = Movie::with(
            [
                'actor:actor_name',
                'director:director_name',
                'category:category_name',
                'movieInCinemas.cinema:id,cinema_name'
            ]
        )->get();

        $formattedMovies = $movies->map(function ($movie) {
            return [
                'id' => $movie->id,
                'movie_name' => $movie->movie_name,
                'poster' => $movie->poster,
                'duration' => $movie->duration,
                'release_date' => $movie->release_date,
                'age_limit' => $movie->age_limit,
                'description' => $movie->description,
                'trailer' => $movie->trailer,
                'rating' => $movie->rating,
                'status' => $movie->status,
                'actor' =>  $movie->actor->pluck('actor_name'),
                'director' => $movie->director->pluck('director_name'),
                'category' => $movie->category->pluck('category_name'),
                'movie_in_cinemas' => $movie->movieInCinemas->map(function ($cinema) {
                    return [
                        'id' => $cinema->id,
                        'cinema_name' => $cinema->cinema->cinema_name  // Lấy tên rạp từ quan hệ
                    ];
                }),
            ];
        });

        return response()->json($formattedMovies);
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

        // $movieCategory->showtimes($id)->delete();    // Xóa suất chiếu phim

        return $movieCategory->delete();
    }

    public function show($id)
    {
        $movie = Movie::with([
            'actor:actor_name',
            'director:director_name',
            'category:category_name',
            'movieInCinemas.cinema:id,cinema_name'
        ])->findOrFail($id);

        $formattedMovies = [
            'id' => $movie->id,
            'movie_name' => $movie->movie_name,
            'poster' => $movie->poster,
            'duration' => $movie->duration,
            'release_date' => $movie->release_date,
            'age_limit' => $movie->age_limit,
            'description' => $movie->description,
            'trailer' => $movie->trailer,
            'rating' => $movie->rating,
            'status' => $movie->status,
            'actor' =>  $movie->actor->pluck('actor_name'),
            'director' => $movie->director->pluck('director_name'),
            'category' => $movie->category->pluck('category_name'),
            'movie_in_cinemas' => $movie->movieInCinemas->map(function ($cinema) {
                return [
                    'id' => $cinema->id,
                    'cinema_name' => $cinema->cinema->cinema_name  // Lấy tên rạp từ quan hệ
                ];
            }),
        ];

        return response()->json($formattedMovies);
    }

    public function get(int $id): Movie
    {
        return Movie::query()->with(['actorInMovies.actor', 'actorInMovies.director', 'actorInMovies.movieCategory'])->findOrFail($id);
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
