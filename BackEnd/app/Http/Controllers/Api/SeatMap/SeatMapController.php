<?php

namespace App\Http\Controllers\Api\SeatMap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreSeatMapRequest;
use App\Http\Requests\Update\UpdateSeatMapRequest;
use App\Models\SeatLayout;
use App\Services\SeatMap\SeatMapService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SeatMapController extends Controller
{
    protected $seatMapService;

    public function __construct(SeatMapService $seatMapService)
    {
        $this->seatMapService = $seatMapService;
    }

    public function index()
    {
        $combo = $this->seatMapService->index();
        return $this->success($combo);
    }
    public function show($id)
    {
        try {
            $combo = $this->seatMapService->get($id);
            return $this->success($combo);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }


    public function store(StoreSeatMapRequest $request)
    {
        $combo = $this->seatMapService->store($request->validated());
        return $this->success($combo);
    }

    public function update(UpdateSeatMapRequest $request, $id)
    {
        try {
            $combo = $this->seatMapService->update($id, $request->validated());
            return $this->success($combo);
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function destroy($id)
    {
        try {
            return $this->success($this->seatMapService->delete($id));
        } catch (ModelNotFoundException $e) {
            return $this->notFound("Không có id {$id} trong cơ sở dữ liệu");
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    public function publish($id)
    {
        try {
            // Kiểm tra id có tồn tại không
            $layout = SeatLayout::findOrFail($id);
            $layout->update(['status' => 'Xuất bản']);

            return response()->json(['message' => 'Seat layout published successfully!']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => "Không tìm thấy id {$id} trong cơ sở dữ liệu"], 404);
        } catch (Exception $e) {
            return response()->json(['error' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

}
