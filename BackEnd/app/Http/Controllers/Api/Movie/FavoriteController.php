<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreFavoriteRequest;
use App\Models\Favorite;
use App\Services\Movie\FavoriteService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $favoriteService;

    public function __construct(FavoriteService $favoriteService)
    {
        $this->favoriteService = $favoriteService;
    }

    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFavoriteRequest $request)
    {
        try {
            $favorite = $this->favoriteService->store($request->validated());
    
            return $this->success($favorite, 'Thêm thành công');
        } catch (Exception $e) {
            return $this->error('Có lỗi xảy ra: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $this->favoriteService->delete($id);
            return $this->success(null,'Xóa thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Movie not found id = ' . $id, 404);
            }

            return $this->error('Movie not found id = ' . $id, 500);
        }
    }
}
