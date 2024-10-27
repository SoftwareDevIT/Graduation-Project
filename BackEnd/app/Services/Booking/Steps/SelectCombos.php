<?php

namespace App\Services\Booking\Steps;

use App\Models\Combo;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class SelectCombos extends AbstractBookingStep
{

    protected function process(Request $request): ?JsonResponse
    {
        $comboData = $request->input('comboId'); // Lấy toàn bộ dữ liệu comboId từ request

        // Kiểm tra nếu comboData là một mảng
        if (!is_array($comboData)) {
            return null; // Trả về mảng rỗng nếu không có comboId
        }

        $combos = [];
        foreach ($comboData as $combo) {
            // Kiểm tra xem combo có phải là một mảng và có key 'id'
            if (isset($combo['id'])) {
                // Lấy combo theo id
                $comboModel = Combo::find($combo['id']);
                if ($comboModel) {
                    // Gắn quantity cho từng combo
                    $comboModel->quantity = $combo['quantity'] ?? 1; // Mặc định là 1 nếu không có quantity
                    $combos[] = $comboModel;
                }
            }
        }

        if (!empty($combos)) {
            // Lưu thông tin combos và số lượng vào session
            Session::put('combos', $combos);
            Log::info('Combos: ' . json_encode(session('combos')));
        }

        // return response()->json(
        //     [
        //         'status' => true,
        //         'message' => 'Combo selected successfully!',
        //         'data' => $combos
        //     ]
        // );
        return null;
    }
}
