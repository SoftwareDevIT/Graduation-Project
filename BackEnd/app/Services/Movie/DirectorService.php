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
        return Director::all();
    }

    public function store(array $data): Director
    {
        try {
            return Director::create($data);
        } catch (\Exception $e) {
            // Xử lý ngoại lệ, ví dụ: ghi log hoặc trả về thông báo lỗi
            throw new \Exception('An error occurred while creating the director.');
        }
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
