<?php

namespace App\Http\Controllers\Api\Promotion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Promotion;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::all();
        return response()->json($promotions);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:promotions|max:50',
            'discount_percentage' => 'required|integer|min:1|max:100',
            'max_discount' => 'nullable|integer|min:0',
            'min_purchase' => 'nullable|integer|min:0',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
            'is_active' => 'required|boolean',
        ]);

        $promotion = Promotion::create($validated);

        return response()->json(['message' => 'Tạo mã khuyến mãi thành công.', 'promotion' => $promotion]);
    }
    // Hiển thị chi tiết một mã khuyến mãi
    public function show($id)
    {
        $promotion = Promotion::findOrFail($id);
        return response()->json($promotion);
    }

    // Hiển thị form chỉnh sửa (nếu cần giao diện)
    public function edit($id)
    {
        //
    }

    // Cập nhật thông tin mã khuyến mãi
    public function update(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|max:50|unique:promotions,code,' . $promotion->id,
            'discount_percentage' => 'required|integer|min:1|max:100',
            'max_discount' => 'nullable|integer|min:0',
            'min_purchase' => 'nullable|integer|min:0',
            'valid_from' => 'required|date',
            'valid_to' => 'required|date|after_or_equal:valid_from',
            'is_active' => 'required|boolean',
        ]);

        $promotion->update($validated);

        return response()->json(['message' => 'Cập nhật mã khuyến mãi thành công.', 'promotion' => $promotion]);
    }

    // Xóa mã khuyến mãi
    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();

        return response()->json(['message' => 'Xóa mã khuyến mãi thành công.']);
    }

    public function applyPromotion(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50', // Mã khuyến mãi
            'total_price' => 'required|numeric|min:0', // Tổng giá trị đơn hàng
        ]);

        // Tìm mã khuyến mãi
        $promotion = Promotion::where('code', $validated['code'])->first();

        // Kiểm tra mã khuyến mãi có tồn tại không
        if (!$promotion) {
            return response()->json(['message' => 'Mã khuyến mãi không tồn tại.'], 404);
        }

        // Kiểm tra mã có hiệu lực
        if (!$promotion->is_active || now()->lt($promotion->valid_from) || now()->gt($promotion->valid_to)) {
            return response()->json(['message' => 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn.'], 400);
        }

        // Kiểm tra giá trị tối thiểu để áp dụng
        if ($validated['total_price'] < $promotion->min_purchase) {
            return response()->json([
                'message' => 'Tổng giá trị đơn hàng chưa đạt mức tối thiểu.',
                'min_purchase' => $promotion->min_purchase
            ], 400);
        }

        // Tính toán giảm giá
        $discount = ($validated['total_price'] * $promotion->discount_percentage) / 100;
        if ($promotion->max_discount) {
            $discount = min($discount, $promotion->max_discount);
        }

        return response()->json([
            'message' => 'Áp dụng mã khuyến mãi thành công.',
            'discount' => $discount,
            'final_price' => $validated['total_price'] - $discount,
        ]);
    }
}
