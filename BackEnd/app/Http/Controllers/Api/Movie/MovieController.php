<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreMovieRequest;
use App\Http\Requests\Movie\Update\UpdateMovieRequest;
use App\Models\Movie;
use App\Services\Movie\MovieService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    protected $movieService;
    public function __construct(MovieService $movieService)
    {
        $this->movieService = $movieService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $movie = $this->movieService->index();
        return $this->success($movie, 'success');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMovieRequest $request)
    {
        $movie = $this->movieService->store($request->validated());
        return $this->success($movie, 'success');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $movie = $this->movieService->show($id);
        return $this->success($movie, 'success');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMovieRequest $request, string $id)
    {
        $movie = $this->movieService->update($id, $request->validated());
        return $this->success($movie, 'success');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $movie = $this->movieService->delete($id);
        return $this->success('Xoá Thành Công', 'success');
    }

    public function search($movie_name)
    {
        try {
            $movie = $this->movieService->getMovieByMovieName($movie_name);

            if ($movie->isEmpty()) {
                return $this->notFound();
            }
            return $this->success($movie);
        } catch (ModelNotFoundException $e) {
            return $e->getMessage();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}
