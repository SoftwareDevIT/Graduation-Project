<?php

namespace App\Services\Movie;

use App\Models\MovieCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class MovieService.
 */
class MovieCategoryService
{
    public function index(): Collection
    {
        return MovieCategory::all();
    }

    public function store(array $data): MovieCategory
    {
        return MovieCategory::create($data);
    }

    public function update(int $id, array $data): MovieCategory
    {
        $movieCategory = MovieCategory::query()->findOrFail($id);
        $movieCategory->update($data);

        return $movieCategory;
    }

    public function delete(int $id): ?bool
    {
        $movieCategory = MovieCategory::query()->findOrFail($id);
        return $movieCategory->delete();
    }

    public function get(int $id): MovieCategory
    {
        return MovieCategory::query()->findOrFail($id);
    }
}
