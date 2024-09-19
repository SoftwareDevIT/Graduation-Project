<?php

namespace App\Traits;

use Exception;
use GuzzleHttp\Client;
use Illuminate\Database\Eloquent\Collection;

trait UploadImageTrait
{

    protected $client;
    protected $apiKey;

    protected function initializeClient()
    {
        if (!$this->client) {
            $this->client = new Client();
        }

        if (!$this->apiKey) {
            $this->apiKey = env('IMGBB_API_KEY');
        }
    }
    public function uploadImage($filePath)
    {
        $this->initializeClient();
        $imagePath = $filePath->getPathname();
        $imageName = $filePath->getClientOriginalName();

        try {
            $response = $this->client->request('POST', 'https://api.imgbb.com/1/upload', [
                'query' => [
                    'key' => $this->apiKey,
                ],
                'multipart' => [
                    [
                        'name'     => 'image',
                        'contents' => fopen($imagePath, 'r'),
                        'filename' => $imageName,
                    ],
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['success']) && $data['success']) {
                return $data['data']['display_url'];
            } else {
                throw new Exception('Upload ảnh thất bại');
            }
        } catch (Exception $e) {
            throw new Exception('Có lỗi xảy ra: ' . $e->getMessage());
        }
    }
}
