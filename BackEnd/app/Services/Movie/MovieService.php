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
                'actor:actor_name,id',
                'director:director_name,id',
                'movie_category:category_name,id',
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
                'actor' =>  $movie->actor->map(function ($actor) {
                    return [
                        'id' => $actor->id,
                        'actor_name' => $actor->actor_name
                    ];
                }),
                'director' => $movie->director->map(function ($director) {
                    return [
                        'id' => $director->id,
                        'director_name' => $director->director_name
                    ];
                }),
                'movie_category' => $movie->movie_category->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'category_name' => $category->category_name
                    ];
                }),
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
        $movie = Movie::query()->findOrFail($id);
        $movie->update($data);

        return $movie;
    }

    public function delete(int $id)
    {
        $movie = Movie::query()->findOrFail($id);

        // $movieCategory->showtimes($id)->delete();    // Xóa suất chiếu phim

        return $movie->delete();
    }

    public function show($id)
    {
        $movie = Movie::with([
            'actor:actor_name,id',
            'director:director_name,id',
            'movie_category:category_name,id',
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
            'actor' =>  $movie->actor->map(function ($actor) {
                return [
                    'id' => $actor->id,
                    'actor_name' => $actor->actor_name
                ];
            }),
            'director' => $movie->director->map(function ($director) {
                return [
                    'id' => $director->id,
                    'director_name' => $director->director_name
                ];
            }),
            'movie_category' => $movie->movie_category->map(function ($category) {
                return [
                    'id' => $category->id,
                    'category_name' => $category->category_name
                ];
            }),
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
        return Movie::query()->with(['actorInMovies.actor', 'directorInMovie.director', 'movieCategoryInMovie.movieCategory'])->findOrFail($id);
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
