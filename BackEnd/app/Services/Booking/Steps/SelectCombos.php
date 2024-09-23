<?php

namespace App\Services\Booking\Steps;

use App\Models\Combo;
use App\Services\Booking\Handlers\AbstractBookingStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SelectCombos extends AbstractBookingStep
{

    protected function process(Request $request): ?array
    {
        $comboData = $request->input('comboId'); // Lấy toàn bộ dữ liệu comboId từ request

        $combos = [];
        foreach ($comboData as $combo) {
            // Lấy combo theo id
            $comboModel = Combo::find($combo['id']);
            if ($comboModel) {
                // Gắn quantity cho từng combo
                $comboModel->quantity = $combo['quantity'] ?? 1; // Mặc định là 1 nếu không có quantity
                $combos[] = $comboModel;
            }
        }

        if (!empty($combos)) {
            // Lưu thông tin combos và số lượng vào session
            Session::put('combos', $combos);
        }

        return ['combos' => $combos];
    }
}
