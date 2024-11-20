<?php

namespace App\Services\Movie;

use App\Models\Actor;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Traits\AuthorizesInService;

/**
 * Class MovieService.
 */
class ActorService
{
    use AuthorizesInService;
    public function index(): Collection
    {
        return Actor::all();
    }

    public function store(array $data): Actor
    {
        $this->authorizeInService('create', Actor::class);
        return Actor::create($data);
    }

    public function update(int $id, array $data): Actor
    {
        $this->authorizeInService('update', Actor::class);
        $actor = Actor::query()->findOrFail($id);
        $actor->update($data);

        return $actor;
    }

    public function delete(int $id): ?bool
    {
        $this->authorizeInService('delete', Actor::class);
        $actor = Actor::query()->findOrFail($id);
        return $actor->delete();
    }

    public function get($identifier): Actor
    {
        $actor = Actor::query()
            ->when(is_numeric($identifier), function ($query) use ($identifier) {
                return $query->where('id', $identifier);
            }, function ($query) use ($identifier) {
                return $query->where('slug', $identifier);
            })
            ->firstOrFail();

        return $actor;
    }

}
