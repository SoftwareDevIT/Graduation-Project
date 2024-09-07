<?php

namespace App\Services\Movie;

use App\Models\Actor;
use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class MovieService.
 */
class ActorService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.imgur.com/3/',
            'timeout' => 0,
            'allow_redirects' => false,
            'headers' => [
                'Authorization' => 'Client-ID ' . env('IMGUR_CLIENT_ID'),
            ],
        ]);
    }

    public function index(): Collection
    {
        return Actor::all();
    }

    public function store(array $data): Actor
    {
        return Actor::create($data);
    }

    public function update(int $id, array $data): Actor
    {
        $actor = Actor::query()->findOrFail($id);
        $actor->update($data);

        return $actor;
    }

    public function delete(int $id): ?bool
    {
        $actor = Actor::query()->findOrFail($id);
        return $actor->delete();
    }

    public function get(int $id): Actor
    {
        return Actor::query()->findOrFail($id);
    }

    public function uploadImage($filePath)
    {
        try {
            $response = $this->client->request('POST', 'image', [
                'multipart' => [
                    [
                        'name'     => 'image',
                        'contents' => fopen($filePath, 'r'),
                    ],
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['success']) && $data['success']) {
                return $data['data']['link'];
            } else {
                throw new Exception('Upload ảnh thất bại');
            }
        } catch (Exception $e) {
            throw new Exception('Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

}
