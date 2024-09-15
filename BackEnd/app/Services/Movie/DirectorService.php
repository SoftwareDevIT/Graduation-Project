<?php

namespace App\Services\Movie;

use App\Models\Director;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class MovieService.
 */
class DirectorService
{
    public function index(): Collection
    {
        return Director::all();
    }

    public function store(array $data): Director
    {
        return Director::create($data);
    }

    public function update(int $id, array $data): Director
    {
        $director = Director::query()->findOrFail($id);
        $director->update($data);

        return $director;
    }

    public function delete(int $id): ?bool
    {
        $director = Director::query()->findOrFail($id);
        return $director->delete();
    }

    public function get(int $id): Director
    {
        return Director::query()->findOrFail($id);
    }
}
