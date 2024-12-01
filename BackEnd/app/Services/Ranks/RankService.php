<?php

namespace App\Services\Ranks;


use App\Models\Rank;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class LocationService.
 */
class RankService
{
    use AuthorizesInService;

    public function index(): Collection
    {

        return Rank::orderByDesc('created_at')->get();
    }


    public function store(array $data): Rank
    {

        return Rank::create($data);
    }

    public function update(int $id, array $data): Rank
    {

        $method = Rank::findOrFail($id);
        $method->update($data);

        return $method;
    }


    public function delete(int $id): ?bool
    {

        $method = Rank::findOrFail($id);
        return $method->delete();
    }
    public function get(int $id): Rank
    {
        $method = Rank::findOrFail($id);
        return $method;
    }
}
