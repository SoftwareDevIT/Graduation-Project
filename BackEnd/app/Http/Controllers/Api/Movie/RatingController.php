<?php

namespace App\Http\Controllers\Api\Movie;

use App\Http\Controllers\Controller;
use App\Http\Requests\Movie\Store\StoreRatingRequest;
use App\Models\Rating;
use App\Services\Movie\RatingService;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class RatingController extends Controller
{

    protected $ratingService;

    public function __construct(RatingService $ratingService)
    {
        $this->ratingService = $ratingService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRatingRequest $request)
    {
        try {
            $rating = $this->ratingService->store($request->validated());
    
            return $this->success($rating, 'Đánh giá thành công');
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
            $this->ratingService->delete($id);
            return $this->success(null,'Xóa thành công');
        } catch (\Throwable $th) {
            if ($th instanceof ModelNotFoundException) {
                return $this->notFound('Movie not found id = ' . $id, 404);
            }

            return $this->error('Movie not found id = ' . $id, 500);
        }
    }
}
