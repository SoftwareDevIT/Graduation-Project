<?php

namespace App\Http\Controllers\Api\SeatMap;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store\StoreSeatMapRequest;
use App\Http\Requests\Update\UpdateSeatMapRequest;
use App\Models\SeatLayout;
use App\Models\SeatMap;
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
    public function status(int $id)
    {
        $movie = SeatMap::findOrFail($id);
        $movie->status = $movie->status == 1 ? 0 : 1;
        $movie->save();
        return $this->success('', 'Cập nhật trạng thái thành công.', 200);
    }


    public function store(StoreSeatMapRequest $request)
    {
        $seatDataArray = $request->validated(); // Dữ liệu đã được xác thực từ request
        $storedSeats = []; // Mảng để lưu kết quả đã lưu

        foreach ($seatDataArray as $seatData) {
            $storedSeats[] = $this->seatMapService->store($seatData); // Lưu từng đối tượng và thêm vào mảng
        }

        return $this->success($storedSeats); // Trả về tất cả các dữ liệu đã lưu
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
