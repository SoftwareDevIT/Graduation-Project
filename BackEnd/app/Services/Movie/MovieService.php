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
        $movies = Movie::with(['actor', 'director', 'movie_category', 'movieInCinemas'])->get();

        $formattedMovies = $movies->map(function ($movie) {
            return array_merge(
                $movie->toArray(),
                [
                    'actor' => $movie->actor->map(fn($actor) => $actor->only(['id', 'actor_name'])),
                    'director' => $movie->director->map(fn($director) => $director->only(['id', 'director_name'])),
                    'movie_category' => $movie->movie_category->map(fn($category) => $category->only(['id', 'category_name'])),
                    'movie_in_cinemas' => $movie->movieInCinemas->map(fn($cinema) => [
                        'id' => $cinema->id,
                        'cinema_name' => $cinema->cinema->cinema_name
                    ]),
                ]
            );
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

    public function show($identifier)
    {
        // Xác định xem identifier là ID hay slug
        $movie = Movie::with(['actor', 'director', 'movie_category', 'movieInCinemas'])
            ->when(is_numeric($identifier), function ($query) use ($identifier) {
                return $query->where('id', $identifier);
            }, function ($query) use ($identifier) {
                return $query->where('slug', $identifier);
            })
            ->firstOrFail();

        // Chuyển đổi thành mảng và định dạng lại dữ liệu
        $formattedMovie = $movie->toArray();
        $formattedMovie['actor'] = $movie->actor->map(fn($actor) => $actor->only(['id', 'actor_name']));
        $formattedMovie['director'] = $movie->director->map(fn($director) => $director->only(['id', 'director_name']));
        $formattedMovie['movie_category'] = $movie->movie_category->map(fn($category) => $category->only(['id', 'category_name']));
        $formattedMovie['movie_in_cinemas'] = $movie->movieInCinemas->map(fn($cinema) => [
            'id' => $cinema->id,
            'cinema_name' => $cinema->cinema->cinema_name,
        ]);

        return response()->json($formattedMovie);
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
